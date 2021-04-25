// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/*
运行时状态保持数据
1.对key进行hash处理;
2.调用的时候不区分key，自处理
3.后期要加salt
*/
let map:any={};
let run:any={};

//共享的运行时数据功能实现
const self:any={
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
    dump:()=>{return {path:map,data:run}},
    hash(n:number=7):string{ return Math.random().toString(36).substr(n)},
}

//运行时共享队列功能实现
const Queue={
    get:(main:string,clone:boolean = false):boolean|any=>{
        if(!map[main] || !run[map[main]]) return null;          //false的话会和boolean的返回值冲突
        const k=map[main];
        return clone?JSON.parse(JSON.stringify(run[k])):run[k];
    },
    push:(main:string,val:any):boolean=>{
        if(!map[main]){
            const k=self.hash();
            map[main]=k;
            run[k]=[val];
        }else{
            const k=map[main];
            run[k].push(val);
        }
        return true;
    },
    remove:(main:string,val:any):boolean=>{
        const old=Queue.get(main);
        if(old==null) return false;
        let dt:any=[];
        for(let i=0,len=old.length;i<len;i++){
            //console.log('queue:'+old[i]+',compair:'+val+',same?'+(old[i]==val));
            if(old[i]!==val) dt.push(old[i]);
        }
        //console.log(dt);
        const key=map[main];
        delete run[key];
        
        run[key]=dt;
        return true;
    },
    exsist:(main:string,val:any):boolean=>{
        const que=Queue.get(main);
        if(que==null) return false;
        for(let i=0,len=que.length;i<len;i++) if(que[i]===val) return true;
        return false;
    },
    del:(main:string)=>{
        if(!map[main]) return false;
        delete run[map[main]];
        delete map[main];
        //console.log(Queue.dump());
        return true;
    },
    dump:()=>{return {path:map,data:run}},
    hash(n:number=7):string{ return Math.random().toString(36).substr(n)},
}

export{self as Run,Queue}