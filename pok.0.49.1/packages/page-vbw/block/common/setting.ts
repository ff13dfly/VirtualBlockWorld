// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//module的hooks名称
const Hooks={
    format:	'format',		    //组件格式化数据的函数名,在这个函数里做计量单位转换
    save:   'save',                //组件数据保存的方法proceeded -> origin
    check:	'checkData',	    //对元素数据的数据位和类型进行校正
    adsorb:	'adsorbPoints',	    //组件提供的吸附点信息
    animat:	'animat',		    //动画实现的入口
    update:	'yunData',		    //格式化同步数据的入口
    active:	'active',		    //高亮显示的数据转换入口
    info:	'info',			    //高亮显示的数据转换入口
    three:  'threeTransform',   //3D数据构建的入口
    editMenu:'guiData',          //module的编辑菜单
    new:     'new',             //新添的数据接口
}

//block的数据挂载节点名称，通过这种方式，防止直接修改数据的行为
const Keys={				    //直接挂载在Block根上的节点
    byteKey:        hash(),     //byte形式保存的原始数据
    originKey:		hash(),		//原始数据
    basicKey:		hash(),		//基础信息
    moreKey:		hash(),		//更多配置的默认键值
    limitKey:		hash(),		//limit保存的位置
    processedKey:	hash(),		//统一挂载处理过数据的位置
    textureKey:		hash(),		//image资源下挂载生成texture的位置
    moduleKey:		hash(),		//module缓存的部分
}

//!!!未使用，可去除
//共享用的队列数据
const Queue={
    source:        hash(),     //获取资源的共享队列
}

//player的运动能力
const Capacity={
    move:0.03,				//每次移动的距离m，测试时候用的0.03
	rotate:0.05,			//头部旋转的的速度
    span:0.31,				//走过的高差
	squat:0.1,				//蹲下的高度
	jump:1,					//跳过的高差
	death:3,				//死亡坠落高度
	speed:1.5,				//移动速度，m/s，测试时候用1.5
	strength:1,				//蓄力，用于跳跃
}

/*********公用状态部分，后面需要调整**********/
let Lockers={				//防止重复请求的锁
    module:false,			//模型获取的锁
    texture:false,			//材质获取的锁
    font:false,				//字体获取的锁
    block:false,			//块资源获取的锁
    task:false,				//时钟任务锁
    repeat:false,		    //重复任务锁
}

const World={					//世界的基本信息
    //num:0,					//世界编号
    side:16,				//土地的边长(m)
    xMax:2048,				//土地X轴的最大编号
    yMax:2048,				//土地Y轴的最大编号
}

//其他配置部分，例如选中的活动变量等
let More={
    active:{},
    convert:1000,
}

//生成随机key的，这样就少import一次，估计能提升点性能
function hash(n:number=6):string{
    return Math.random().toString(36).substr(n);
}

function autoConfig(){
    const cvt=More.convert;
    Capacity.move*=cvt;
    Capacity.span*=cvt;
    Capacity.squat*=cvt;
    Capacity.jump*=cvt;
    Capacity.death*=cvt;
}

export{Hooks,Keys,Queue,Capacity,World,More,Lockers,autoConfig}