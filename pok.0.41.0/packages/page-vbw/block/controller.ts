//控制分发的入口

import $ from 'jQuery';
import * as THREE from 'three';
import * as dat from 'dat.gui';

import {tools,clone} from './common/tools';
import {UI} from './common/ui';
import {check} from './common/movement';
import {Ladder} from './common/ladder';
import {DB} from './cache';
import {Player} from './player';
import {Run} from './runtime';
import {Frame,Raycast,Stage} from './render';
import {World,More, Keys,Hooks} from './common/setting';
import {Preter} from './preter';
import {update,syncChain,rebuild,fresh,redraw} from './entry';
import {Resource} from './source';


interface fmtActive{
    x:number,
    y:number,
    type:string,
    id:number,
}

//avatar动作定义

//键盘控制的键位定义
let keyQueue:Array<number>=[];
const keyboard:any={
    FORWARD:	87,			//W
    BACKWARD:	83,			//S
    LEFT:		65,			//A
    RIGHT:		68,			//D
    RISE:		82,			//R
    DOWN:	    70,			//F
    JUMP:		32,			//Space
    HLEFT:		37,			// <-
    HRIGHT:		39,			// ->
    HRISE:		38,			// up
    HDOWN:		40,			// down
    SQUAT:		17,			//ctrl
};

const gui = new dat.GUI({autoPlace:false});
let items:any={};
let config:any={
    width:0,
    height:0,
    faceOrder:['x','y','z','-x','-y','-z'],
    curOrder:'x',
    offsetX:0.5,
    offsetY:0.5,
}

let agent:any={
    onChange:null,
}

