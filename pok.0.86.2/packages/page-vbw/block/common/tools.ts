// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
    blockCacheKey:function(world:number,x:number,y:number){
        return world+'_'+x+'_'+y;
    },

    //自动处理3D物体到指定cage范围内的方法
    limit:(obj:any,cage:Array<number>)=>{

        
        return obj;
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

    

    /*计算size和offset导致的位置修正
	 * @param	o		number		//offset的起始值
	 * @param	d		number		//size的宽度值
	 * @param	s		number		//线段总长度
	 * return
	 * {offset:offset,size:size}			//新的左侧offset和尺寸值
	 * */
	reviseSizeOffset:function(o:number,d:number,s:number){
		//console.log('组件的offset是:'+o+',组件的宽度是:'+d+',线段的总长度是:'+s)
		//console.log('不修正的长度是:'+(d*0.5+o))
		const fs=d>s?s*0.5:d*.5+o>s?s-0.5*d:o<0.5*d?0.5*d:o,sz=d>s?s:d;
		return {offset:fs,size:sz}
    },
    toF:(a:number,fix:number=3)=>{return parseFloat(a.toFixed(fix))},
}

function clone(obj:any){
    return JSON.parse(JSON.stringify(obj));
}

export{tools,clone}