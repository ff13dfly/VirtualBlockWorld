

//预定义的grid的颜色配置
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
    /*取box定义面上的4个角点
	 *@param	start		array		//[x,y,z],block的定位点
	 * @param	size		array		//[x,y,z],box的尺寸
	 * @param	offset	array		//[ox,oy,oz],box相对于start的偏移
	 * @param	face		string		//['x','y','z','-x','-y','-z']中的一个
	 * return
	 * {leftTop:point,rightTop:point,leftBottom:point,rightBottom:point}	//4个角点的位置
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

//定义好helper配置部分的参数
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

/*绘制辅助线的入口，在3D的object里按照指定面显示辅助线和吸附点
*@param target  3Dobject                //标准的3d对象{size:{x:0,y:0,z:0},position:{x:0,y:0,z:0},rotation:{x:0,y:0,z:0}}
*@param face    string                  //[x,y,z,-x,-y,-z]中的一个
*@param cage    array                   //[wx,wy,wz]类型的数组，显示grid的范围
*@param cfg     object:LadderConfig     //ladder的配置
*return
*标准的3D解析结构
*/
function helper(target:target,face:string,cage:any,cfg:helperConfig,pcfg:any=pointConfig){
    let geometry:Array<any>=[];     //输出结果
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