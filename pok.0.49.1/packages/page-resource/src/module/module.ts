// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import $ from 'jQuery';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {ColladaLoader} from '../loaders/ColladaLoader';

const config={
    fov:55,
    width:960,
    height:720,
}

const sourceLoader:any={
    fbx:new FBXLoader(),
    dae:new ColladaLoader(),
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(config.fov, config.width / config.height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

let controller:any;

const self={
    init:(container:string)=>{
        //console.log(container);
        const sel = $("#"+container);
        renderer.setSize(config.width, config.height);
        sel.html(renderer.domElement);
        controller=new OrbitControls( camera, renderer.domElement );

        camera.position.set( 0, 2, 10 );
        controller.update();

        //scene.up.set(0,0,1);
        scene.background=new THREE.Color(0xeeeeee);
        
        scene.add(self.sun());
        scene.add(self.ax());

        self.animate();
    },

    animate:()=>{
        requestAnimationFrame(self.animate);
        controller.update();
        renderer.render(scene, camera);                             //渲染3D场景       
    },
    sun:function(){
        const colorSky=0xFFFFFF;
        const colorGround=0xFFFFFF;
        const intensity=1;
        const light = new THREE.HemisphereLight(colorSky,colorGround,intensity);
        light.position.set(0,0,3);
        return light;
    },

    ax:(w:number=3)=>{
        const h=0.5*w,x=0.03;
        const mx=new THREE.LineBasicMaterial({color:'#FF0000',opacity:1,transparent:true});
		const my=new THREE.LineBasicMaterial({color:'#00FF00',opacity:1,transparent:true});
		const mz=new THREE.LineBasicMaterial({color:'#0000FF',opacity:1,transparent:true});
		const gx=new THREE.BoxBufferGeometry(w,x,x);
		const gy=new THREE.BoxBufferGeometry(x,w,x);
        const gz=new THREE.BoxBufferGeometry(x,x,w);
        const group=new THREE.Group();
            
        const zx=new THREE.Mesh(gx, mx);
        zx.position.set(h,0,0);
        group.add(zx);
			
		const zy=new THREE.Mesh(gy, my);
        zy.position.set(0,h,0);
        group.add(zy);
			
		const zz=new THREE.Mesh(gz, mz);
        zz.position.set(0,0,h);
        group.add(zz);

        return group;
    },

    getLoader:(type:string='dae')=>{
        if(!sourceLoader[type]) return null;
        return sourceLoader[type];
    },
    checkDae:(arr:Array<any>)=>{
        for(let i in arr){
            const row=arr[i];
            if(!row.name) continue;
            const suffix=row.name.split('.').pop().toLowerCase();
            if(suffix=='dae') return row;
        }
        return null;
    },
    //刷新backgroud，实现换全景图
    fresh:(URIdata:any,type:string)=>{
        scene.children=[];      //清除场景里的信息
        scene.add(self.sun());
        scene.add(self.ax());

        console.log('[previewer.ts=>fresh()] type:'+type);
        const loader=self.getLoader(type);

        switch (type) {
            case 'fbx':
                loader.load(URIdata,(obj:any)=>{
                    scene.add(obj);
                });
                break;
            case 'dae':
                loader.prepare(URIdata);

                loader.load(URIdata,(obj:any)=>{
                    console.log(obj);
                    scene.add(obj.scene);
                });
                break;
            default:
                break;
        }
    },
}
export {self as Module}