// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const reg={
    name:"trigger",
    type:"basic",
    version:1,
    //default:[[1.5,2,0.5],[0,0,0],[0,0,0],1],
}

const self={
    format:function(arr:Array<any>,cvt:number){
        console.log(reg.name)
    },
};

export {self as trigger};