const self={
    sync:()=>{
        //1.对键盘进行响应，移动位置
        const dis=10,ak=0.1;        //20对应约5km/s
        const zj=Math.PI*0.5;
        for(let i=0,len=keyQueue.length;i<len;i++){
            switch (keyQueue[i]) {
                case keyboard.FORWARD:
                    if(check(dis,0)) Player.bodyForward(dis);
                    break;
                case keyboard.BACKWARD:
                    if(check(dis,zj+zj)) Player.bodyBackward(dis);
                    break;
                case keyboard.LEFT:
                    if(check(dis,zj)) Player.bodyLeft(dis);
                    break;
                case keyboard.RIGHT:
                    if(check(dis,-zj)) Player.bodyRight(dis);
                    break;
                case keyboard.HLEFT:
                    Player.headLeft(ak);
                    break;
                case keyboard.HRIGHT:
                    Player.headRight(ak);
                    break;
                case keyboard.HRISE:
                    Player.headRise(ak);
                    setTimeout(self.headAuto,500);
                    break;
                case keyboard.HDOWN:
                    Player.headDown(ak);
                    setTimeout(self.headAuto,500);
                    break;
                default:
                    break;
            }
        }

        //2.同步方向到指南针
        const ros=Player.get('rotation');
        if(UI.get('compass')) UI.get('compass').setRotation(ros[1]);

        //3.同步player的位置
        const [x,y]=Player.get('block');
        const world=Player.get('world');
        const [px,py,pz]=Player.get('position');
        const toF=tools.toF;
        if(UI.get('info')) UI.get('info').struct(`坐标[X:${x},Y:${y}],世界${world},位置[${toF(px)},${toF(py)},${pz}]`);
    },
    headAuto:()=>{
        const name='headDown';
        Frame.put(name,()=>{
            Player.headRecover(()=>{
                Frame.remove(name);
            });
        });
    },
    keyAction:()=>{
        $(document).off('keydown','keyup').on('keydown',function(evt){
            const code=evt.which;
            let ok=true;
            for(let i=0,len=keyQueue.length;i<len;i++){
                if(code==keyQueue[i]){
                    ok=false;
                    break;
                }
            }
            if(ok)keyQueue.push(code);
            //console.log('press'+JSON.stringify(keyQueue));
        }).on('keyup',function(evt){
            const code=evt.which;
            //console.log('key code:'+code);
            let narr=[];
            for(let i=0,len=keyQueue.length;i<len;i++) if(keyQueue[i]!=code) narr.push(keyQueue[i]);
            keyQueue=narr;
            //console.log('realse'+JSON.stringify(keyQueue));
        })
    },
    menu:(container:string,cfg:any={})=>{
        //1.准备所有的菜单dom结构；
        const w=375,h=600,mid=270,fix=5;		//中线位置配置
        const left=210;
        const ls=[
            //UI.toast('toast',{left:'28%',width:'52%',fontSize:12,className:'world_toast'}),		//信息提示容器
            //UI.dialog('dialog',{left:'10%',width:'80%',fontSize:12,className:'world_dialog',clsOK:'btn btn-sm btn-default',clsNO:'btn btn-sm btn-primary'}),		//对话框容器
            //UI.form('form',{className:'world_form'}),										//表单容器
            UI.table('info',{width:'50px',position:{left:'10px',top:'10px'},fontSize:12,}),										//信息页容器
            UI.border('border',{border:3,width:w,height:h,clsName:'world_border',clsButton:'btn btn-md btn-danger',btnTitle:'关闭'}),		//编辑边界显示容器
            UI.compass('compass',{img:'static/block/icon/compass.png',arrow:'static/block/icon/blue.png',width:'70px',height:'70px',top:'40px',left:left+'px'}),		//指南针容器
            UI.list('buttons',{className:'world_buttons',vertical:true,width:'60px',show:true,position:{right:'5px',bottom:'20px'}}),		//右下角功能按钮列表容器
            UI.mlist('pop',{width:'50px',className:'world_pop',position:{left:left+'px',bottom:mid+'px'}}),									//pop菜单列表
            UI.mlist('setting',{width:'50px',className:'world_pop',position:{left:left+'px',top:(h-mid+fix)+'px'}}),						//组件参数配置列表
            UI.mlist('sub',{width:'50px',className:'world_pop',position:{left:'80px',top:'300px'}}),										//sub菜单容器
            UI.mlist('more',{width:'50px',className:'world_pop',position:{left:'80px',top:'300px'}}),										//select容器
            UI.list('add',{title:'',clsTitle:'world_list_title',width:'80%',position:{left:'140px',bottom:'15px'}}),						//新添菜单容器
            UI.list('history',{title:'',clsTitle:'world_list_title',width:'70%',position:{left:'140px',bottom:'15px'}}),					//历史菜单容器
            UI.list('opt',{title:'',clsTitle:'world_list_title',width:'80%',position:{left:'200px',bottom:'30px'}}),						//新的功能操作菜单
            UI.counter('counter',{}),												//新的功能操作菜单
    
            //UI.list('control',{className:'world_buttons',vertical:true,width:'60px',show:true,position:{right:'5px',bottom:'20px'}})	
        ]
        UI.attatch(ls,container);
        const plist=[
            UI.info('info',{left:'30%',width:'40%',top:'40px',height:24,fontSize:20,className:'world_toast'}),		//信息提示容器
        ]
        UI.pre(plist,container);
        
        UI.get('info').struct('hello world');
    },
    getGUI:()=>{
        return gui.domElement;
    },
    setAgent:(key:string,fun:any)=>{
        if(agent[key]===undefined) return false;
        agent[key]=fun;
        return true;
    },
    layout:(container:string)=>{
        //1.构建页面需要的dom
        const ls=[
            UI.list('nav',{className:'world_nav',show:true,width:'45px'}),
            UI.table('summary',{width:'50px',position:{left:'8px',top:'85px'},fontSize:12,}),
            //ui.list('control',{vertical:false,width:'50%',position:{left:'5%',bottom:'2%'}}),		
        ];
        UI.attatch(ls,container);
        
        //2.设置asset的显示数据
        // let asset=UI.get('summary');
        // let user=root.core.getCache('user');
        // let rows=[
        //     {type:'icon',img:'static/icon/smPos.png',			name:'block',	value:JSON.stringify(player.block),	height:14},
        //     //{type:'icon',img:'',	name:'date',	value:str,	height:14},			//显示虚块历
        //     //{type:'icon',img:'',	name:'clock',value:n,	height:14},		//显示虚块时间
        // ];
        // asset.struct(rows);
        // asset.agent.onClick=function(){
        //     console.log('左上侧信息栏被点击')
        // };
    },
    saveBlock:(x:number,y:number,world:number)=>{
        const ckey=tools.blockCacheKey(world,x,y);
        const pdata=DB.getHash(ckey,Keys.processedKey);
        let block:any={};
        for(let k in pdata){
            if(!Preter[k] || !Preter[k][Hooks.save]) continue;
            if(k=='earth'){
                //console.log('earth:'+JSON.stringify(pdata[k]));
            }else{
                block[k]=Preter[k][Hooks.save](pdata[k],More.convert);
            }
        }
        const raw=tools.encode(JSON.stringify(block));
        const og=DB.getHash(ckey,Keys.byteKey);

        if(self.different(og.raw,raw)){
            syncChain(x,y,world,raw,()=>{
                
            });
        }
        self.clearMenu();
    },
    addAdjunct:(type:string)=>{
        const act=Run.get('edit');
        if(act==null) return false;
        const [x,y]=act;
        if(!Preter[type] || !Preter[type][Hooks.new]) return false;
        const ckey=tools.blockCacheKey(Player.get('world'),x,y);
        const dt=DB.getHash(ckey,Keys.processedKey);

        const pos=self.newObjectPosition();
        const row=Preter[type][Hooks.new](pos,More.convert);

        if(!dt[type]) dt[type]=[];
        dt[type].push(row.data);
        DB.setHash(ckey,Keys.processedKey,dt);

        const ids:any=!row.resource?null:[row.resource];
        update(ids);
        return true;
    },
    newObjectPosition:()=>{
        return [2000,3000,1000];
    },
    edit:(toEdit:any,exitEdit:any)=>{
        //console.log('ready to edit');
        if(Run.get('edit')==null){
            Run.set('edit',Player.get('block',true));
            fresh(true);

            toEdit && toEdit();

        }else{
            
            const world=Player.get('world');
            const [x,y]=Run.get('edit');
            self.saveBlock(x,y,world);

            self.reload(x,y,world);
            Run.del('edit');

            exitEdit && exitEdit();
        }
    },
    copy:()=>{
        const act=Run.get('active');
        if(act==null) return false;
        const {x,y,type,id}=act;
        if(!type || type=='earth') return false;

        const world=Player.get('world');
        const ckey=tools.blockCacheKey(world,x,y);
        const dt=DB.getHash(ckey,Keys.processedKey);
        if(!dt[type] || !dt[type][id]) return false;
        
        const obj=clone(dt[type][id]);
        obj.oz+=obj.z;
        dt[type].push(obj);

        self.reload(x,y,world);
        return true;
    },
    remove:()=>{
        const act=Run.get('active');
        if(act==null) return false;
        const {x,y,type,id}=act;
        if(!type || type=='earth') return false;
        const world=Player.get('world');
        const ckey=tools.blockCacheKey(world,x,y);
        const dt=DB.getHash(ckey,Keys.processedKey);
        if(!dt[type] || !dt[type][id]) return false;

        let left:Array<any>=[];
        for(let i=0,len=dt[type].length;i<len;i++){
            if(i!=id) left.push(dt[type][i]);
        }
        dt[type]=left;

        self.reload(x,y,world);

        return true;
    },
    up:()=>{
        
    },
    down:()=>{
        
    },
    left:()=>{
        
    },
    right:()=>{
        
    },
    face:()=>{
        const edit=Run.get('edit');
        if(!edit) return false;
        //console.log(JSON.stringify(Run.get('active')));

        let index=0;
        const len=config.faceOrder.length;
        for(let i=0;i<len;i++) if(config.faceOrder[i]==config.curOrder) index=i;
        const next=index==len-1?0:index+1;
        config.curOrder=config.faceOrder[next];

        const world=Player.get('world');
        const [x,y]=edit;

        
        redraw(x,y,world)
        const act=Run.get('active');
        //console.log(act)
        if(act!=null){
            //Stage.remove(x,y,'helper');
            self.showActive(act);
        }
        return true;
    },
    reload:(x:number,y:number,world:number)=>{
        const bks=[[x,y,world]];
        rebuild(bks,bks);

        const act=Run.get('active');
        if(act!=null) self.showActive(act);
    },
    different:(origin:string,raw:Array<number>):boolean=>{
        const dt=tools.decode(origin);
        if(dt==null) return false;
        
        const og=tools.encode(dt);
        //console.log('[controller.ts=>different()] origin:'+JSON.stringify(og)+',new:'+JSON.stringify(raw));
        if(og.length!=raw.length) return true;
        for(let i=0,len=og.length;i<len;i++)if(og[i]!=raw[i]) return true;

        return false;
    },
    getVectorPoint:(ev:any,offset:any)=>{
        //const ee = window.event && (!window.event.touches ? ev: window.event.touches[0]);
        //console.log('原始数据：'+JSON.stringify([ev.clientX,ev.clientY])+',修正结果:'+JSON.stringify([ev.clientX-offset.left,ev.clientY-offset.top])+',offset:'+JSON.stringify(offset));
        //console.log('屏幕尺寸：'+JSON.stringify([window.innerWidth,window.innerHeight])+',配置尺寸：'+JSON.stringify(config))
        const mouse = new THREE.Vector2();
        mouse.x = ((ev.clientX-offset.left)/(config.width?config.width:window.innerWidth))*2 -1;
        mouse.y = -((ev.clientY-offset.top)/(config.height?config.height:window.innerHeight))*2 + 1;
        
        return mouse;
    },
    touchstart:(ev:any)=>{
        self.clearMenu();
        self.clearHelper();
        const edit=Run.get('edit');
        if(edit!=null){
            const [x,y]=edit;
            const offset=Run.get('offset');     //获取canvas的offset
            const mouse=self.getVectorPoint(ev,offset);
            const active=Raycast(mouse,x,y);
            //console.log('[controller.ts->touchstart()]准备亮显物品'+JSON.stringify(Run.get('active')));
            if(active!=false){
                Run.set('active',active);
                if(agent.onChange!=null) agent.onChange(active);
            }else{
                Run.del('active');
            }
            self.operation();
        }
    },

    
    operation:()=>{
        const act=Run.get('active');
        if(act==null){
            console.log('[controller.ts=>operation()]没有选中任何组件');

        }else{
            const act=Run.get('active');
            self.showActive(act);
            self.showMenu(act);
        }
    },
    clearHelper:()=>{
        const edit=Run.get('edit');
        if(edit!=null){
            const [x,y]=edit;
            Stage.remove(x,y,'helper');
        }
    },
    clearMenu:()=>{
        for(let k in items){
            gui.remove(items[k]);
        }
        items={};
        return true;
    },
    showMenu:(act:fmtActive)=>{
        const {x,y,type,id}=act;
        const world=Player.get('world');
        if(act.type=='earth'){
            // const edata=self.getObject(x,y,type,id);
            // let earth={
            //     elevation:edata.z+edata.oz,
            //     texture:edata.texture,
            // }
            // for(let k in earth){
            //     items[k]=gui.add(earth,k).name('param:'+k).onChange((val) => {
            //         switch (k) {
            //             case 'elevation':
            //                 edata.oz=val-edata.z;   //修改标高
            //                 self.reload(x,y,world);
            //                 break;
            //             case 'texture':
            //                 Resource.sync([val],()=>{
            //                     self.reload(x,y,world);
            //                 });
            //                 break;
            //             default:
            //                 self.reload(x,y,world);
            //                 break;
            //         }
            //     });
            // }

        }else{
            const row=self.getObject(x,y,type,id);
            for(let k in row){
                if(typeof(row[k])=='object') continue;
                items[k]=gui.add(row,k).name('param:'+k).onChange((val) => {
                    row[k]=val;
                    if(k=='texture' || k=='resource'){
                        //console.log('ready to get texture or resource');
                        Resource.sync([val],()=>{
                            self.reload(x,y,world);
                        });
                    }else{
                        self.reload(x,y,world);
                    }
                });
            }
        }
        return true;
    },
    saveEarth:(x:number,y:number)=>{

    },
    saveAdjunct:(x:number,y:number,type:string,id:number)=>{

    },
    showActive:(act:fmtActive)=>{
        if(act.type=='earth') return false;
        const cvt=More.convert;
        const obj=self.getObject(act.x,act.y,act.type,act.id);
        const target={
            size:{x:obj.x,y:obj.y,z:obj.z},
            position:{x:obj.ox,y:obj.oy,z:obj.oz},
            rotation:{x:obj.rx,y:obj.ry,z:obj.rz}
        }
        const cage=self.getCage();      //控制高度的cage，后面从world里获取配置

        const cfg:any={offsetX:config.offsetX*cvt,offsetY:config.offsetY*cvt,convert:cvt,type:'ladder'};

        //格式化的3D数据，stage会转换成three.js的3DObject
        const ges=Ladder(target,config.curOrder,cage,cfg);      
        const [x,y]=Run.get('edit');
        Stage.add(x,y,{geometry:ges},0);
        return true;
    },
    getCage:()=>{
        const cvt=More.convert,s=World.side*cvt;
        return [s,s,8*cvt]
    },
    getBase:(x:number,y:number,s:number)=>{
        const ckey=tools.blockCacheKey(Player.get('world'),x,y);
        return [s*(x-1),s*(y-1),DB.getHash(ckey,'elevation')];
    },
    getOrigin:(x:number,y:number,type:string,id:number)=>{
        //console.log('ok,getOrigin');
        const ckey=tools.blockCacheKey(Player.get('world'),x,y);
        const dt=DB.getHash(ckey,Keys.originKey);
        
        if(type=='earth'){
            if(!dt || !dt[type]) return false;
            return dt[type];
        }else{
            if(!dt || !dt[type] || !dt[type][id]) return false;
            return dt[type][id];
        }
    },
    getObject:(x:number,y:number,type:string,id:number)=>{
        const ckey=tools.blockCacheKey(Player.get('world'),x,y);
        const dt=DB.getHash(ckey,Keys.processedKey);
        if(type=='earth'){
            if(!dt || !dt[type]) return false;
            return dt[type];
        }else{
            if(!dt || !dt[type] || !dt[type][id]) return false;
            return dt[type][id];
        }
    },
}

//入口方法，外部调用的入口，这里处理好所有的逻辑
function autoControl(container:string,cfg:any={}) {
    //console.log(cfg)
    const sel=$('#'+container);
    //1.创建dom,放置ui的dom
    const domID=tools.hash();
    sel.append('<div id="'+domID+'"></div>');

    //2.加载操作菜单
    self.menu(container);           //加载菜单
    self.layout(container);         //显示布局处理
    self.keyAction();               //键盘响应
    Frame.put('ctlPC',self.sync);     //帧同步的实现

    //3.配置屏幕尺寸
    if(cfg.width) config.width=cfg.width;
    if(cfg.height) config.height=cfg.height;
    //4.启动触控检测
    const offset=sel.offset();
    Run.set('offset',offset);       //设置好canvas的位移，用于raycast
    sel.find('canvas').off('click').on('click',self.touchstart);
}

export {autoControl,self as Controller};