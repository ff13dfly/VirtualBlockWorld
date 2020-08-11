// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//autostruct对数据进行解析，变成3D可以处理的中间数据

import {DB} from './cache';

import {Preter} from'./preter';
import {tools} from './common/tools';
import {Keys,Hooks} from './common/setting';
import {Player} from './player';


const self={
    exsist:(que:Array<number>,val:number):boolean=>{
        if(que==null) return false;
        for(let i=0,len=que.length;i<len;i++) if(que[i]===val) return true;
        return false;
    },
}

interface formatResult{
    data:Array<any>,
    resource:Array<number>,
}

//自动构建入口，很重要的
function autoStruct(bks:Array<Array<number>>,cvt:number){
    const ids:Array<number>=[];
    const exsist=self.exsist;
    const getKey=tools.blockCacheKey;
    for(let i=0,len=bks.length;i<len;i++){
        const [world,x,y]=bks[i];
        const ckey=getKey(world,x,y);
        const dt=DB.getHash(ckey,Keys.byteKey)
        if(!dt) continue;

        //console.log(dt);
        //1.保存block的基本信息
        DB.setHash(ckey,Keys.basicKey,{x:x,y:y,world:world,elevation:dt.elevation});
        //DB.setHash(ckey,Keys.originKey,dt.raw);

        let last:any={};      //统一挂载的数据

        //2.构建proceed数据
        const et:formatResult=Preter.earth.format(dt,cvt);
        last['earth']=et.data;
        if(et.resource.length>0){
            for(let j=0,rlen=et.resource.length;j<rlen;j++){
                const id=et.resource[j];
                if(!exsist(ids,id)) ids.push(id);       //处理资源加载
            } 
        }

        //3.解析raw数据
        let strRaw:any=tools.decode(dt.raw);
        // if(x==101 && y==203){
        //     strRaw=JSON.stringify(demoData());
        // }
        if(!!strRaw){
            const raw:any=JSON.parse(strRaw);
            //console.log(raw);
            for(let mod in raw){
                if(!Preter[mod] || !Preter[mod][Hooks.format]) continue;

                const rst:formatResult=Preter[mod][Hooks.format](raw[mod],cvt);
                last[mod]=rst.data;
                //console.log(mod);
                if(rst.resource && rst.resource.length>0){
                    for(let j=0,rlen=rst.resource.length;j<rlen;j++){
                        const id=rst.resource[j];
                        if(!exsist(ids,id)) ids.push(id);       //处理资源加载
                    } 
                } 
            }
        }
        //console.log(last);
        DB.setHash(ckey,Keys.processedKey,last);

        //4.解析more数据,添加配置的地方
        if(dt.more && dt.more!='0x'){
            const str=tools.decode(dt.more);
            const more=str?JSON.parse(str):null;
            DB.setHash(ckey,Keys.moreKey,more);
        }

        //5.处理player的站立高度,判断是否和player一致，直接设置到海拔高度
        const [px,py]=Player.get('block');
        if(x==px && y==py){
            let pos=Player.get('position');
            pos[2]=dt.elevation*cvt;
        }
    }
    return ids;     //返回需要的值
}

//测试的demo数据
// function demoData(){
//     const data:any={
//         stop:[
//             [[1.4,2.4,3.4],[4.2,6.2,1.7],[0,0,0],1],
//         ],
//         importer:[
//             [[3,2,3],[12,6,1.5],[0,0,0],[1,1,1],3],
//             [[3,2,3],[3,9,1.5],[0,0,0],[1,1,1],3],
//             [[1,2,3],[4,6,5],[0,0,0],[32.8,32.8,32.8],4],
//             [[1,2,3],[12,6,2],[0,0,0],[32.8,32.8,32.8],4]    //dae文件
//         ],
//         wall:[
//             [[1.5,0.2,3],[1,0.3,1.5],[0,0,0],4,[]],
//         ]
//     }
//     return data;
// }

function autoDestory(bks:Array<Array<number>>){
    for(let i=0,len=bks.length;i<len;i++){
        const [world,x,y]=bks[i];
        const ckey=tools.blockCacheKey(world,x,y);
        DB.del(ckey);
    }
    return true;
}


export{autoStruct,autoDestory}