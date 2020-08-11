// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import $ from 'jQuery';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const config={
    fov:55,
    width:960,
    height:720,
    path:'static/pano/',
    pano:[ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ],
}

//let ctn:any=null;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(config.fov, config.width / config.height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

let request:any;
let controller:any;

const self={
    init:(container:string,imgs:any=null)=>{
        const sel = $("#"+container);
        sel.html('');
        renderer.setSize(config.width, config.height);
        sel.html(renderer.domElement);
        controller=new OrbitControls( camera, renderer.domElement );

        camera.position.set( 0, 20, 100 );
        controller.update();
       
        const group=self.ax();
        scene.add(group);
        

        scene.background=new THREE.CubeTextureLoader().setPath(config.path).load(config.pano);
        if(imgs !=null && imgs.length==6){
            scene.background=imgs;
        }
        //console.log(scene.background);
        self.animate();
    },
    clear:()=>{
        cancelAnimationFrame(request);
        scene.dispose();
        renderer.dispose();
    },
    getIndex:()=>{
        return config.pano;
    },
    //刷新backgroud，实现换全景图
    fresh:(imgs:Array<any>)=>{
        //if(scene.background==null || !scene.background.image) return false;
        let ns:Array<any>=[];
        for(let i=0,len=imgs.length;i<len;i++){
            if(imgs[i]==null){
                ns.push(config.pano[i]);
            }else{
                ns.push(imgs[i]);
            }
        }
        scene.background=new THREE.CubeTextureLoader().load(ns);
        return true;
    },

    animate:()=>{
        request = requestAnimationFrame(self.animate);
        controller.update();
        renderer.render(scene, camera);                             //渲染3D场景        
    },

    ax:(w:number=20)=>{
        const h=0.5*w,x=0.3;
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
    checkPano:(list:any)=>{
        //check:any={'negx.jpg':false,'negy.jpg':false,'negz.jpg':false,'posx.jpg':false,'posy.jpg':false,'posz.jpg':false}
        let check:any={};
        for(let i=0,len=config.pano.length;i<len;i++){
            check[config.pano[i]]=false;
        }

        for(const name in list){
            let key=name.toLowerCase();
            if(check[key]!==undefined)check[key]=true;
        }
        
        for(let k in check){
            if(check[k]==false) return false;
        }
        return true;
    },  
}
export {self as Pano}