import {tools,clone} from '../common/tools';
//import {World} from '../common/setting';

const reg={
    name:'stop',
    type:'basic',
    version:1,
    default:[[1.5,2,0.5],[0,0,0],[0,0,0],1],
    limit:{
        min:0.2,
    }
}

const way={
    'BODY_STOP':1,		//stop阻挡在身体上
    'FOOT_STOP':2,		//stop阻挡在脚下
    'HEAD_STOP':3,		//stop在头顶之上
};

interface fmtModule{
    x:number,y:number,z:number,
    ox:number,oy:number,oz:number,
    rx:number,ry:number,rz:number,
    type:number,
}

const self={
    format:function(arr:Array<any>,cvt:number){
        //console.log('[stop.ts => format()]'+JSON.stringify(arr));
        let rst:Array<any>=[];
        for(let i=0,len=arr.length;i<len;i++){
            
            const [size,pos,ro,type]=arr[i];
            
            rst.push({
                x:size[0]*cvt,y:size[1]*cvt,z:size[2]*cvt,
                ox:pos[0]*cvt,oy:pos[1]*cvt,oz:pos[2]*cvt,
                rx:ro[0],ry:ro[1],rz:ro[2],
                type:type
            });
        }
        return {data:rst};
    },
    guiData:(row:fmtModule,cage:Array<number>,cvt:number)=>{
        return {
            x:{value:row.x,min:reg.limit.min*cvt,max:cage[0]},
            y:{value:row.y,min:reg.limit.min*cvt,max:cage[1]},
            z:{value:row.z,min:reg.limit.min*cvt,max:cage[2]},
        }
    },
    save:(arr:Array<fmtModule>,cvt:number)=>{
        let rst:Array<any>=[];
        const toF=tools.toF;
        const dv=1/cvt;
        for(let i=0,len=arr.length;i<len;i++){
            const row=arr[i]
            rst.push([
                [toF(row.x*dv),toF(row.y*dv),toF(row.z*dv)],
                [toF(row.ox*dv),toF(row.oy)*dv,toF(row.oz*dv)],
                [toF(row.rx),toF(row.ry),toF(row.rz)],
                row.type
            ]);
        }
        return rst;
    },

    threeTransform:(arr:Array<any>,va:number,edit:boolean=false)=>{
        //console.log('[stop.ts => threeTransform]');
        //console.log('stop.ts => threeTransform()'+ JSON.stringify(arr));
        let geometry:Array<any>=[];
        let light:Array<any>=[];

        for(let i=0,len=arr.length;i<len;i++){
            if(!edit) continue;
            const row=arr[i];
            let obj={
                type:'box',
                data:[row.x,row.y,row.z],
                position:[row.ox,row.oy,row.oz],
                rotation:[row.rx,row.ry,row.rz],
                cfg:{
                    color:'#FF0000',
                    opacity:0.5,
                    edge:true,          //显示边缘
                },
                info:{type:reg.name,id:i},
            };
            geometry.push(obj);
        }
        return {geometry:geometry,light:light,elevation:va};
    },
    check:(cfg:any,stops:Array<any>)=>{
		let rst:any={empty:true,stop:false,id:-1}		//stop关系的信号系统
		if(stops.length<1) return rst;
        
        const [dx,dy,dz]=cfg.pos;
		const list=self.inStopProject(dx,dy,stops);		//1.计算在垂直投影中的stop
		if(tools.empty(list)) return rst;						//2.未和任何stop发生关系
        rst.empty=false;											//
			
		const cap=cfg.cap+(cfg.pre!=undefined?cfg.pre:0),h=cfg.height;
		const va=cfg.elevation

		const arr=self.zStopCheck(dz,h,cap,va,list);		//3.计算Z轴上发生关系的
		let fs:any=self.stopFilter(arr);								//4.筛选所有的stop最接近的stop
		rst.stop=fs.stop;
		rst.id=fs.id;
		if(fs.delta!=undefined)rst.delta=fs.delta;
		return rst;
    },

    stopFilter:(arr:Array<any>)=>{
        let rst:any={stop:false,id:-1}
        let max=null;
        for(let i in arr){
            const st=arr[i];
            if(st.stop==true){
                rst.stop=true;
                rst.id=st.id;
                rst.way=st.way;
                return rst;
            }
            
            if(st.delta!=undefined){
                if(max==null) max=st;
                if(st.delta>max.delta) max=st;
            }
        }
        if(max!=null){
            rst.id=max.id;
            rst.delta=max.delta;
        }
        return rst;
    },
    
    inStopProject:(px:number,py:number,stops:Array<any>)=>{
        let list:any={};
        for(let i in stops){
            const st=stops[i];
            const xmin=st.ox-st.x*0.5,xmax=st.ox+st.x*0.5;
            const ymin=st.oy-st.y*0.5,ymax=st.oy+st.y*0.5;
            if(	(px>xmin && px<xmax) && 		//进入stop的平面投影
            (py>ymin && py<ymax)){
                list[i]=st;
            }
        }
        return list;
    },


    zStopCheck:(z:number,h:number,cap:number,va:number,list:Array<any>)=>{
        let arr=[];
        for(let id in list){
            const st=list[id];
            const zmin=st.oz-st.z*0.5+va,zmax=st.oz+st.z*0.5+va;		//计算到绝对高度
            if(zmin>=z+h){											//a.悬在用户头上，不会阻挡
                arr.push({stop:false,way:way.HEAD_STOP,id:parseInt(id)})
            }else if(zmin<z+h && zmin>=z+cap){		//b.挡在用户中间，会阻挡
                arr.push({stop:true,way:way.BODY_STOP,id:parseInt(id)})
            }else{	//在用户脚下
                var zd=zmax-z;		//c.阻拦体和用户之间的高度差
                if(zd>cap){
                    arr.push({stop:true,way:way.FOOT_STOP,id:parseInt(id)})
                }else{
                    arr.push({stop:false,delta:zd,id:parseInt(id)})
                }
            }
        }
        return arr;
    },
    new:(pos:Array<number>,cvt:number)=>{
        const [px,py,pz]=pos;
        const rst=self.format([reg.default],cvt);
        const row=rst.data[0];
        row.ox=px;
        row.oy=py;
        row.oz=pz;
        return {data:row};
    },

    pop:(row:any)=>{
        return [
            [
                {name:'sx',value:row[0][0],unit:'m',type:'number'},
                {name:'sy',value:row[0][1],unit:'m',type:'number'},
                {name:'sz',value:row[0][2],unit:'m',type:'number'},
            ],
            [
                {name:'px',value:row[1][0],unit:'m',type:'number'},
                {name:'py',value:row[1][1],unit:'m',type:'number'},
                {name:'pz',value:row[1][1],unit:'m',type:'number'},
            ],
            [
                {name:'rx',value:row[2][0],unit:'m',type:'number'},
                {name:'ry',value:row[2][1],unit:'m',type:'number'},
                {name:'rz',value:row[2][1],unit:'m',type:'number'},
            ],
        ]
    },

    /******todo操作调用的部分，基础数据修改部分*****/
    add:(p:any,dt:Array<any>)=>{
        dt.push(self.data(p));
        return dt;
    },

    set:(p:any,dt:Array<any>,limit:Array<number>)=>{
        if(p.id===undefined) return false;
        const id=p.id;
        let pp=self.revise(p,dt[id],limit);
        dt[id]=self.data(pp,dt[id]);
        return dt;
    },

    del:(p:any,dt:Array<any>)=>{
        if(p.id===undefined) return false;
        let rst=[];
        for(let i in dt)if(i!=p.id)rst.push(dt[i]);
        return rst;
    },

    data:(p:any,data:Array<any> = [])=>{
        let dd=data.length=0?clone(reg.default):data;
        dd[0][0]=p.x===undefined?dd[0][0]:p.x;
        dd[0][1]=p.y===undefined?dd[0][1]:p.y;
        dd[0][2]=p.z===undefined?dd[0][2]:p.z;
        dd[1][0]=p.ox===undefined?dd[1][0]:p.ox;
        dd[1][1]=p.oy===undefined?dd[1][1]:p.oy;
        dd[1][2]=p.oz===undefined?dd[1][2]:p.oz;
        dd[2]=p.type===undefined?dd[2]:p.type;
        return dd;
    },

    //修正位置的方法,处理数据超限问题
    revise:(p:any,data:Array<any>,limit:Array<number>)=>{		
        let reviseSizeOffset=tools.reviseSizeOffset
        if(p.x!=undefined){
            let o=data[1][0],s=limit[0],rst=reviseSizeOffset(o,p.x,s);
            p.ox=rst.offset!=o?rst.offset:p.ox;
            p.x=rst.size!=p.x?rst.size:p.x;
        }
        if(p.y!=undefined){
            let o=data[1][1],s=limit[1],rst=reviseSizeOffset(o,p.y,s);
            p.oy=rst.offset!=o?rst.offset:p.oy;
            p.y=rst.size!=p.y?rst.size:p.y;
        }
        if(p.z!=undefined){
            let o=data[1][2],s=limit[2],rst=reviseSizeOffset(o,p.z,s);
            p.oz=rst.offset!=o?rst.offset:p.oz;
            p.z=rst.size!=p.y?rst.size:p.z;
        }
        
        if(p.ox!=undefined){
            let w=data[0][0],s=limit[0],rst=reviseSizeOffset(p.ox,w,s);
            p.ox=rst.offset!=p.ox?rst.offset:p.ox;
            p.x=rst.size!=w?rst.size:p.x;
        }
        
        if(p.oy!=undefined){
            let w=data[0][1],s=limit[1],rst=reviseSizeOffset(p.oy,w,s);
            p.oy=rst.offset!=p.oy?rst.offset:p.oy;
            p.y=rst.size!=w?rst.size:p.y;
        }
        if(p.oz!=undefined){
            let w=data[0][2],s=limit[2],rst=reviseSizeOffset(p.oz,w,s);
            p.oz=rst.offset!=p.oz?rst.offset:p.oz;
            p.z=rst.size!=w?rst.size:p.z;
        }
        return p;
    },
};

export {self as stop};