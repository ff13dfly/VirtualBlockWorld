// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//calc area by points
function area(ps:Array<Array<number>>){
    let len=ps.length,mj=0;
    if(len<3) return 0;

    let pa=[0,0];
    for(let i=0;i<len;i++){
        let pb=ps[i],pc=i==(len-1)?ps[0]:ps[i+1];
        let ja=<number>pb[0]*<number>pc[1]-<number>pc[0]*<number>pb[1];
        let jb=pa[0]*<number>pc[1]-pa[0]*<number>pc[0];
        let jc=pa[0]*<number>pb[1]-pa[0]*<number>pb[1];
        mj+=(ja-jb+jc)*0.5;
    }
    return mj;
}

//calc padding of points
function padding(ps:Array<Array<number>>){
    let pad:Array<number>=[0,0,0,0];
    for(let i=0,len=ps.length;i<len;i++){
        const p=ps[i];
        pad[0] = (pad[0]==0)?p[1]:(p[1]<pad[0]?pad[0]:p[1]);
        pad[1] = (pad[1]==0)?p[0]:(p[0]>pad[1]?p[0]:pad[1]);
        pad[2] = (pad[2]==0)?p[1]:(p[1]>pad[2]?pad[2]:p[1]);
        pad[3] = (pad[3]==0)?p[0]:(p[0]<pad[3]?p[0]:pad[3]);
    }
    return pad;
}

const calc={
    // say:function(txt:number){
    //     console.log(source.getTexture(1,'linebase'));
    //     console.log(txt);

    //     source.setTexture(22,'linebase',1314);
    // },
}

export{area,padding,calc}