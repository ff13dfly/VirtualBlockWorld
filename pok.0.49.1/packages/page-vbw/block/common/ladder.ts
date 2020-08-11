
// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//color of the axis
const gridColor:any={       
    'x':'#990000',
    'y':'#009900',
    'z':'#000099',
    '-x':'#990000',
    '-y':'#009900',
    '-z':'#000099',
}

const pointConfig={
    width:0.03,
    color:'#00FF00',
    opacity:0.5,
}

const self={
    grid:(target:target,cage:any,face:string,offsetX:number,offsetY:number)=>{
        let lines:any=[];
    
        const len=face.length,f=len==1?face:face[1];
        const [mx,my,mz]=cage;
        const {size,position}=target;
    
        let tmp:any=[];
        //let pa=[0,0,0],pb=[0,0,0],pos=[0,0,0];
        let cx=0,cy=0,sx=0,sy=0,sz=0,pos=[0,0,0]
        switch (f) {
            case 'x':
                cx=Math.floor(my/offsetX)+1;
                cy=Math.floor(mz/offsetY)+1;
                sx=position.x+(len==1?0.5*size.x:-0.5*size.x);
                pos=[sx,sy,sz];
                for(let i=0;i<cx;i++){
                    tmp.push([[0,i*offsetX,0],[0,i*offsetX,mz],pos]);
                }
    
                for(let i=0;i<cy;i++){
                    tmp.push([[0,0,i*offsetY],[0,my,i*offsetY],pos]);
                }
                break;
            case 'y':
                cx=Math.floor(mx/offsetX)+1;
                cy=Math.floor(mz/offsetY)+1;
                sy=position.y+(len==1?0.5*size.y:-0.5*size.y);
                pos=[sx,sy,sz];
                for(let i=0;i<cx;i++){
                    tmp.push([[i*offsetX,0,0],[i*offsetX,0,mz],pos]);
                }
    
                for(let i=0;i<cy;i++){
                    tmp.push([[0,0,i*offsetY],[mx,0,i*offsetY],pos]);
                }
                break;
            case 'z':
                cx=Math.floor(mx/offsetX)+1;
                cy=Math.floor(my/offsetY)+1;
                sz=position.z+(len==1?0.5*size.z:-0.5*size.z);
                pos=[sx,sy,sz];
                for(let i=0;i<cx;i++){
                    tmp.push([[i*offsetX,0,0],[i*offsetX,my,0],pos]);
                }
    
                for(let i=0;i<cy;i++){
                    tmp.push([[0,i*offsetY,0],[mx,i*offsetY,0],pos]);
                }
                break;
            default:
                break;
        }
        
        const cc=gridColor[face];
        for(let i=0,len=tmp.length;i<len;i++){
            const [pa,pb,pos]=tmp[i];
            const line={
                type:'line',data:[pa,pb],position:pos,rotation:[0,0,0],
                cfg:{color:cc,opacity:1,edge:false},
                info:{type:'helper',skip:true},
            }
            lines.push(line);
        }
        return lines;
    },

    /*calc the contact face cornor points
	 *@param	start		array		//[x,y,z],object box position
	 * @param	size		array		//[x,y,z],object box size
	 * @param	offset	array		    //[ox,oy,oz],object box offset related with the param start
	 * @param	face		string		//['x','y','z','-x','-y','-z'],one in the axis array
	 * return
	 * {leftTop:point,rightTop:point,leftBottom:point,rightBottom:point}	//cornor point result
	 * */
	points:function(start:Array<number>,size:any,offset:any,face:string){
		const len=face.length,f=len==1?face:face[1];
        const bx=start[0]+offset.x,by=start[1]+offset.y,bz=start[2]+offset.z;

        let rst:any={
            leftTop:[0,0,0],
            rightTop:[0,0,0],
            leftBottom:[0,0,0],
            rightBottom:[0,0,0],
        }
        let left=0,right=0,top=0,bottom=0,px=0,py=0,pz=0;
		switch (f){
			case 'x':
				px=bx+(len==1?0.5*size.x:-0.5*size.x);
				left=by+(len==1?-0.5*size.y:0.5*size.y);
				right=by+(len==1?0.5*size.y:-0.5*size.y);
				top=bz+0.5*size.z;
				bottom=bz-0.5*size.z;
				//console.log('face:'+face+',x'+px+',left:'+left+',right:'+right+',top:'+top+',bottom:'+bottom)
				rst.leftTop=[px,left,top];
				rst.rightTop=[px,right,top];
				rst.leftBottom=[px,left,bottom];
				rst.rightBottom=[px,right,bottom];
				break;
			case 'y':
				py=by+(len==1?0.5*size.y:-0.5*size.y);
				left=bx+(len==1?-0.5*size.x:0.5*size.x);
				right=bx+(len==1?0.5*size.x:-0.5*size.x);
				top=bz+0.5*size.z;
				bottom=bz-0.5*size.z;
				//console.log('face:'+face+',y'+py+',left:'+left+',right:'+right+',top:'+top+',bottom:'+bottom);
				rst.leftTop=[left,py,top];
				rst.rightTop=[right,py,top];
				rst.leftBottom=[left,py,bottom];
				rst.rightBottom=[right,py,bottom];
				break;
			case 'z':
				pz=bz+(len==1?0.5*size.z:-0.5*size.z);
				left=bx+(len==1?-0.5*size.x:0.5*size.x);
				right=bx+(len==1?0.5*size.x:-0.5*size.x);
				top=by+(len==1?-0.5*size.y:0.5*size.y);
				bottom=by+(len==1?0.5*size.y:-0.5*size.y);
                
                //console.log('face:'+face+',y'+py+',left:'+left+',right:'+right+',top:'+top+',bottom:'+bottom);
				rst.leftTop=[left,top,pz];
				rst.rightTop=[right,top,pz];
				rst.leftBottom=[left,bottom,pz];
				rst.rightBottom=[right,bottom,pz];
				break;
			default:
				break;
		}
		return rst;
	},
}

