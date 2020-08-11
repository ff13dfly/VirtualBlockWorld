// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {Md5} from 'ts-md5/dist/md5';
import {ParallelHasher} from 'ts-md5/dist/parallel_hasher';
import *  as Zip from 'jszip';
import $ from 'jQuery';

import {tools} from './tools';
import { ApiPromise } from '@polkadot/api';

const config:any={
    url:'http://localhost/VirtualBlockWorld/pok.0.49.1/packages/apps/build/source/save.php?cat=',
    //url:'http://61.147.107.5/packages/apps/dist/source/save.php?cat=',
    permit:{
        texture:true,
        pano:true,
        module:true,
    },
    step:2,
    depth:4,
    basic:'source/',
    salt:'saltme,222',      //as the same as the server
}

interface cfgUpload{
    owner:string;
    cat:string;
    token:string;
    suffix:string;
}

const self:any={
    up:(file:File,api:ApiPromise,cfg:cfgUpload,ck:any)=>{    
        //console.log('[basic/upload.ts => up()]');
        //console.log(api);
        const hash=self.getRandomHash();

        self.getCheckHash(file,(md5:string)=>{
            const suffix=!cfg.suffix?self.getSuffix(file.name):cfg.suffix;
            const encode=tools.encode;
            api.tx.vbw.sourceInit(encode(hash),encode(suffix),cfg.owner).signAndSend(cfg.owner, (result:any) => {
                console.log(`Current status is ${result.status}`);
                console.log(result);
                
                //2.上传数据到图像服务器
                const ucfg:any={
                    hash:hash,
                    check:md5,
                    token:cfg.token,
                    cat:cfg.cat,            //上传类型
                }
                self.toServer(file,ucfg,(res:any)=>{
                    //3.更行区块链的状态
                    ck && ck(res);
                });
            });
        });
    },
    //文件上传到服务器的操作
    toServer:(file:Blob,cfg:any,ck:any)=>{
        //console.log(file);

        const ikey='sky';
        const formData = new FormData();
        formData.append('token', cfg.token);
        formData.append('hash', cfg.hash);
        formData.append('file_key', ikey);
        formData.append(ikey, file);

        const url=self.getServerAPI(cfg.cat);
        $.ajax({
            url: url,
            type:'post',async:true,processData:false,contentType:false,data:formData,timeout:6000,
            success:(rsp:string)=>{
                const res=JSON.parse(rsp);
                //console.log(res);

                ck && ck(res);
            },
            error:function (xhr:any,res:any) {
                ck && ck(res);
            }
        });
    },

    //生成随机hash的方法，用来备案在substrate里
    getRandomHash:()=>{
       return Md5.hashAsciiStr(new Date().toString());
    },

    //获取文件的hash值的方法，用于文件保存
    getCheckHash:(file:File,ck:any)=>{
        //console.log('[basic/upload.ts => getCheckHash()]');
        const reader= new FileReader();
        reader.readAsBinaryString(file);      //读成binarystring，zip就可以处理啦
        reader.onload=function(e){
            if(!e.target || !e.target.result) return ck && ck(null);
            
            self.encry(e.target.result,ck);
        };
    },

    //获取文件的后缀名
    getSuffix:(name:string)=>{
        const arr=name.split('.');
        if(arr.length<1) return false;
        return arr[arr.length-1].toLowerCase();
    },

    //获取上传接口
    getServerAPI:(type:string,basic:string=config.url)=>{
        return basic+type
    },

    //加密计算出md5的方法
    encry:(target:string|Uint8Array,ck:any)=>{
        let hash;
        if(typeof target == 'string'){
            hash=Md5.hashAsciiStr(target);
            ck && ck(hash);
        }else{
            let hasher = new ParallelHasher('/path/to/ts-md5/dist/md5_worker.js');
            hasher.hash(target).then(function(code:any) {
                ck && ck(code);
            });
        }
    },

    transPath:(hash:string,format:string,step:number=config.step,depth:number=config.depth,pre:string=config.basic)=>{
        const mhash= Md5.hashAsciiStr(hash+config.salt).toString();
        let tg=pre;
        for(let i=0;i<depth;i++){
            tg+=mhash.substr(i*step,step)+'/';
        }
        return tg;
    },
    //读取zip文件folder下的文件列表
    folder:(target:File,ck:any)=>{
        const reader= new FileReader();
        reader.readAsBinaryString(target);      //读成binarystring，zip就可以处理啦
        reader.onload=function(e){
            if(!e.target || !e.target.result) return ck && ck();
            Zip.loadAsync(e.target.result).then((fds:any)=>{
                ck && ck(fds);
            });
        };
    },

    //读取图像的文件内容
    content:(zfile:any,name:string,ck:any)=>{
        const suffix=name.split('.').pop();
        const code=zfile.file(name).async('base64');
        code.then((txt:string)=>{
            const ctx=`data:image/${suffix};base64,${txt}`;
            ck && ck(ctx);
        });
    },

    direct:(target:File,ck:any)=>{
        const reader= new FileReader();
        reader.readAsDataURL(target);      //读成binarystring，zip就可以处理啦
        reader.onload=function(e){
            if(!e.target || !e.target.result) return ck && ck();
            ck && ck(e.target.result);
        };
    },

    /**********基础功能方法************/
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
    },

}

export {self as Uper}
