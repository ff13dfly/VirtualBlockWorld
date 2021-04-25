
// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {DB} from '../cache';
import {Player} from '../player';
import {Capacity,Keys,World,More} from './setting';
import {tools} from './tools';
import {Preter} from'../preter';
import {rebuild} from '../entry';

const self={
  isCrossRange:(px:number,py:number,s:number,dis:number)=>{
    //console.log('[movement.ts => isCrossRange()] param:'+JSON.stringify({px:px,py:py,s:s,dis:dis}));
    if(px+dis<=s && py+dis<=s && px-dis>=0 && py-dis>=0) return false;		//在安全范围内，不可能cross
    return true;
  },

  crossCheck:(px:number,py:number,s:number)=>{
    if(px>=0 && py>=0 && px<=s && py<=s) return false;	//边缘位置计算之后，仍未超出，直接返回
    let rst={delta:[0,0],position:[0,0]};		//返回block的位差和合法的position位置
        
    rst.delta=self.crossDelta(px,py,s);
    rst.position=self.transPlayerPosition(px,py,s);
    //console.log('[movement.ts => crossCheck()] player:'+JSON.stringify(rst));
    return rst;
  },

  crossDelta:(px:number,py:number,s:number):Array<number>=>{
    let delta=[0,0];
    const cx=px/s,cy=py/s;
    if(cx>1)delta[0]=1;
    if(cx<0)delta[0]=-1;
    if(cy>1)delta[1]=1;
    if(cy<0)delta[1]=-1;
    return delta;
  },
  transPlayerPosition:(px:number,py:number,s:number)=>{
    let x=px<0?px+s:px>s?px-s:px;
    let y=py<0?py+s:py>s?py-s:py;
    return [x,y];		//精度为小数点后6位
  },		
    
  blockEvent:(x:number,y:number,pos:Array<number>,elevation:number,type:number,preEle:number=0)=>{
    const num=type==0?Capacity.span:type==1?Capacity.jump:Capacity.squat;		//根据player的状态，取运动能力
    let param:any={pos:pos,elevation:elevation,cap:num,height:Player.get('height')};
    if(preEle!=undefined) param['pre']=preEle;		//处理cross的情况
    
    const stop=self.stopCheck(x,y,Capacity.death,param);		//这里会设置用户的站立高度，即position z
    //console.log('[movement.ts=>blockEvent()]stop检测结果'+JSON.stringify(stop));
    if(stop) return false;													//被阻拦体阻断，停止操作

    //console.log('[movement.ts=>blockEvent()]设置player位置');  
    // self.coinCheck(x,y,pos);			//本地coin位置检测
    // self.triggerCheck(x,y,pos);		//触发器检测
        
    //5.保存用户的新位置及请求数据
    const ppos=Player.get('position');
    Player.set('position',[pos[0],pos[1],ppos[2]]);
    Player.set('block',[x,y]);
    return true;
  },
  
  stopCheck:(x:number,y:number,death:number,param:any)=>{
    const world=Player.get('world');
    const main=tools.blockCacheKey(world,x,y);
    const stops=DB.chain([main,Keys.processedKey,'stop']);
    const res=Preter.stop.check(param,stops);
    if(res.stop) return true;		//1.处理stop拦截的情况
    //console.log('[movement.ts => stopCheck]'+JSON.stringify(res));
    self.setPlayerStand(x,y,param.elevation,death,res);   //2.处理player的站立高度的问题
    return false;
  },
  setPlayerStand:function(x:number,y:number,va:number,death:number,res:any){
    if(res.empty){			
      //player运动到地面上的站立高度处理
      if(Player.get('stop')<0){     //player之前站立在地面上
        let pos=Player.get('position');
        pos[2]=va;
        Player.set('position',pos);
      }else{          //player之前站立在stop上
        Player.set('stop',-1);
        const pos=Player.get('position');
        const dz=pos[2]-va;
        if(dz>death){
          console.log('death on ground');
          Player.death(x,y,dz);
        }else{
          //console.log('fall '+dz+'mm to ground and status:'+JSON.stringify(res));
          Player.fall(dz);
        }
      }
    }else{
      //player运动到stop上的站立高度处理
      if(res.delta!=undefined && res.id>=0){		//a.有stop可以上去
        if(res.delta<0 && -res.delta>=death){
          Player.death(x,y,Math.abs(res.delta));
        }else{
          Player.set('stop',res.id);
          let pos=Player.get('position');
          pos[2]+=res.delta;
          Player.set('position',pos);
        }
      }else{	//b.有stop在头顶
        //console.log('what?'+JSON.stringify(res))
        if(Player.get('stop')<0){	//1.用户原来就在地面山上
          const pos=Player.get('position');
          pos[2]=va;
          Player.set('position',pos);
        }else{					//2.用户原来站在stop上
          const pos=Player.get('position');
          const dz=pos[2]-va;
          Player.set('stop',-1);
          if(dz>=death){
            console.log('death on stop')
            Player.death(x,y,dz);
          }else{
            //console.log('fall '+dz+'m  to stop and status:'+JSON.stringify(res)+',death:'+death)
            Player.fall(dz);
          }
        }
      }
    }
    //console.log('[movement.ts => setPlayerStand()] player:'+JSON.stringify(Player.dump()));
    return false;
  },

  isWorldEdge:(x:number,y:number,delta:Array<number>)=>{
    if(x+delta[0]<1 || y+delta[1]<1) return true;		//边界阻止运动
    if(x+delta[0]>World.xMax||y+delta[1]>World.yMax) return true;
    return false;
  },
  crossStuff:function(x:number,y:number,delta:Array<number>,va:number,vb:number){
    const block=Player.get('block'),ext=Player.get('extend');
    const pre=[block[0]-delta[0],block[1]-delta[1]];
    const obj=self.blockLoad(pre,delta,ext);
    rebuild(obj.load,obj.destroy);
    
    return true;

    //处理cross后的站立高度
			// if(player.stop<0){
			// 	//aa.判断前后的高差
			// 	if(va-vb>=me.core.capacity.death){
			// 		root.movement.death(x,y,va-vb);
			// 	}else{
			// 		player.position[2]=vb;
			// 	}
			// }
  },
  blockLoad:function(now:Array<number>,delta:Array<number>,ext:Array<number>){
    //console.log('[movement.ts => blockLoad] now:'+JSON.stringify(now)+',delta:'+JSON.stringify(delta)+',ext:'+JSON.stringify(ext));
    let dlist=[],glist=[];
    const [ex,ey]=ext;
    const rgx=ex+ex+1,rgy=ey+ey+1;
   
    const x=delta[0]>0?now[0]-ex:now[0]+ex,y=delta[1]>0?now[1]-ey:now[1]+ey;
    if(delta[0]!=0 && delta[1]==0){
      for(let i=-ey;i<=ey;i++){
        //if(now[1]+i<1) continue;
        dlist.push([x,now[1]+i]);
        glist.push([x+(delta[0]>0?rgx:-rgx),now[1]+i])
      }
    }else if(delta[0]==0 && delta[1]!=0){
      for(let i=-ex;i<=ex;i++){
        dlist.push([now[0]+i,y]);
        glist.push([now[0]+i,y+(delta[1]>0?rgy:-rgy)]);
      }
    }else if(delta[0]!=0 && delta[1]!=0){
      const sx=delta[0]>0?1:0,exn=delta[0]>0?0:-1;
      const sy=delta[1]>0?1:0,eyn=delta[1]>0?0:-1;
      
      //1.计算删除的块
      for(let i=-ey;i<=ey;i++) dlist.push([x,now[1]+i]);
      for(let i=-ex+sx;i<=ex+exn;i++) dlist.push([now[0]+i,y]);

      //2.计算加载的块
      for(let i=-ey+sy;i<=ey+eyn;i++)glist.push([x+(delta[0]>0?rgx:-rgx),now[1]+i]);
      for(let i=-ex+sx;i<=ex+exn;i++)glist.push([now[0]+i,y+(delta[1]>0?rgy:-rgy)]);
      glist.push([now[0]+(delta[0]>0?ex+1:-ex-1),now[1]+(delta[1]>0?ey+1:-ey-1)]);
    }

    //console.log('预加载'+glist.length+'块:'+JSON.stringify(glist));
    //console.log('预销毁'+dlist.length+'块:'+JSON.stringify(dlist));

    //3.处理超过限制的块  
    let alist=[],blist=[];
    const xm=World.xMax,ym=World.yMax,world=Player.get('world');
    for(let i=0,len=glist.length;i<len;i++){
      const [cx,cy]=glist[i];
      if(cx<1 || cx > xm  || cy<1 || cy>ym) continue;
      alist.push([world,cx,cy]);
    }
    for(let i=0,len=dlist.length;i<len;i++){
      const [cx,cy]=dlist[i];
      if(cx<1 || cx > xm  || cy<1 || cy>ym) continue;
      blist.push([world,cx,cy]);
    }

    //console.log('实际加载'+alist.length+'块:'+JSON.stringify(alist));
    //console.log('实际销毁'+blist.length+'块:'+JSON.stringify(blist));

    return {load:alist,destroy:blist};
  },
}

