import * as THREE from 'three';
import {World,More} from './setting';
import {clone} from './tools';
import {Resource} from '../source';
import {Stage} from '../render';

import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {ColladaLoader} from 'three/examples/jsm/loaders/ColladaLoader';

const textureLoader=new THREE.TextureLoader();

const me={
    fake:'fkkey',
}

const sourceLoader={
    fbx: FBXLoader,
    dae: ColladaLoader,
}

//3D物体的功能配置
interface Config {
    [key:string]:any;
}

//3D物体的附加信息
interface Info {
    [key:string]:any;
}

let MT:any={};

//输出的基础3D物体
const self={
    module:(x:number,y:number,mds:Array<any>,elevation:number)=>{
        //console.log(mds);
        let rst:Array<any>=[];
        const len=mds.length;
        const cvt=More.convert,s=World.side*cvt;

        //const ids:Array<number>=[];
        for(let i=0;i<len;i++){
            const md=mds[i];
            const arr:any=self.getModule(md.resource,(data:any)=>{
                

                const pos=md.position,px=s*(x-1)+pos[0],py=s*(y-1)+pos[1],pz=pos[2];
                const [rx,ry,rz]=md.rotation;
                const [sx,sy,sz]=md.scale;
                
                data.position.set(px,py,pz);
                data.rotation.set(rx,ry,rz);
                data.scale.set(sx,sy,sz);
                //data.userData={key:md.info.type,id:i};
                
                const from={special:me.fake,id:i};
                const to={key:md.info.type,id:i,data:data}
                
                Stage.replace(x,y,from,to);
            });

            
            if(arr!=null){
                for(let j in arr)rst.push(arr[j]);
            }else{

                //2.添加fake到场景里，准备加载用
                const pos=md.position,px=s*(x-1)+pos[0],py=s*(y-1)+pos[1],pz=pos[2];
                const fcfg={edge:true,color:'#FF00FF',opacity:0.2}
                const finfo={type:md.info.type,id:i,x:x,y:y,special:me.fake}
                const arr=self.box({data:md.data,position:[px,py,pz],rotation:md.rotation},fcfg,finfo);
                for(let j in arr)rst.push(arr[j]);
            }
        }
        return rst;
    },
    light:(x:number,y:number,lights:Array<any>,va:number)=>{
        const cvt=More.convert,s=World.side*cvt;
        let rst:Array<any>=[];
        for(let i in lights){
            const b=lights[i],type=b.type;
            const pos=b.position,px=s*(x-1)+pos[0],py=s*(y-1)+pos[1],pz=pos[2];
            switch (type){
                case 'sun':
                    const light = new THREE.HemisphereLight(b.colorSky,b.colorGround,b.intensity);
                    //light.castShadow = true
                    light.position.set(px,py,pz);
                    light.userData={x:x,y:y,type:'sun'};
                    rst.push(light)
                    
                    if(b.help){
                        const help=new THREE.HemisphereLightHelper( light, 10*cvt);
                        help.userData={x:x,y:y,type:'sun'};
                        rst.push(help)
                    }
                break;
            
                default:
                
                break;
            }
        }
        return rst;
    },
    
    //计算3D物体的入口
    geometry:(x:number,y:number,ges:Array<any>,elevation:number)=>{
        let rst:Array<any>=[];
        const cvt=More.convert,s=World.side*cvt;
        for(let k in ges){
            let row=ges[k]; //可以增加对group的支持，如果row是Array的话，自动生成group
            //console.log('common/three.ts=>geometry()');
            //console.log(row);
            const type=row.type;
            const pos=row.position,px=s*(x-1)+pos[0],py=s*(y-1)+pos[1],pz=pos[2];
            row.info.x=x;
            row.info.y=y;

            //if(row.info.type=='wall')console.log('[three.ts => geometry]'+JSON.stringify(row));

            let arr:Array<any>;
            switch (type) {
                case 'box':
                    arr=self.box({data:row.data,position:[px,py,pz],rotation:row.rotation},row.cfg,row.info);
					for(let j in arr)rst.push(arr[j]);
                    break;
                case 'plane':
                    arr=self.plane({data:row.data,position:[px,py,pz],rotation:row.rotation},row.cfg,row.info);
                    for(let j in arr)rst.push(arr[j]);
                    break;
                case 'line':
                    arr=self.line({data:row.data,position:[px,py,pz],rotation:row.rotation},row.cfg,row.info);
                    for(let j in arr)rst.push(arr[j]);
                    break;
                default:
                    break;
            }
            
        }
        return rst
    },
    
    box:(b:any,cfg:Config,info:Info)=>{
        //console.log(cfg);

        let rst=[];
        const bs=b.data,pos=b.position,ro=b.rotation;
        const cvt=More.convert,fix=0.01*cvt;

        // if(info.type=='wall'){
        //     console.log(b);
        //     console.log(cfg)
        // } 
        //根据配置，填充不同的材质
        if(!cfg.only){
            const rpx=cfg.repeat?(cfg.repeat[0]||1):1,rpy=cfg.repeat?(cfg.repeat[1]||1):1;
            let mm:any;
            if(!cfg.texture){
                mm=self.getLineBasicMaterial(cfg.color,cfg.opacity);
            }else{
                const {id,repeat}=cfg.texture;
                mm=self.getMeshPhongMaterial(id,repeat[0],repeat[1]);
                //if(info.type=='wall')console.log(mm);
                if(mm==null) mm=self.getLineBasicMaterial(cfg.color,cfg.opacity);
            }
            const gg = new THREE.BoxBufferGeometry(bs[0], bs[1], bs[2]);

            const xx:any = new THREE.Mesh(gg, mm);
            xx.position.set(pos[0],pos[1],cfg.texture?pos[2]-fix:pos[2]);
            xx.rotation.set(ro[0],ro[1],ro[2]);
            if(cfg.repeat && cfg.tid){
                xx.material.map.repeat.set(rpx,rpy);
            }
            
            xx.receiveShadow=cfg.receiveShadow?true:false;
            xx.castShadow=cfg.castShadow?true:false;
            if(cfg.tid){
                xx.material.map.wrapS = THREE.RepeatWrapping;
                xx.material.map.wrapT = THREE.RepeatWrapping;
            }
            xx.userData=info;
            rst.push(xx);
        }
    
        if(cfg.edge){
            const gg = new THREE.BoxBufferGeometry(bs[0], bs[1], bs[2]);
            const eg=new THREE.EdgesGeometry(gg);
            const mm=self.getLineBasicMaterial(cfg.color?cfg.color:'#FFF000',1);
            const eline=new THREE.LineSegments(eg,mm);
            eline.rotation.set(ro[0],ro[1],ro[2]);
            eline.position.set(pos[0],pos[1],pos[2]);
            
            const einfo=clone(info);		//需要复制，不然所有的都检测不出
            einfo.skip=true;						//边缘不参与点击检测，跳掉
            eline.userData=einfo;
            rst.push(eline);
        }
        
        if(cfg.help){
            var mm=self.getLineBasicMaterial(cfg.color,cfg.opacity)
            var gg = new THREE.BoxBufferGeometry(bs[0], bs[1], bs[2]);
            var hh = new THREE.Mesh(gg, mm);
            hh.position.set(pos[0],pos[1],pos[2]);
            hh.rotation.set(ro[0],ro[1],ro[2]);
            hh.userData=info;
            rst.push(hh)
        }
        
        return rst;
    },
    plane:(b:any,cfg:Config,info:Info)=>{
        let rst=[];
        const bs=b.data,pos=b.position,ro=b.rotation;
        const cvt=More.convert,fix=0.01*cvt;
        
        //const rpx=cfg.repeat[0]||1,rpy=cfg.repeat[1]||1
        const gg = new THREE.PlaneBufferGeometry(bs[0], bs[1]);
        //if(cfg.tid){
        //    var mm=self.getMeshPhongMaterial(cfg.tid,rpx,rpy);
        //}else if(cfg.color){
            const mm=self.getLineBasicMaterial(cfg.color);
            if(cfg.opacity)	mm.opacity=cfg.opacity;
        //}
        
        const xx = new THREE.Mesh(gg, mm);
        //console.log(pos[2])
        xx.position.set(pos[0],pos[1],cfg.texture?pos[2]-fix:pos[2]);
        xx.rotation.set(ro[0],ro[1],ro[2]);
        xx.userData=info;
        
        
        rst.push(xx);
        
        return rst;
    },

    line:(b:any,cfg:Config,info:Info)=>{
        let rst=[];
        const pos=b.position,ro=b.rotation;

        let ps:any=[];
        for(let i=0,len=b.data.length;i<len;i++){
            const pp=b.data[i];
            ps.push(new THREE.Vector3(pp[0], pp[1], pp[2]));
        } 
        const gg = new THREE.BufferGeometry().setFromPoints(ps);
        const mm=self.getLineBasicMaterial(cfg.color);

        const xx = new THREE.Line(gg, mm);
        xx.position.set(pos[0],pos[1],pos[2]);
        xx.rotation.set(ro[0],ro[1],ro[2]);
        xx.userData=info;
        rst.push(xx);
        return rst;
    },

    //历史遗留方法
    outline:(size:Array<number>,pos:Array<number>,ro:Array<number>,pd:number,color:string='#FF0000')=>{
        const d=pd+pd
        const gg = new THREE.BoxBufferGeometry(size[0]+d, size[1]+d, size[2]+d);
        const eg=new THREE.EdgesGeometry(gg);
        const mm=self.getLineBasicMaterial(color);
        let eline=new THREE.LineSegments(eg,mm);
        eline.position.set(pos[0],pos[1],pos[2]+d);
        eline.rotation.set(ro[0],ro[1],ro[2]);
        return eline;
    },

    //颜色贴图统一管理
    getLineBasicMaterial:(color:string,opacity:number=1)=>{
        //console.log('line:'+tid+',repeat:'+rpx+','+rpy)
        const pre='color_',key=pre+color+(opacity?('_'+opacity):'');
        if(!MT[key]){
            const cfg=opacity?{color:color,opacity:opacity,transparent:true}:{color:color}
            MT[key]=new THREE.LineBasicMaterial(cfg);
        }
        return MT[key];
    },

    //phong贴图统一管理
    getMeshPhongMaterial:(tid:number,rpx:number,rpy:number)=>{
        const pre='phong_',key=pre+tid+'_'+rpx+'_'+rpy;
        if(!MT[key]){
            const tt=self.getTexture(tid);
            if(tt==null) return null;
            tt.repeat.x=rpx;
			tt.repeat.y=rpy;
            const rst = new THREE.MeshPhongMaterial({color: 0xFFFFFF,map:tt});
            MT[key]=rst;
        }
        return MT[key];
    },
    exsistModule:(id:number)=>{
        const pre='md_',key=pre+id;
        if(!MT[key]) return false;
        return true;
    },
    getModule:(id:number,ck:any)=>{
        const pre='md_',key=pre+id;
        if(!MT[key]){
            const raw=Resource.get(id);
            //console.log('[three.ts=>getModule()] id '+id);
            if(raw==null) return null;
            const loader=self.getLoader(raw.format);
            if(loader==null) return null;
            const target=self.getTargetBySuffix(raw.path,raw.hash,raw.format);
            //console.log('[common/three.ts => getModule()]'+target);
            if(target==null) return null;
            
            loader.load(target,(data:any)=>{
                MT[key]=data;
                //console.log('read file:'+key)
                const result=self.getMeshBySuffix(data,raw.format);
                ck && ck(result);
            });
            return true;
        }else{
            //console.log('read cache:'+key);
            ck && ck(MT[key].clone());
            return true
        }
    },
    
    getLoader:(suffix:string)=>{
        switch (suffix) {
            case 'fbx':
                return new sourceLoader.fbx;
                break;
            case 'dae':
                return new sourceLoader.dae;
                break;
            default:
                return null
                break;
        }
    },
    getTargetBySuffix:(path:string,hash:string,suffix:string)=>{
        const defaultEntryFileName='entry';
        switch (suffix) {
            case 'jpg':
            case 'fbx':
                return path+hash+'.'+suffix;
                break;
            case 'dae':
                return path+hash+'/'+defaultEntryFileName+'.'+suffix;
                break;
            default:
                return null
                break;
        }
    },
    getMeshBySuffix:(data:any,suffix:string)=>{
        switch (suffix) {
            case 'fbx':
                return data;
                break;
            case 'dae':
                console.log(data);
                return data.scene.children[0];
                break;
            default:
                return null
                break;
        }
    },
    getTexture:(id:number)=>{
        //console.log('[three.ts=>getTexture()] texture id:'+id);
        const pre='img_',key=pre+id;
        if(!MT[key]){
            const raw=Resource.get(id);
            if(raw==null || !raw.path) return null;
            const target=self.getTargetBySuffix(raw.path,raw.hash,raw.format);
            //console.log('[three.ts=>getTexture()]:'+target);
            if(target==null) return null;
            const txt=textureLoader.load(target);
            MT[key]=txt;
        }
        return MT[key];
    },
}

export{self as threeTransform}