
// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//import {ThreeRaw} from '../common/format';
const reg={
    name:"lattice",
    type:"basic",
    version:1,
}

const self={
    format:function(arr:Array<Array<any>>,cvt:number){
        let data:Array<any>=[];
        let loadTexture:Array<number>=[];       //放需要预加载的texture的id值
        for(let i=0,len=arr.length;i<len;i++){
            data.push({
                x:0,y:0,z:0,
                ox:0,oy:0,oz:0,
                rx:0,ry:0,rz:0,
                texture:0,
            })
        }
        return {data:data,texture:loadTexture};
    },

    //转换成3D数据的方法实现
    threeTransform:function (arr:Array<any>,va:number,help:boolean){
        let geometry:Array<any>=[];
        let light:Array<any>=[];
        for(let i=0,len=arr.length;i<len;i++){
            const b=arr[i];
            let raw={
                type:'box',
                data:[b.x,b.y,b.z],
                position:[b.ox,b.oy,b.oz+va],
                rotation:[b.rx||0,b.ry||0,b.rz||0],		//bug,这里等stop数据全部处理过之后，直接取值
                config:{color:'#EEEEEE',opacity:0.4,help:true,edge:true,only:true},
                info:{type:reg.name,id:i},
            }
            geometry.push(raw);
        }
        return {geometry:geometry,light:light,elevation:va};
    },
};

export {self as lattice};