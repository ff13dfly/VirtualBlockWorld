// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/*
*解释器说明
*1.解释器用来实现对数据的基础解析，3D格式化，输出，编辑修改等操作
*2.解释器数据带version信息，自动实现转换
*/

import {earth}    from './basic/earth';
import {stop}     from './basic/stop';
import {trigger}  from './basic/trigger';

import {wall}     from './extention/wall';
import {importer}     from './extention/importer';
import {lattice}  from './extention/lattice';

const self:any={
    //基础组件，基本环境构建
    stop  : stop,
    earth : earth,
    trigger:trigger,

    //扩展组件部分，用于实现不通的3D效果
    wall:wall,
    importer:importer,
    lattice:lattice,
};


const cat:any={
    mother:'earth',
}

export { self as Preter,cat};