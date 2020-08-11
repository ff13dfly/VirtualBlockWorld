// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {tools,clone} from '../common/tools';

const reg={
    name:"wall",
    type:"basic",
    version:1,
    //[[x,y,z],[ox,oy,oz],[rx,ry,rz],mid,[rpx,rpy,....]]
    default:[[1.5,1,2],[3,1.3,0],[0,0,0],2,[]],
}

interface fmtModule{
    x:number,y:number,z:number,
    ox:number,oy:number,oz:number,
    rx:number,ry:number,rz:number,
    texture:number,more:Array<number>,
}

const self={
    format:function(arr:Array<any>,cvt:number){
        //console.log('[wall.ts => format()]'+JSON.stringify(arr));
        let loadTexture:Array<number>=[];       //放需要预加载的texture的id值
        let rst:Array<any>=[];
        for(let i=0,len=arr.length;i<len;i++){
            const [size,pos,ro,tid,more]=arr[i];
            rst.push({
                x:size[0]*cvt,y:size[1]*cvt,z:size[2]*cvt,
                ox:pos[0]*cvt,oy:pos[1]*cvt,oz:pos[2]*cvt,
                rx:ro[0],ry:ro[1],rz:ro[2],
                texture:tid,more:!more?[]:more,
            });
            loadTexture.push(tid);
        }
        //console.log(loadTexture);
        return {data:rst,resource:loadTexture};
    },
    
    /******渲染器数据处理部分*****/
    //转换成3D数据的方法实现
    threeTransform:(arr:Array<any>,va:number,edit:boolean=false)=>{
        //console.log('[wall.ts => threeTransform]');
        //console.log('wall.ts => threeTransform()'+ JSON.stringify(arr));
        let geometry:Array<any>=[];
        let light:Array<any>=[];

        for(let i=0,len=arr.length;i<len;i++){
            const row=arr[i];
            let obj={
                type:'box',
                data:[row.x,row.y,row.z],
                position:[row.ox,row.oy,row.oz],
                rotation:[row.rx,row.ry,row.rz],
                
                cfg:{
                    color:'#FF0000',
                    opacity:0.5,
                    edge:false,          //显示边缘
                    texture:{
                        id:row.texture,
                        repeat:[1,1],
                    },
                },
                info:{type:reg.name,id:i},
            };
            geometry.push(obj);
        }
        return {geometry:geometry,light:light,elevation:va};
    },

    save:(arr:Array<fmtModule>,cvt:number)=>{
        let rst:Array<any>=[];
        const toF=tools.toF;
        const dv=1/cvt;
        for(let i=0,len=arr.length;i<len;i++){
            const row=arr[i];
            const more:Array<number>=[];
            //console.log(row)
            for(let i=0,len=row.more.length;i<len;i++){
                more.push(row.more[i]);
            }
            
            rst.push([
                [toF(row.x*dv),toF(row.y*dv),toF(row.z*dv)],
                [toF(row.ox*dv),toF(row.oy)*dv,toF(row.oz*dv)],
                [toF(row.rx),toF(row.ry),toF(row.rz)],
                row.texture,more,
            ]);
        }
        return rst;
    },
    new:(pos:Array<number>,cvt:number)=>{
        const [px,py,pz]=pos;
        const rst=self.format([reg.default],cvt);
        const row=rst.data[0];
        row.ox=px;
        row.oy=py;
        row.oz=pz;
        return {data:row};
    },

    /******todo操作调用的部分，基础数据修改部分*****/
    add:function(p:any,dt:Array<any>){
        dt.push(self.data(p));
        return dt;
    },
    set:function(p:any,dt:Array<any>,limit:Array<number>){
        //console.log(dt)
        if(p.id===undefined) return false;
        var p=self.revise(p,dt[p.id],limit);
        dt[p.id]=self.data(p,dt[p.id]);
        return dt;
    },
    del:function(p:any,dt:Array<any>){
        if(p.id===undefined) return false;
        var rst=[];
        for(var i in dt)if(i!=p.id)rst.push(dt[i]);
        return rst;
    },
    data:function(p:any,data:Array<any> = []){
        let dd=data.length=0?clone(reg.default):data;
        dd[0][0]=p.x===undefined?dd[0][0]:p.x;
        dd[0][1]=p.y===undefined?dd[0][1]:p.y;
        dd[0][2]=p.z===undefined?dd[0][2]:p.z;
        dd[1][0]=p.ox===undefined?dd[1][0]:p.ox;
        dd[1][1]=p.oy===undefined?dd[1][1]:p.oy;
        dd[1][2]=p.oz===undefined?dd[1][2]:p.oz;
        dd[2][0]=p.rx===undefined?dd[2][0]:p.rx;
        dd[2][1]=p.ry===undefined?dd[2][1]:p.ry;
        dd[2][2]=p.rz===undefined?dd[2][2]:p.rz;
        dd[3]=p.texture===undefined?dd[3]:p.texture;
        return dd;
    },
     //修正位置的方法,处理数据超限问题
     revise:function(p:any,data:Array<any>,limit:Array<number>){		
        let reviseSizeOffset=tools.reviseSizeOffset
        if(p.x!=undefined){
            let o=data[1][0],s=limit[0],rst=reviseSizeOffset(o,p.x,s);
            p.ox=rst.offset!=o?rst.offset:p.ox;
            p.x=rst.size!=p.x?rst.size:p.x;
        }
        if(p.y!=undefined){
            let o=data[1][1],s=limit[1],rst=reviseSizeOffset(o,p.y,s);
            p.oy=rst.offset!=o?rst.offset:p.oy;
            p.y=rst.size!=p.y?rst.size:p.y;
        }
        if(p.z!=undefined){
            let o=data[1][2],s=limit[2],rst=reviseSizeOffset(o,p.z,s);
            p.oz=rst.offset!=o?rst.offset:p.oz;
            p.z=rst.size!=p.y?rst.size:p.z;
        }
        
        if(p.ox!=undefined){
            let w=data[0][0],s=limit[0],rst=reviseSizeOffset(p.ox,w,s);
            p.ox=rst.offset!=p.ox?rst.offset:p.ox;
            p.x=rst.size!=w?rst.size:p.x;
        }
        
        if(p.oy!=undefined){
            let w=data[0][1],s=limit[1],rst=reviseSizeOffset(p.oy,w,s);
            p.oy=rst.offset!=p.oy?rst.offset:p.oy;
            p.y=rst.size!=w?rst.size:p.y;
        }
        if(p.oz!=undefined){
            let w=data[0][2],s=limit[2],rst=reviseSizeOffset(p.oz,w,s);
            p.oz=rst.offset!=p.oz?rst.offset:p.oz;
            p.z=rst.size!=w?rst.size:p.z;
        }
        return p;
    },
};

export {self as wall};