function check(dis:number,fix:number,type:number=0){
    const [x,y]=Player.get('block'),world=Player.get('world');
    const ak=Player.get('rotation')[1];
    const [dx,dy,dz]=Player.get('position');
    const nx=dx-dis*Math.sin(ak+fix),ny=dy+dis*Math.cos(ak+fix),nz=dz;

    const main=tools.blockCacheKey(world,x,y);
    const et=DB.chain([main,Keys.processedKey,'earth']);
    const va=et.z*0.5+et.oz;	    //计算player的站立高度
    //console.log('[movement.ts=>check()],elevation:'+va);

    const s=World.side*More.convert;
    //console.log('[movement.ts=>check()]checking...');
    if(!self.isCrossRange(dx,dy,s,dis)){						//检查是否进入了外部cross区域
      return self.blockEvent(x,y,[nx,ny,nz],va,type);
    }else{
      const cs=self.crossCheck(nx,ny,s);						//边缘位置移动检查
      //console.log('[movement.ts=>check()]跨块检测结果:'+JSON.stringify(cs));
      if(cs==false){
        //在边缘区域，但是没有跨块
        return self.blockEvent(x,y,[nx,ny,nz],va,type);			
      }else{
        //检查跨越后的两种不能运动的情况
        if(self.isWorldEdge(x,y,cs.delta)) return false;		//处于世界边缘时阻止运动
          //1.检查海拔高度是否阻挡
          const next=tools.blockCacheKey(world,x+cs.delta[0],y+cs.delta[1]);
          const en=DB.chain([next,Keys.processedKey,'earth']);
          const vb=en.z;
          const num=type==0?Capacity.span:type==1?Capacity.jump:Capacity.squat;
          if(vb-dz>num) return false;						//下一块海拔高度相对于站立高度是否阻挡
          
        
          const pos=[cs.position[0],cs.position[1],nz];
          const cstop=self.blockEvent(x+cs.delta[0],y+cs.delta[1],pos,vb,type,va);
          console.log('final chek, cross block:'+JSON.stringify(cs)+',stop check:'+cstop);
          if(!cstop)  return false;
          return self.crossStuff(x+cs.delta[0],y+cs.delta[1],cs.delta,0,0);
      }
    }
}

export {check};