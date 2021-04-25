// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/*
渲染器实现部分
1.使用three.js来实现
2.帧同步实现

*/
import $ from 'jQuery';
import * as THREE from 'three';
import {Vector2} from 'three';


import {DB} from './cache';
import {Resource} from './source';
import {Run} from './runtime';
import {Player} from './player';
import {tools} from './common/tools';
import {threeTransform} from './common/three';
import {World,Keys,Hooks,More} from './common/setting';
import {Preter} from'./preter';


let config={
    fix:[Math.PI*0.5,0,0],
    width:1032,
    height:600,
    fov:55,
    colorGround:0xEEEEEE,
    colorSky:0xFFFFFF,
    intensity:0.85,
    pano:['posx.jpg','negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ],
    sky:14,      //对应的资源id
}

//公共变量区域
const cvt = More.convert;
const scene = new THREE.Scene() //创建场景
const camera = new THREE.PerspectiveCamera(config.fov, config.width / config.height, 0.1*cvt, 1000*cvt);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const raycaster=new THREE.Raycaster();


//帧同步功能的实现,必须为函数，且不带参数，进行强制检查
interface AutoSync{
    ():void;
}
interface QueueSync{
    [key:string]:AutoSync;
}

let queue:QueueSync={};
const Frame={
    put:(name:string,fun:AutoSync)=>{
        queue[name]=fun;
        return true;
    },
    remove:(name:string)=>{
        return delete queue[name];
    },
    init:()=>{
        queue={};
        return true;
    },
}

//scene的操作部分，用于实现3D内容的更行
interface Fmt3Dobject{
    geometry?:Array<any>,
    light?:Array<any>,
    module?:Array<any>,
    elevation?:number,
}
const Stage={
    clear:()=>{
        scene.children=[];
    },
    add:(x:number,y:number,obj:Fmt3Dobject,elevation:number)=>{
        //1.添加geometry;
        if(obj.geometry!=undefined){
            const getGes=threeTransform.geometry;
            const arr:Array<THREE.Object3D>=getGes(x,y,obj.geometry,elevation);
			for(let i in arr) scene.add(arr[i]);
        }
        //2.处理lihgt
        if(obj.light!=undefined){
        
        }
        //3.处理module
        if(obj.module!=undefined){
            const transModule=threeTransform.module;
            const arr:Array<THREE.Object3D>=transModule(x,y,obj.module,elevation);
            for(let i in arr) scene.add(arr[i]);
        }
    },
    replace:(x:number,y:number,from:any,to:any)=>{
        //console.log('[render.ts=>replace()]:block['+x+','+y+']');
        //1.去除fake的box
        let arr:Array<any>=[];
        const {key,id}=from;
        for(let k in scene.children){
            const obj=scene.children[k],udata=obj.userData;
            if(udata.special && udata.special==key && udata.x==x && udata.y==y &&  udata.id==id){
                arr.push(obj);
            }
        }

        for(let i=0,len=arr.length;i<len;i++){
            scene.remove(arr[i]);
        }

        //2.添加替代的模型数据
        scene.add(to.data);
    },
    remove:(x:number,y:number,type:string)=>{
        let arr:Array<any>=[];
        for(let k in scene.children){
            const obj=scene.children[k],udata=obj.userData;
            //console.log(udata);
            if(udata.x==x && udata.y==y && udata.type==type){
                arr.push(obj);
            }
        }

        for(let i=0,len=arr.length;i<len;i++){
            scene.remove(arr[i]);
        }
    },
}

const self:any={
    structRange:(x:number,y:number,ext:Array<number>)=>{
        //console.log('[render.ts]ready to struct three data');
        const bks=self.posToRange([x,y],Player.get('world'),ext,[World.xMax,World.yMax]);
        const edit=Run.get('edit');
        //console.log(edit);
        for(let k in bks){
            const [w,bx,by]=bks[k];
            const main=tools.blockCacheKey(w,bx,by);
            const data=DB.get(main);
            const help=edit==null?false:((bx==edit[0]&&by==edit[1])?true:false);
            //1.处理数据，并直接显示rst里的非module部分
            for(let pt in data[Keys.processedKey]){
                if(!Preter[pt] || !Preter[pt][Hooks.three]) continue;
                const rst:Fmt3Dobject=Preter[pt][Hooks.three](data[Keys.processedKey][pt],data.elevation,help);
                Stage.add(bx,by,rst,data.elevation);
            }
        }
    },
    //获取地块数组的方法
    posToRange:(pos:Array<number>,world:number,extend:Array<number>,max:Array<number>):Array<Array<number>>=>{
        if(pos[0]>max[0] || pos[1]>max[1] || pos[0]<1 || pos[1]<1) return [[]];
        const [tx,ty]=extend,[x,y]=pos,[mx,my]=max;

        let arr:Array<Array<number>>=[];
        let startX=x-tx,startY=y-ty,dx=0,dy=0;
        if(startX<1){
            dx=startX-1;
            startX=1;
        }

        if(startY<1){
            dy=startY-1;
            startY=1;
        }

        const cx=tx+tx+1+dx,cy=ty+ty+1+dy;
        for(let i=0;i<cx;i++){
            if(startX+i>mx) continue;
            for(let j=0;j<cy;j++){
                if(startY+j>my) continue;
                arr.push([world,startX+i,startY+j]);
            }
        }
        return arr;
    },
    sun:function(x:number,y:number,cfg:any={colorGround:config.colorGround,colorSky:config.colorSky,intensity:config.intensity}){
        const s=World.side,hs=0.5*s;
        const scfg={type:'sun',position:[hs,hs,s+s+s+s],colorSky:cfg.colorSky,colorGround:cfg.colorGround,intensity:cfg.intensity,help:true};
        const va=0;
        const sun=threeTransform.light(x,y,[scfg],va);
        scene.add(sun[0]);
    },

    pano:(rotation:number=0)=>{
        const dt=Resource.get(config.sky);
        const path=dt==null?'static/pano/':dt.path+'/'+dt.hash+'/';
        scene.background=new THREE.CubeTextureLoader().setPath(path).load(config.pano);
        scene.background.rotation=rotation;
    },

    activeBlock:(x:number,y:number)=>{
    
        const w=Player.get('world');
        const main=tools.blockCacheKey(w,x,y);
        const data=DB.getHash(main,Keys.processedKey);
        const va=data.earth.oz;

        const color='#FFFF00',h=0.3*cvt,hf=0.5*h;
        const s=World.side*cvt,cc=0.5*s,zj=Math.PI*0.5;

        const oz=hf+va;
        const arr=[
            {type:'plane',data:[s,h],position:[cc,0,oz],rotation:[-zj,0,0],info:{type:'active'},cfg:{repeat:[1,1],color:color}},
            {type:'plane',data:[h,s],position:[cc+cc,cc,oz],rotation:[0,-zj,0],info:{type:'active'},cfg:{repeat:[1,1],color:color}},
            {type:'plane',data:[s,h],position:[cc,cc+cc,oz],rotation:[zj,0,0],info:{type:'active'},cfg:{repeat:[1,1],color:color}},
            {type:'plane',data:[h,s],position:[0,cc,oz],rotation:[0,zj,0],info:{type:'active'},cfg:{repeat:[1,1],color:color}},
        ];

        const getGes=threeTransform.geometry;
        const objs:Array<any>=getGes(x,y,arr,va);

        for(let i in objs) scene.add(objs[i]);
        return true;
    },
    
    playerSync:()=>{
        const pos=Player.get('position'),ros=Player.get('rotation'),fix=config.fix
        const [x,y]=Player.get('block'),side=World.side*cvt;

        const px=side*(x-1)+pos[0],py=side*(y-1)+pos[1];
        camera.position.set(px,py,pos[2]+Player.get('height'));
        camera.rotation.set(ros[0]+fix[0],ros[1]+fix[1],ros[2]+fix[2]);
    },
    animate:()=>{
        Run.set('frameID',requestAnimationFrame(self.animate));     //保存request的id
        for(let name in queue)if(queue[name]) queue[name]();        //运行帧同步的方法
        renderer.render(scene, camera);                             //渲染3D场景
    }
}

//入口方法，外部调用的入口，这里处理好所有的逻辑
interface CfgShow{
    width?:number,  
    height?:number,    
}
function autoShow(container:string,cfg:CfgShow={}) {
    //console.log('[render.ts => autoShow()] run?');
    Stage.clear();      //清除scene显示的3D物体

    //1.根据配置，重写缓存高度
    if(cfg.width)config.width=cfg.width;
    if(cfg.height)config.height=cfg.height;

    const fid=Run.get('frameID');
    if(fid!=null) cancelAnimationFrame(fid);
    //console.log('[render.ts => autoshow()] frame id:'+fid);

    const sel = $("#"+container);
    renderer.setSize(config.width, config.height);
    sel.html(renderer.domElement);
    const [x,y]=Player.get('block');
    self.sun(x,y);
    
    //2.构建数据，并添加到scene里，就能正常显示了
    self.structRange(x,y,Player.get('extend'));    
    Frame.put('render',self.playerSync);     //帧同步的实现

    //3.特殊显示编辑的地块
    const edit=Run.get('edit');
    if(edit!=null){
        //console.log('[render.ts=>autoshow()] ready to show edit border');
        let [ax,ay]=edit;
        self.activeBlock(ax,ay);
    }
    
    //4.显示全景天空
    self.pano();

    //5.运行动画，启动3D渲染
    self.animate();
}


function Raycast(mouse:Vector2,x:number,y:number){
    //console.log(mouse);
    if(mouse==null) return false;
    raycaster.setFromCamera(mouse,camera);
    const objs=raycaster.intersectObjects(scene.children,true);
    for(let i in objs){
        const obj=objs[i],udata=obj.object.userData;
        if(udata.x==x && udata.y==y && udata.skip!=true){
            return udata;
        } 
    }
    return false;
}


export {autoShow,Raycast,Stage,Frame};