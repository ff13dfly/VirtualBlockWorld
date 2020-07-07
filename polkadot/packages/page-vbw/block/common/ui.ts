
import $ from 'jQuery';
import {clone} from './tools';

let run:any={}

//form单条数据格式
interface FormRow{
    label:string,
    
    name:string,
    data:any,
    type:string,
    unit:string,
    style:object|undefined,
    on:object|undefined,
}

//list的格式，后面再处理
// interface ListRow{
//     label:string,
    
//     name:string,
//     data:any,
//     type:string,
//     unit:string,
//     style:object|undefined,
//     on:object|undefined,
// }

//基础结构形式，解决类型匹配的问题
interface DomStruct{
    [key:string]:any;
}

//{label:get('sizeY',lang),name:'Sizey',data:size[1],type:'int',unit:'m',style:style,on:{blur:self.checkInput}},

const basic:DomStruct={
    keypad:function(name:string,data:any,st:any,cls:string){
        var s='"';
        for(var k in st) s+=k+':'+st[k]+';';
        s+='"';
        return '<div class="'+cls+' keypad_replace" id="'+name+'"  name="'+name+'" style='+s+' value="'+data+'">'+data+'</div>'
        //return '<input type="text"  class="'+cls+'" id="'+name+'"  name="'+name+'" value="'+data+'" style='+s+(disable?' disabled':'')+'>';
    },
    
    text:function(name:string,data:any,st:any,cls:string,disable:boolean){
        var s='"';
        for(var k in st) s+=k+':'+st[k]+';';
        s+='"';
        return '<input type="text"  class="'+cls+'" id="'+name+'"  name="'+name+'" value="'+data+'" style='+s+(disable?' disabled':'')+'>';
    },
    
    bool:function(name:string,data:any,st:any,cls:string,disable:boolean){
        var s='"';
        for(var k in st) s+=k+':'+st[k]+';';
        s+='"';
        var ch=data!=0?'checked="checked"':'';
        return '<label class="'+cls+'"><input type="checkbox" id="'+name+'"  name="'+name+'" '+ch+'style='+s+(disable?' disabled':' ')+'><span></span></label>';
    },
    
    int:function(name:string,data:any,st:any,cls:string,disable:boolean){
        var s='"';
        for(var k in st) s+=k+':'+st[k]+';';
        s+='"';
        return '<input type="number"  class="'+cls+'"  id="'+name+'" name="'+name+'" value="'+data+'" style='+s+(disable?' disabled':'')+'>';
    },
    float:function(name:string,data:any,st:any,cls:string,disable:boolean){
        var s='"';
        for(var k in st) s+=k+':'+st[k]+';';
        s+='"';
        return '<input type="number" class="'+cls+'"  id="'+name+'" name="'+name+'" value="'+data+'" style='+s+(disable?' disabled':'')+'>';
    },
    // select:function(name:string,data:any,st:any,cls:string,disable:boolean){
    //     var s='"';
    //     for(var k in st) s+=k+':'+st[k]+';';
    //     s+='"';
    //     var dom='<select  class="'+cls+'" style='+s+'  id="'+name+'" name="'+name+'" '+(disable?' disabled':'')+' >';
    //     for(var k in arr){
    //         dom+='<option value="'+k+'">'+arr[k]+'</option>'
    //     }
    //     dom+='</select>'
    //     return dom;
    // },
}

