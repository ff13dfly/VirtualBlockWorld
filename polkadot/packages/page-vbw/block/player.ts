//player的基本配置
let pp:any={
    block:[101,203],		//默认的开始的土地块
    world:0,				//用户的默认世界
    position:[2,2,0],		//默认开始的位置[x,y,z],z为站立高度
    rotation:[0,0,0],		//默认的旋转位置
    extend:[3,3],			//周边扩展显示土地格数，第一人称的时候使用
    range:10,				//默认的显示范围，鸟瞰视图时候使用
    height:1.6,				//默认的人物高度
    min:0.3,                //视线最低高度
    shoulder:0.5,			//player的肩宽
    chest:0.22,				//player的胸厚
    stop:-1,				//player站立的stop的id
    moving:false,			//player是否正在运动，用于处理资源的加载和重建，不影响用户操作体验
    death:false,			//player是否死亡;
}

interface CKMovement{
    ():void;
}

const self:any={
    get:(key:string):boolean|any=>{
        if(pp[key]==undefined) return false;
        return pp[key];
    },
    set:(key:string,val:any):boolean=>{
        if(!pp[key]) return false;
        pp[key]=val;
        return true;
    },
    start:():void=>{
        console.log('player start');
        pp.moving=true
    },
    stop:():void=>{
        console.log('player stop');
        pp.moving=false
    },
    convert:(cvt:number):void=>{
        pp.position[0]*=cvt;
        pp.position[1]*=cvt;
        pp.position[2]*=cvt;

        pp.height*=cvt;
        pp.min*=cvt;
        pp.shoulder*=cvt;
        pp.chest*=cvt;
    },

    bodyForward:(dis:number):void=>{
        const ak=pp.rotation[1];
	    pp.position[0]-=dis*Math.sin(ak);
		pp.position[1]+=dis*Math.cos(ak);
    },
    bodyBackward:(dis:number):void=>{
        const ak=pp.rotation[1];
	    pp.position[0]+=dis*Math.sin(ak);
		pp.position[1]-=dis*Math.cos(ak);
    },
    bodyLeft:(dis:number):void=>{
        const ak=pp.rotation[1];
		pp.position[0]-=dis*Math.cos(ak);
		pp.position[1]-=dis*Math.sin(ak);
    },
    bodyRight:(dis:number):void=>{
        const ak=pp.rotation[1];
		pp.position[0]+=dis*Math.cos(ak);
		pp.position[1]+=dis*Math.sin(ak);
    },

    bodyRise:(dis:number):void=>{
        pp.position[2]+=dis;
    },
    bodyDown:(dis:number):void=>{
        //console.log(pp.position[2]);
        if(pp.position[2]-dis>pp.min-pp.height)pp.position[2]-=dis;
    },
    headLeft:(ro:number):void=>{
        pp.rotation[1]+=ro;
    },
    headRight:(ro:number):void=>{
        pp.rotation[1]-=ro;
    },

    headRise:(ro:number):void=>{
        const ak=pp.rotation[1];
        console.log(JSON.stringify(pp.rotation))
        pp.rotation[0]+=ro*Math.cos(ak);
        pp.rotation[2]-=ro*Math.sin(ak);
    },
    headDown:(ro:number):void=>{
        const ak=pp.rotation[1];
        pp.rotation[0]-=ro*Math.cos(ak);
        pp.rotation[2]+=ro*Math.sin(ak);
    },
    headRecover:(ck:any)=>{
        pp.rotation[0]=0;
        pp.rotation[2]=0;
        ck && ck();
    },
    death:(px:number,py:number,height:number,ck:CKMovement)=>{
        //console.log('death form height:'+height);
    },
    fall:(dis:number,forward:number,ck:CKMovement)=>{
        //console.log('fall form height:'+dis);
        pp.position[2]-=dis;
    },
    jump:(height:number,forward:number,ck:CKMovement)=>{

    },
    dump:()=>{return pp}
}
export{self as Player}