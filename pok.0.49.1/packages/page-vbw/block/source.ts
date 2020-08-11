// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from "@polkadot/api";
import {tools} from './common/tools';
import {Md5} from 'ts-md5/dist/md5';

/*
材质数据的保存，增加自动获取功能
1.对key进行hash处理;
2.调用的时候不区分key，自处理
3.后期要加salt
*/
let map:any={};
let run:any={};
let server:ApiPromise|null=null;

//资源管理部分的配置，需要和服务器端的配置一致
const me:any={
    step:2,
    depth:4,
    basic:'source/',
    salt:'saltme,222',
}

interface CKResource{
    ():void;
}

let sum=0;
const self:any={
    //通过api获取resource的原始数据
    //bug:需要保障所有数据都获取了，再调用下一步的callback
    sync:(ids:Array<number>,ck:CKResource)=>{
        if(server==null) return setTimeout(() => {
            self.sync(ids,ck);
        }, 300);
        //console.log('[source.ts => sync()]:'+JSON.stringify(ids));
        const decode=tools.decode;
        const len=ids.length;
        sum=0;
        for(let i=0;i<len;i++){
            //1.获取数据
            const id=ids[i];
            if(self.get(id)!=null){     //对于已经加载过的情况，直接跳过
                sum++;
                if(sum==len) return ck && ck();
                else continue;
            } 

            //2.解析数据，保存好路径
            server.query.vbw.sourceMap(id,(res:any)=>{
                let dt:any=JSON.parse(JSON.stringify(res));
                if(dt.stamp!=0){
                    dt.format=decode(dt.format);
                    dt.hash=decode(dt.hash)
                    dt.path=self.getPath(dt.hash,dt.format);
                    self.set(id,dt);
                    //console.log('id['+id+']:'+JSON.stringify(dt));
                }
                sum++;
                //console.log('[source.ts=>sync()]date get,sum:'+sum);
                if(sum==len) return ck && ck();
            });
        }
        return true;
    },
    getPath:(hash:string,format:string,step:number=me.step,depth:number=me.depth,pre:string=me.basic)=>{
        const mhash= Md5.hashAsciiStr(hash+me.salt).toString();
        //console.log('[source.ts=>getPath()] origin hash:'+hash+',salt:'+mhash);

        let tg=pre;
        for(let i=0;i<depth;i++){
            tg+=mhash.substr(i*step,step)+'/';
        }
        return tg;
    },
    get:(main:string,clone:boolean = false):boolean|any=>{
        if(!map[main] || !run[map[main]]) return null;          //false的话会和boolean的返回值冲突
        const k=map[main];
        return clone?JSON.parse(JSON.stringify(run[k])):run[k];
    },
    set:(main:string,val:any):boolean=>{
        if(!map[main]){
            const k=self.hash();
            map[main]=k;
            run[k]=val;
        }else{
            const k=map[main];
            run[k]=val;
        }
        return true;
    },
    del:(main:string)=>{
        if(!map[main]) return false;
        delete run[map[main]];
        delete map[main];
        return true;
    },
    
    init:()=>{
        map={};
        run={};
        return true;
    },
    setDB:(api:ApiPromise)=>{
        server=api;
        return true;
    },
    dump:()=>{return {path:map,data:run}},
    hash(n:number=7):string{ return Math.random().toString(36).substr(n)},
}

export{self as Resource}