const self={
    get:function(name:string){
        return run[name]?run[name].funs:false;
    },

    hide:function(coms:Array<string>){
        if(coms.length==0) return false;
        for(let i in coms){
            let name=coms[i];	
            if(run[name]!=undefined)run[name].funs.hide();
        }
        return true;
    },
    
    show:function(coms:Array<string>){
        if(coms.length==0) return false;
        for(let i in coms){
            let name=coms[i];	
            if(run[name]!=undefined)run[name].funs.show();
        }
        return true;
    },
    pre:function (blocks:any,container:string,cfg={}) {
        let sel=self.domInit(container,true);
		for(let i in blocks){
			let row=blocks[i];
			run[row.name]={id:row.id,funs:row.funs};			//保存对象
			if(row.agent) run[row.name].funs['agent']=row.agent;		//数据数据输出的方式
			if(row.dom)	sel.append(row.dom)						//添加dom到主容器
			if(row.map)	sel.find('#'+row.id).css(row.map);	    //设置dom的样式	
			if(row.auto)	row.auto();							//自动运行委托内容													
		}
    },
    attatch:function (blocks:any,container:string,cfg={}) {
        let sel=self.domInit(container);
		for(let i in blocks){
            let row=blocks[i];
            //console.log(row);
			run[row.name]={id:row.id,funs:row.funs};			    //保存对象
			if(row.agent) run[row.name].funs['agent']=row.agent;	//数据数据输出的方式
			if(row.dom)	sel.append(row.dom)						    //添加dom到主容器
			if(row.map)	sel.find('#'+row.id).css(row.map);	        //设置dom的样式	
			if(row.auto) row.auto();							    //自动运行委托内容													
		}
    },

    domInit:function(container:string,pre:boolean=false){
        const id=hash();
        if(pre) return $('#'+container).prepend('<div id="'+id+'"></div>').find('#'+id);
        return $('#'+container).append('<div id="'+id+'"></div>').find('#'+id);
    },

    //运动方向指针UI
    counter:function(name:string,cfg:any){
        let id=hash();
        let dom='<div id="'+id+'" '+(cfg.className?'class="'+cfg.className+'"':'')+'></div>';
        let map={'top':'10px'}
        let selector=null;
        return {name:name,map:map,id:id,dom:dom,funs:{struct:struct},auto:auto};
        function auto(){
            selector=$('#'+id);
            selector.hide();
        }

        function struct(){

        }
    },

    toast:function(name:string,cfg:any){
        const id=hash();
        const dom='<div id="'+id+'" '+(cfg.className?'class="'+cfg.className+'"':'')+'></div>';
        const map={'top':(cfg.top || '10px'),'left':cfg.left,'width':cfg.width,'font-size':cfg.fontSize+'px',};
        let selector:any;

        const auto=()=>{
            selector=$('#'+id);
            selector.hide();
        }

        const struct=(info:string,exp:number=2000)=>{
            selector.html(info).show();
            setTimeout(function(){
                selector.html('').hide();
            },exp);
        }
        return {name:name,map:map,id:id,dom:dom,funs:{struct:struct},auto:auto};
    },

    info:function(name:string,cfg:any){
        const id=hash();
        const dom='<div id="'+id+'" '+(cfg.className?'class="'+cfg.className+'"':'')+'></div>';
        const map={'top':(cfg.top || '10px'),'left':cfg.left,'width':cfg.width,'font-size':cfg.fontSize+'px','height':cfg.height+'px',
        position: 'fixed',margin: '0 auto',background:'#EEEEEE',padding: '3px 3px 3px 3px',
        opacity: 0.6,'border-radius': '3px',color: '#000000','text-align': 'center',};
        let selector:any;
        const auto=()=>{
            selector=$('#'+id);
            selector.hide();
        }

        const struct=(info:string,exp:number)=>{
            selector.html(info).show();
        }
        return {name:name,map:map,id:id,dom:dom,funs:{struct:struct},auto:auto};
    },

    waiting:function(name:string,cfg:any){
        const id=hash();
        const map={'position':'fixed','top':'0px','left':'0px','width':'100%','height':'100%','text-align':'center'};
        let selector:any;


        const auto=()=>{
            selector=$('#'+id);
        }
        const struct=()=>{};

        const show=()=>{selector.show()}
        const hide=()=>{selector.hide()}

        return {name:name,map:map,id:id,dom:'<div id="'+id+'"></div>',funs:{struct:struct,show:show,hide:hide},auto:auto};
    },
    compass:function(name:string,cfg:any){
        let id=hash(),arrow=hash();
        let dom='<div id="'+id+'" >'
        dom+='<img src="'+cfg.img+'" style="width:'+cfg.width+';height:'+cfg.height+';position:relative;top:0px;left:0px;"></img>'
        dom+='<img id="'+arrow+'" src="'+cfg.arrow+'" style="width:'+cfg.width+';height:'+cfg.height+';position:fixed;top:'+cfg.top+';left:'+cfg.left+';"></img>'
        dom+='</div>';
        let map={'position':'fixed','top':cfg.top,'left':cfg.left,'width':cfg.width,'height':cfg.height,'text-align':'center'};
        let selector:any;

        let auto=()=>{
            selector=$('#'+id);
        }

        let setRotation=(ro:number)=>{
            let deg='rotate('+Math.floor( -180 * ro / Math.PI )+'deg)';
            let cmap={
                'transform':deg,
                '-webkit-transform':deg,
            }
            $("#"+arrow).css(cmap);
        }
        let show=()=>{selector.show()}
        let hide=()=>{selector.hide()}

        let funs={setRotation:setRotation,hide:hide,show:show};
        let agent:any={};

        return {name:name,map:map,id:id,dom:dom,funs:funs,auto:auto,agent:agent};
    },
    border:function(name:string,cfg:any){
        let id=hash();
        let dom='<div id="'+id+'" class="'+cfg.clsName+'">'
        dom+='<div class="top"></div><div class="right"></div><div class="bottom"></div><div class="left"></div>'
        dom+='<button style="position:fixed;right:0px;bottom:300px;" class="'+cfg.clsButton+'">'+cfg.btnTitle+'</button></div>'
        //var map={'display':'none'};
        let selector:any;
        //let agent={onClose:null,onShow:null};
        let agent:any;

        let auto=()=>{
            selector=$('#'+id);
            selector.hide();
            selector.find('button').off('click').on('click',hide);
            //处理border的显示
            let b=cfg.border,w=cfg.width,h=cfg.height
            selector.find('.top').css({'width':w+'px',height:b+'px'});
            selector.find('.right').css({'width':b+'px',height:h+'px'});
            selector.find('.bottom').css({'width':w+'px',height:b+'px',right:b+'px'});
            selector.find('.left').css({'width':b+'px',height:h+'px'});
        }

        let show=()=>{
            if(agent.onShow!=null) agent.onClose();
            selector.show();	
        }

        let hide=()=>{
            if(agent.onClose!=null) agent.onClose();
            selector.hide();
        }

        return {name:name,id:id,dom:dom,funs:{show:show,hide:hide},auto:auto,agent:agent};
    },
    table:function(name:string,cfg:any){
        let id=hash();
        let map:any={'position':'fixed','width':cfg.width,'text-align':'center','font-size':cfg.fontSize+'px','z-index':498};
        for(var k in cfg.position){
            map[k]=cfg.position[k];
        }
        let dom='<div id="'+id+'"></div>'

        let selector:any;

        let auto=()=>{ selector=$('#'+id);}
        
        let struct=(list:Array<any>)=>{
            let dom='<table border="0" style="magin:0 auto;padding:0px 0px 0px;text-align:right">';
            for(var i in list){
                var row=list[i];
                dom+='<tr style="padding:0px 0px 0px;width:'+row.height+'px"><td style="padding:0px 1px 0px 1px">'+(row.type=='icon'?'<img  style="width:'+row.height+'px" src="'+row.img+'">':row.name)+'</td>'
                dom+='<td style="padding:0px 1px 0px 1px">'+row.value+'</td></tr>';
            }
            dom+='</table>'
            selector.html(dom);
            
            selector.off('click').on('click',function(){
                if(agent.onClick) agent.onClick()
                
            })
        }
        
        let setRow=(n:number,val:any)=>{
            let tr=selector.find('tr');
            $(tr[n]).find('td:eq(1)').html(val);
        }
        let agent:any={onClick:null}
        return {name:name,map:map,id:id,dom:dom,funs:{struct:struct,setRow:setRow},auto:auto,agent:agent};        
    },

    mlist:function(name:string,cfg:any){
        let id=hash();
        let map:any={'position':'fixed','width':cfg.width,'text-align':cfg.align||'center','z-index':499,};
        if(!cfg.show)map['display']='none';
        for(let k in cfg.position){
            map[k]=cfg.position[k];
        }
        let title=cfg.title?('<span class="'+cfg.clsTitle+'">'+cfg.title+'</span>'):'';
        let dom='<div  id="'+id+'" '+(cfg.className?('class="'+cfg.className+'"'):'')+'>'+title+'</div>';
        
        //let fixed=false;
        
        let selector:any;
        //let vertical=cfg.vertical;
        let agent:any={onClick:null,onForm:null,onTodo:null,onDirect:null};

        let auto=()=>{selector=$('#'+id);}

        let struct=(list:Array<any>,cfg:any)=>{
            let ids:any={},dom='<ul>';
            for(var i in list){
                let row=list[i],id=hash();
                ids[i]=id;
                var name=row.name+(row.sub?'<span class="pop_more">><span>':'');
                if(row.type=='icon'){
                    dom+='<li index="'+i+'" id="'+id+'" data="'+(row.data?row.data:"nope")+'">'+(row.img?'<img src="'+row.img+'" style="width:'+row.width+'px;height:'+row.height+'px" data="'+(row.data?row.data:"nope")+'">':name)+'</li>';
                }else if(row.type=='button'){
                    dom+='<li><button index="'+i+'"  id="'+id+'" class="'+(row.cls?row.cls:"")+'" auto="'+(row.autoClose?true:false)+'" data="'+(row.data?row.data:"nope")+'">'+name+'</button></li>';
                }
            }
            dom+='</ul>';
            selector.html(title+dom)	//填充dom
            
            var umap={'margin': '0 auto','list-style': 'none','padding': '0px 0px 0px 0px'};
            var imap={'float': 'left','list-style': 'none'};
            selector.find('ul').css(umap).find('li').css(imap);	//处理样式
            
            //var tapLocker=false;		//tap锁，防止重复点击
            for(var i in list){
                var row=list[i],sel=$('#'+ids[i])
                //1.直接执行的处理
                if(row.on)	sel.off('click').on('click',row.on);		//直接执行on
                
                //2.处理sub的情况
                if(row.sub){
                    sel.off('click').on('click',function(){
                        if(agent.onSub!=null){
                            var index=$(this).attr('index'),id=$(this).attr('id');
                            agent.onSub(index,id);
                        }
                        //event && event.stopPropagation && event.stopPropagation();	//阻断list的穿透,会传递到canvas
                    })
                }
                
                //2.form的方式处理,需要等待用户输入
                if(row.form){
                    sel.off('click').on('click',function(){

                        if(agent.onForm!=null){
                            var index=$(this).attr('index'),id=$(this).attr('id');
                            agent.onForm(index,id);
                        }
                        //event && event.stopPropagation && event.stopPropagation();	//阻断list的穿透,会传递到canvas
                    });
                }
                //3.todo方式的处理,不需要等待用户数据
                if(row.todo){
                    sel.off('click').on('click',function(){
                        if(agent.onTodo!=null){
                            var index=$(this).attr('index'),id=$(this).attr('id');
                            agent.onTodo(index,id);
                            hide();
                        }
                        //event && event.stopPropagation && event.stopPropagation();	//阻断list的穿透,会传递到canvas
                    });
                }
                
                //4.需要获取组件数据,但不需要core.todo处理数据
                if(row.direct){
                    sel.off('click').on('click',function(){
                        if(agent.onDirect!=null){
                            var index=$(this).attr('index'),id=$(this).attr('id');
                            agent.onDirect(index,id);
                            hide();
                        }
                        //event.stopPropagation();	//阻断list的穿透,会传递到canvas
                    });
                }
            }
        }
        let setPosition=(pmap:any)=>{selector.css(pmap);}

        let show=()=>{selector.show();}
        let hide=()=>{selector.hide();}
        let clear=()=>{selector.html('')}
        let funs={struct:struct,show:show,hide:hide,setPosition:setPosition,clear:clear}
        return {name:name,map:map,id:id,dom:dom,funs:funs,agent:agent,auto:auto};
    },
    
    list:function(name:string,cfg:any){
        let id=hash();
        let clickEvent='click';
        let map:any={'position':'fixed','text-align':cfg.align||'center','z-index':499,};
        if(!cfg.show)map['display']='none';
        for(let k in cfg.position){
            map[k]=cfg.position[k];
        }
        let title=cfg.title?('<span class="'+cfg.clsTitle+'">'+cfg.title+'</span>'):'';
        let dom='<div  id="'+id+'" '+(cfg.className?('class="'+cfg.className+'"'):'')+'>'+title+'</div>';

        //let vertical=cfg.vertical;
        let selector:any;
       
        let agent:any;
        

        let auto=()=>{
            selector=$('#'+id);
        }

        let struct=(list:any,cfg:any)=>{
            let ids:any={},dom='<ul>';
            for(let i in list){
                let row=list[i],id=hash();
                //console.log('[ui.ts]'+JSON.stringify(row));
                ids[i]=id;
                if(row.type=='icon'){
                    dom+='<li id="'+id+'">'+(row.img?'<img src="'+row.img+'" style="width:'+row.width+'px;height:'+row.height+'px">':row.name)+'</li>';
                }else if(row.type=='button'){
                    dom+='<li><button index="'+i+'"  id="'+id+'" class="'+(row.cls?row.cls:"")+'" auto="'+(row.autoClose?true:false)+'">'+row.name+'</button></li>';
                }
            }
            dom+='</ul>';
            //console.log('[ui.ts]'+dom);

            selector.html(title+dom)
            
            let umap={'margin': '0 auto','list-style': 'none','padding': '0px 0px 0px 0px'};
            let imap={'float': 'left','list-style': 'none'};
            selector.find('ul').css(umap).find('li').css(imap);
            
            for(let i in list){
                let row=list[i];
                if(row.on) $('#'+ids[i]).off(clickEvent).on(clickEvent,row.on);
            }
        }

        let show=()=>{selector.show();}
        let hide=()=>{selector.hide();}

        let funs={struct:struct,show:show,hide:hide}
        return {name:name,map:map,id:id,dom:dom,funs:funs,agent:agent,auto:auto};
    },
        

    form:function(name:string,cfg:any){
        let mid=hash(),cls=hash(),btnSave=hash();
        let dom='<div id="'+mid+'" '+(cfg.className?'class="'+cfg.className+'"':'world_form')+'></div>';
        let map={'position':'fixed','z-index':599,'width':cfg.width};
        let selector:any;
        let agent:any;
        

        let formList:any;
        //let selectData:any;
        let selectRow:any;
        let first=true;			//row是否被第一次按下

        let padNumber=()=>{
            if(first) padClear();
            first=false;			//是否第一次按的状态
            let num=$(this).html();
            if(isFloat(selectRow.html())){
                selectRow.html(selectRow.html()+num);
            }else{
                selectRow.html((first||selectRow.html()==0)?num:(selectRow.html()+num));
            }
        }
        let padPoint=()=>{
            if(first)	padClear();
            first=false;			//是否第一次按的状态
            let num=selectRow.html();
            if(!isFloat(num))selectRow.html(num+'.');
        }
        
        let padRecover=()=>{
            first=true;			//是否第一次按的状态
            for(let k in formList){
                let flist=formList[k];
                if(selectRow.attr('name')==flist.name) $('#'+mid+" #"+flist.name).html(flist.data);
            }
        }
        
        let padClear=()=>{
            selectRow.html(0);
        }

        let inputDom=(cls:string)=>{
            var clsNormal='btn btn-md btn-default ',clsNum='pad_num';
            var btnRecover=hash(),btnDel=hash(),btnClear=hash(),btnPoint=hash();
            var dom='<div class="'+cls+'">'
            dom+='<table>'
            dom+='<tr>'
            dom+='<td><button class="'+clsNormal+clsNum+'">1</button></td>'
            dom+='<td><button class="'+clsNormal+clsNum+'">2</button></td>'
            dom+='<td><button class="'+clsNormal+clsNum+'">3</button></td>'
            dom+='<td><button class="'+clsNormal+'" id="'+btnDel+'" >后退</button></td>'
            dom+='</tr>';
            dom+='<tr>'
            dom+='<td><button class="'+clsNormal+clsNum+'">4</button></td>'
            dom+='<td><button class="'+clsNormal+clsNum+'">5</button></td>'
            dom+='<td><button class="'+clsNormal+clsNum+'">6</button></td>'
            dom+='<td></td>'
            dom+='</tr>';
            dom+='<tr>'
            dom+='<td><button class="'+clsNormal+clsNum+'">7</button></td>'
            dom+='<td><button class="'+clsNormal+clsNum+'">8</button></td>'
            dom+='<td><button class="'+clsNormal+clsNum+'">9</button></td>'
            dom+='<td><button class="'+clsNormal+'" id="'+btnRecover+'" >还原</button></td>'
            dom+='</tr>';
            dom+='<tr>'
            dom+='<td><button class="'+clsNormal+'" id="'+btnClear+'">Clear</button></td>'
            dom+='<td><button class="'+clsNormal+clsNum+'">0</button></td>'
            dom+='<td><button class="'+clsNormal+'" id="'+btnPoint+'">.</button></td>'

            dom+='<td><button id="'+btnSave+'" class="btn btn-md btn-primary">保存</button></td>'
            dom+='</tr>';
            dom+='</table>'
            dom+='</div>';

            let funs:any;				//小键盘数字绑定的操作部分
            funs['#'+btnRecover]=padRecover;
            funs['#'+btnClear]=padClear;
            funs['#'+btnDel]=padDel;
            funs['#'+btnPoint]=padPoint;
            funs['.'+clsNum]=padNumber;
            
            return {dom:dom,funs:funs};
        }
        let padDel=()=>{
            first=false;			//是否第一次按的状态
            let num=selectRow.html();
            if(isFloat(num)){
                selectRow.html(num.substr(0,num.length-1));
            }else{
                let n=parseInt(num);
                if(n<10){
                    selectRow.html(0);
                }else{
                    selectRow.html(num.substr(0,num.length-1));
                }
            }
        }
        
        let isFloat=(num:string)=>{
            let arr=num.split('.');
            return arr.length==1?false:true;
        }
        
        let check=(list:any,id:string)=>{
            //var empty=root.empty
            for(let i in list){
                let row=list[i];
                if(!row.on ) continue;
                for(let ev in row.on) $("#"+id).find('#'+row.name).off(ev).on(ev,row.on[ev]);
            }
        }
        let auto=()=>{
            selector=$('#'+mid);
        }
        let struct=(title:string,list:Array<FormRow>,cfg:any)=>{
            //1.数据填充处理
            let numPad=cfg.keypad?true:false;
            formList=clone(list);
            
            //let offset=selector.offset()
            let id=hash();
            let dom='<table id="'+id+'" class="'+cfg.clsMain+'">';
            for(let i in list){
                let row=list[i];
                if(numPad){
                    dom+='<tr><td>'+row.label+'</td><td>'+basic.keypad(row.name,row.data,row.style,cls)+'</td><td>'+row.unit+'</td></tr>';
                }else{
                    dom+='<tr><td>'+row.label+'</td><td>'+basic[row.type](row.name,row.data,row.style,cls)+'</td><td>'+row.unit+'</td></tr>';
                }
            }
            if(!numPad) dom+='<tr><td colspan="2" style="text-align:right"><button id="'+btnSave+'" class="btn btn-lg btn-primary">save</button></td></tr>';
            dom+='</table>'
            
            //这里进行数字键盘的处理
            let kp:any;
            if(numPad){
                kp=inputDom(cfg.clsKeypad);
                dom+=kp.dom;
            } 
            selector.html(dom)
            
            //2.计算form的位置
            let cmap:any;
            if(cfg.align && cfg.align=='center' && cfg.width){
                //let w=me.core.width*cfg.width,left=me.core.width*(1-cfg.width)*0.5
                let w=375,left=300;
                cmap={width:w+'px',left:left+'px',bottom:cfg.bottom+'px'};
            }else{
                cmap={bottom:cfg.bottom+'px',left:cfg.left+'px'};
            }
            selector.css(cmap);
            if(numPad){	//小键盘的输入处理
                //1.绑定按钮的操作
                for(let kk in kp.funs){
                    $(kk).off('click').on('click',kp.funs[id]);
                }
                //2.绑定选择的操作
                $("."+cls).off('click').on('click',function(){
                    //处理旧的行的数据检测
                    if(selectRow!=null){
                        //console.log(selectRow)
                    }
                    //设置新选择的行
                    //selectData=$(this).html();
                    selectRow=$(this);
                    first=true;			//标示为第一次选择
                    var amap={'background':'#FFCC00'},umap={'background':'#EEEEFE'};
                    $("."+cls).css(umap);
                    $(this).css(amap);
                });
                
                $("."+cls).first().trigger('click');
            }else{
                check(list,id);		//3.处理form的检测绑定
            }
            
            //4.保存按钮数据处理
            $("#"+btnSave).off('click').on('click',()=>{
                if(agent.onSave==null) return false
                let rst:any;
                $("."+cls).each((k,v)=>{
                    let kname=$(v).attr('name');
                    if(kname){
                        if(numPad){
                            rst[kname]=parseFloat($(v).html());
                        }else{
                            rst[kname]=$(v).val();
                        }
                    }
                });
                agent.onSave(rst);

                hide()
                return true;
            })
        }

        let show=()=>{selector.show();}
        let hide=()=>{selector.hide();}
        let funs={struct:struct,hide:hide,show:show}
        return {name:name,map:map,id:mid,dom:dom,auto:auto,funs:funs,agent:agent};        
    },
}

//生成随机key的，这样就少import一次，估计能提升点性能
function hash(n:number=6):string{
    return Math.random().toString(36).substr(n);
}

export{self as UI}