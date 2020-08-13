/*
全局变量，供统一挂载block的数据
*/

let data:any={} //数据实际保存位置
const self:any={
    get:(main:string,clone:boolean = false):boolean|any=>{
        if(!data[main]) return false;
        return clone?JSON.parse(JSON.stringify(data[main])):data[main];
    },
    set:(main:string,val:any):boolean=>{
        data[main]=val;
        return true;
    },
    getHash:(main:string,sub:string,clone:boolean = false)=>{
        if(data[main]==undefined || data[main][sub]==undefined) return null;
        return clone?JSON.parse(JSON.stringify(data[main][sub])):data[main][sub];
    },
    setHash:(main:string,sub:string,val:any):boolean=>{
        if(!data[main]) data[main]={}
        data[main][sub]=val;
        return true;
    },
    chain:(c:Array<string>,clone:boolean=false)=>{
        let tmp:any=data;
        for(let i=0,len=c.length;i<len;i++){
            const k=c[i];
            if(!tmp[k]) return false;
            tmp=tmp[k];
        }
        return tmp;
    },
    del:(main:string)=>{
        delete data[main];
    },
    dump:()=>{
        return data;
    },
    init:():boolean=>{
        data={};
        return true;
    },
}


export{self as DB}