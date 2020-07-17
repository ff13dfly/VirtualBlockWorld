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