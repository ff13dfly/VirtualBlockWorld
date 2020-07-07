import {World} from '../common/setting';
//import {tools} from '../common/tools';

const reg={
    name:"earth",
    type:"basic",
    version:1,
    default:[],
    setting:{
        height:0.2,     //默认的地板高度
        texture:1,      //默认的土地贴图
    }
}

const self={
    format:(obj:any,cvt:number)=>{
        //console.log('[earth.ts => format]'+JSON.stringify(obj));
        let loadTexture:Array<number>=[reg.setting.texture];       //放需要预加载的texture的id值
        const side=World.side*cvt;
        const h=reg.setting.height*cvt,va=obj.elevation*cvt;
        const data:any={
            x:side,y:side,z:va+h,
            ox:0.5*side,oy:0.5*side,oz:-0.5*(va+h),
            texture:reg.setting.texture,
        }
        //console.log('earth.ts => format()'+ JSON.stringify(data));
        return {data:data,resource:loadTexture};
    },
    
    threeTransform:(obj:any,va:number,edit:boolean=false)=>{
        //console.log(obj);
        //console.log('[earth.ts => threeTransform]');
        //console.log('earth.ts => threeTransform()'+ JSON.stringify(obj));
        let geometry:Array<any>=[];
        let light:Array<any>=[];

        //const dt=obj.data;
        const earth={
            type:'box',
            data:[obj.x,obj.y,obj.z],
            position:[obj.ox,obj.oy,obj.oz],
            rotation:[0,0,0],
            cfg:{
                color:!obj.color? self.randomColor():obj.color,
                opacity:obj.opacity || 1,
                texture:{
                    id:obj.texture,
                    repeat:[1,1],
                }
            },
            info:{type:reg.name}
        }
        geometry.push(earth);
        return {geometry:geometry,light:light,elevation:va};
    },

    randomColor:()=>{
        const arr=['#EEEEEE','#E0E0E0','#DDDDDD','#D0D0D0','#CCCCCC','#C0C0C0','#BBBBBB'];
        
        const min:number=0,max:number=arr.length;
        const range = max - min;
        const index = min + Math.round(Math.random() * range);
        //index=1;
        return arr[index];
    },
    /***********功能编辑区域*************/
    guiData:(row:any,cage:Array<number>,cvt:number)=>{
        return {
            //x:{value:row.x,min:reg.limit.min*cvt,max:cage[0]},
            //y:{value:row.y,min:reg.limit.min*cvt,max:cage[1]},
            //z:{value:row.z,min:reg.limit.min*cvt,max:cage[2]},
        }
    },
    save:(obj:any,cvt:number)=>{
        console.log(obj)
    },

    /***********earth的基础设置方法****************/
    set:(p:any,dt:any)=>{
        if(p.key===undefined || dt[p.key]==undefined) return false;
        if(p.key=='extra'){
            var dd=JSON.parse(dt.extra)
            dd[p.index]=p.value;
            dt.extra=JSON.stringify(dd);
        }else{
            dt[p.key]=p[p.key];
        }
        return dt;
    },
    data:(p:any,dd:any)=>{
        dd[p.key]=p[p.key];
        
        return dd;
    },
}

export {self as earth};

