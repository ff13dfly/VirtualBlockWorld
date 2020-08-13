
import $ from 'jQuery';
import {Md5} from 'ts-md5/dist/md5';
import {ParallelHasher} from 'ts-md5/dist/parallel_hasher';

import { ApiPromise } from '@polkadot/api';

//import {Att} from './attachment';
import {tools} from '../block/common/tools';

const me:any={
    url:'http://localhost/apps/packages/apps/dist/source/save.php',
}

interface CKCompress{
    (code:Blob,orientation:number):void;
}

let server:ApiPromise;
const self:any={
    init:(container:string,api:any)=>{
        //1.保存好rpc服务器
        server=api;

        //2.绑定操作
        $('#'+container).off('change').on('change',self.change);
    },
    change:(ev:any)=>{
        if(!ev.target || !ev.target.files || !ev.target.files[0]) return false;
        const file:File=ev.target.files[0];
        const cfg:any=self.getCompressConfig();     //获取压缩的配置参数
        self.compress(file,cfg,(file:Blob,orientation:number)=>{
            console.log(file);
            //return false;
            //1.获取token，生成image的数据
            const hash=self.encry(file.size.toString());
            const owner='5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y';

            //const arr=file.name.split('.');
            const type='jpg';           //这里存在严重问题，需要处理
            const encode=tools.encode;
            server.tx.vBlock.sourceInit(encode(hash),encode(type))
            .signAndSend(owner, ({events, status}) => {
                console.log(status);
                console.log(events);
                //2.上传数据到图像服务器
                const token='aa378';
                const ucfg:any={
                    orientation:orientation.toString(),
                    hash:hash,
                    token:token,
                }
                self.upload(file,ucfg);
            });

            
        });
        return true;
    },
    encry:(target:string|Uint8Array,ck:any=()=>{})=>{
        let hash;
        if(typeof target == 'string'){
            hash=Md5.hashAsciiStr(target);
        }else{
            let hasher = new ParallelHasher('/path/to/ts-md5/dist/md5_worker.js');
            hasher.hash(target).then(function(code:any) {
                console.log('md5 of fileBlob is', code);
                ck && ck(code);
            });
        }
        return hash;
    },
    upload:(file:Blob,cfg:any,url:string=me.url)=>{

        const ikey='photo';
        const formData = new FormData();
        formData.append('token', cfg.token);
        formData.append('hash', cfg.hash);
        formData.append('orientation', cfg.orientation);
        formData.append('file_key', ikey);
        formData.append(ikey, file);
        
        $.ajax({
            url: url,
            type:'post',async:true,processData:false,contentType:false,data:formData,timeout:6000,
            success:(rsp:string)=>{
                const res=JSON.parse(rsp);
                if(!res.success) return false;				//保存好图像ID
                return true;
            },
            error:function (xhr,res) {
                console.log(res);
            }
        });
    },

    getCompressConfig:()=>{
        const cfg:any={width:1024,quality:0.8}      //图像的配置
        return cfg;
    },
    compress:(fa:File,cfg:any,ck:CKCompress)=>{
        //console.log(fa);
        let ro=0;
        if(fa.size < Math.pow(1024, 2) || fa.type!='image/jpeg') return ck && ck(fa,ro);		//小文件和非jpg文件不压缩
        
        const reader= new FileReader();
        reader.readAsDataURL(fa);
        reader.onload=function(e){
            let img=new Image();
            if(!e.target || e.target.result==null || typeof e.target.result!='string') return ck &&ck(fa,ro);
            img.src=e.target.result;
            img.onload=(ee:any)=>{
                //if(!ee.path || !ee.path[0] || !ee.path[0].src) return ck &&ck(fa,ro);
                console.log('compressed');
                //处理图像的旋转
                if(ee.path[0] && ee.path[0].src){
                    const b64=ee.path[0].src;
                    ro=self.getOrientation(self.base64ToArrayBuffer(b64));
                }

                const ratio=cfg.width/img.width,w=img.width*ratio,h=img.height*ratio;
                const cvs=document.createElement('canvas')
                let ctx:any=cvs.getContext('2d');
                let anw:any= document.createAttribute("width"),anh:any=document.createAttribute("height");
                anw.nodeValue=w;
                anh.nodeValue=h;
                cvs.setAttributeNode(anw);
                cvs.setAttributeNode(anh);
                
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, w, h);
                ctx.drawImage(img, 0, 0, w, h);
                
                const base64 = cvs.toDataURL('image/jpeg', cfg.quality),bytes = window.atob(base64.split(',')[1]);  // 去掉url的头，并转换为byte
                
                
                let ab = new ArrayBuffer(bytes.length),ia = new Uint8Array(ab);
                for (let i = 0; i < bytes.length; i++)ia[i] = bytes.charCodeAt(i);

                //console.log(ia);
                
                let fb:any = new Blob([ab], {type:'image/jpeg'});
                fb.name = fa.name;
                ck && ck(fb,ro);
            }
        }
    },
    getOrientation:(arr:ArrayBuffer)=>{
        const dataView = new DataView(arr);
        let length = dataView.byteLength;
        let orientation,exifIDCode,tiffOffset,firstIFDOffset,littleEndian,endianness,appStart,ifdStart,offset,i;
        if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
            offset = 2;
            while (offset < length){
                if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
                    appStart = offset;
                    break;
                }
                offset++;
            }
        }
        
        if (appStart) {
            exifIDCode = appStart + 4;
            tiffOffset = appStart + 10;
            if(self.getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
                endianness = dataView.getUint16(tiffOffset);
                littleEndian = endianness === 0x4949;
                if (littleEndian || endianness === 0x4D4D /* bigEndian */) {
                    if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
                        firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian);
                        if (firstIFDOffset >= 0x00000008) {
                            ifdStart = tiffOffset + firstIFDOffset;
                        }
                    }
                }
            }
        }
        
        if (ifdStart){
            length = dataView.getUint16(ifdStart, littleEndian);
            for (i = 0; i < length; i++) {
                offset = ifdStart + i * 12 + 2;
                //0x0112是旋转对应的位置
                if (dataView.getUint16(offset, littleEndian) === 0x0112) {
                    offset += 8;
                    orientation = dataView.getUint16(offset, littleEndian);
                    // Override the orientation with its default value for Safari (#120)
                    /*if (IS_SAFARI_OR_UIWEBVIEW) {
                        dataView.setUint16(offset, 1, littleEndian);
                    }*/
                    break;
                }
            }
        }
        return orientation;
    },
    getStringFromCharCode:(dataView:DataView, start:number, length:number)=>{
        let str = '',i;
        for (i = start, length += start; i < length; i++) {
            str += String.fromCharCode(dataView.getUint8(i));
        }
        return str;
    },
    base64ToArrayBuffer:(base64:string)=>{
        base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
        const binary = atob(base64);
        const len = binary.length;
        const buffer = new ArrayBuffer(len);
        let view = new Uint8Array(buffer);
        for (let i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
        }
        return buffer;
    }
}

export {self as Uper}