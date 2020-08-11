// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from "@polkadot/api";
import {tools} from './tools';

/*
运行时状态保持数据
1.对key进行hash处理;
2.调用的时候不区分key，自处理
3.后期要加salt
*/
let map:any={};
let run:any={};
let server:ApiPromise;

//共享的运行时数据功能实现
const self:any={
    get:(main:string,clone:boolean = false):boolean|any=>{
        if(!map[main] || !run[map[main]]) return null;          //false的话会和boolean的返回值冲突
        const k=map[main];
        return clone?JSON.parse(JSON.stringify(run[k])):run[k];
    },
    exist:(main:string)=>{
        if(!map[main] || !run[map[main]]) return false;          //false的话会和boolean的返回值冲突
        return true;
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
    setAPI:(api:ApiPromise)=>{
        //const {api} = useApi();
        server=api;
    },
    sync:(id:number,ck:any)=>{
        const decode=tools.decode;
        server.query.vbw.sourceMap(id,(dt:any)=>{
            const sou=JSON.parse(JSON.stringify(dt));
            const row={
              id:id,
              format:decode(sou.format),
              hash:decode(sou.hash),
              stamp:sou.stamp,
              status:sou.status,
              owner:sou.owner,
            };
            self.set(id,row);
            ck && ck();
        });
    },
    init:()=>{
        map={};
        run={};
        return true;
    },
    dump:()=>{return {path:map,data:run}},
    hash(n:number=7):string{ return Math.random().toString(36).substr(n)},
}

export{self as Run}