//helper config definetion
interface helperConfig{
    offsetX:number,
    offsetY:number,
    convert:number,
    type:string,
}

interface target{
    size:{x:number,y:number,z:number},
    position:{x:number,y:number,z:number},
    rotation:{x:number,y:number,z:number},
}

/*helper grid of 3D object , on the face of target object
*@param target  3Dobject                //standard 3D object {size:{x:0,y:0,z:0},position:{x:0,y:0,z:0},rotation:{x:0,y:0,z:0}}
*@param face    string                  //[x,y,z,-x,-y,-z],axis selected
*@param cage    array                   //[wx,wy,wz],limit of the helper
*@param cfg     object:LadderConfig     //ladder config
*return
*标准的3D解析结构
*/
function helper(target:target,face:string,cage:any,cfg:helperConfig,pcfg:any=pointConfig){
    let geometry:Array<any>=[];     //result:three.js object array
    const {size,position,rotation}=target;
    const cvt=cfg.convert,bc=pcfg.width*cvt;

    //1.计算吸附点
    const base=[0,0,0]          //运行正常后，去除这个参数
    const fps=self.points(base,size,position,face);		//获取grid面的4个角点
    const box=[bc,bc,bc],ro=[rotation.x,rotation.y,rotation.z];
    for(let k in fps){
        const fp=fps[k];
        const point={
            type:'box',data:box,position:fp,rotation:ro,
            cfg:{
                color:pcfg.color,
                opacity:pcfg.opacity,
                edge:true,          //显示边缘
            },
            info:{type:cfg.type,skip:true},
        };
        geometry.push(point);
    }

    //2.计算grid的line;
    const lines=self.grid(target,cage,face,cfg.offsetX,cfg.offsetY);
    for(let i=0,len=lines.length;i<len;i++) geometry.push(lines[i]);

    return geometry;
}



export{helper as Ladder}