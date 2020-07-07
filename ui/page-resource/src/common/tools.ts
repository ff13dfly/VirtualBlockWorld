const tools={

    //生成指定长度的hash的方法
    hash:function(n:number=6):string{
        return Math.random().toString(36).substr(n);
    },
    empty:function(o:any){
        for(let z in o){
           if(!!z) return false;
        }
        return true;
    },

    

    shorter:(hash:string|null,start:number=10,tail:number=10)=>{
        if(hash==null) return 'null';
        const len=hash.length;
        return hash.substring(0,start)+'...'+hash.substring(len-tail,len);
    },
    //将string转换成array<u8>
    encode:(str:string)=>{
        let rst=[];
        for(let i=0,len=str.length;i<len;i++)rst.push(str.charCodeAt(i));
        return rst;
    },

    //将hex的形式转换成字符串的操作
    decode:(hexString:string)=>{
        const trimedStr = hexString.trim();
        const rawStr =trimedStr.substr(0,2).toLowerCase() === '0x'? trimedStr.substr(2):trimedStr;
        const len = rawStr.length;
        if(len % 2 !== 0)return '';
        let curCharCode;
        let resultStr = [];
        for(let i = 0; i < len;i = i + 2) {
          curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
          resultStr.push(String.fromCharCode(curCharCode));
        }
        return !resultStr?null:resultStr.join('');
    },
}

function clone(obj:any){
    return JSON.parse(JSON.stringify(obj));
}

export{tools,clone}