// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {DB} from './cache';
import {Player} from './player';
import {Resource} from './source';
import {autoStruct,autoDestory} from './struct';
import {autoShow} from './render';
import {autoControl} from './controller';

import {Keys,World,More,autoConfig} from './common/setting';
import {tools} from './common/tools';


//import {test} from './test';

let target='';          //id容器
let server:any;         //缓存api
let cfg={
    width:1024,
    height:800,
}
let inited=false;

interface Callback{
    ():void;
}

const self={
    clear:()=>{
        DB.init();
    },
    cache:(bks:any,api:any,ck:Callback)=>{
        const len=bks.length;
        if(len==0) return ck();
        let count=0;
        for(let i=0;i<len;i++){
            const bk=bks[i];
            api.query.vbw.blockMap(bk,(res:any)=>{
                const dt=JSON.parse(JSON.stringify(res));
                const kk=tools.blockCacheKey(bk[0],bk[1],bk[2]);

                if(DB.setHash(kk,Keys.byteKey,dt)){
                    count++;
                    if(count==len) ck();
                }
            });
        }
    },
    
    show:(bks:Array<Array<number>>,cvt:number,tg:string=target)=>{
        const ids=autoStruct(bks,cvt);       //构建基础数据
        //console.log('[entry.ts => self.show()] ids:'+JSON.stringify(ids));
        //console.log('[entry.ts => show()] ids:'+JSON.stringify(ids));
        if(ids==null || ids.length<1){
            autoShow(tg,cfg);        //自动显示
            autoControl(tg,cfg);         //自动控制
        }else{
            Resource.sync(ids,()=>{
                //console.log('[entry.ts => show()] run?:'+JSON.stringify(ids));
                //2.2.调用渲染器进行显示处理
                autoShow(tg,cfg);        //自动显示
                autoControl(tg,cfg);         //自动控制
            });
        }
    },
    //获取地块数组的方法
    range:(pos:Array<number>,world:number,extend:Array<number>,max:Array<number>):Array<Array<number>>=>{
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
}


/*入口方法，外部调用的入口，这里处理好所有的逻辑
这个方法只调用一次，进行数据配置
*/
function drawing(container:string,api:any,accountID:any):void {
    //console.log('[entry.ts => drawing()] account:'+accountID+',inited?:'+inited);
    if(!inited){
        autoConfig();                   //处理setting的进制转换,初始化处理
        Player.convert(More.convert);   //对player的参数进行转换
        target=container;
    }
    inited=true;

    //异步的调用方式，api里的isReady是promise类的，直接用就可以
    if(!server){
        api.isReady.then(()=>{
            server=api;
            Resource.setDB(api);
            fresh();
        });
    }else{
        fresh();
    }
    //test.limitDemo();
    //test.zipDemo();
    //console.log('[entry.ts=>drawing()] scene loaded')
}

//跳过数据获取，进行显示更新，用于edit模式
function update(ids:Array<number>=[]){
    if(ids==null || ids.length<1){
        autoShow(target,cfg);        //自动显示
        autoControl(target,cfg);         //自动控制
    }else{
        Resource.sync(ids,()=>{
            //console.log('[entry.ts => show()] run?:'+JSON.stringify(ids));
            //2.2.调用渲染器进行显示处理
            autoShow(target,cfg);        //自动显示
            autoControl(target,cfg);         //自动控制
        });
    }
}

//刷新指定区域的数据并显示
function fresh(force:boolean=false):void{
    if(force) self.clear();    
    const bks=self.range(Player.get('block'),Player.get('world'),Player.get('extend'),[World.xMax,World.yMax]);
    //console.log('[entry.ts => fresh()]'+JSON.stringify(bks));
    self.cache(bks,server,()=>{
        //2.1.解析数据，交给解析器处理完毕
        self.show(bks,More.convert);

        //console.log('[entry.ts => fresh()] player:'+JSON.stringify(Player.dump()))
    });
}

//刷新指定的[world,x,y]的数据
function redraw(x:number,y:number,world:number):void{
    const bks=[[world,x,y]];
    self.cache(bks,server,()=>{
        self.show(bks,More.convert);
    });
}


function rebuild(load:Array<Array<number>>,destory:Array<Array<number>>):void{
    autoDestory(destory);
    //console.log('[entry.ts=>rebuild()],data:'+JSON.stringify(load));
    self.cache(load,server,()=>{
        self.show(load,More.convert);
    });
}

//通过interface对返回值进行检查
interface CKSync{
    ():void;
}
function syncChain(x:number,y:number,world:number,raw:Array<number>,ck:CKSync){
    const owner='5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y';
    server.tx.vbw.blockUpdate(x,y,world,raw).signAndSend(owner, (result:any) => {
        console.log(`Current status is ${result.status}`);
        if (result.status.isInBlock) {
            console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
        } else if (result.status.isFinalized) {
            console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
        }
    });
}
export {drawing,fresh,update,rebuild,redraw,syncChain};