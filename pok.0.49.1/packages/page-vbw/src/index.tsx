// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// global app props
import { AppProps as Props } from '@polkadot/react-components/types';

import React, { useState } from 'react';
import Space from './Space';
import Menu from './Add';
import Basic from './Basic';
import Operation from './Operation';
//import Panel from './Panel';

import {Controller} from '../block/controller';

function TemplateApp ({ className }: Props): React.ReactElement<Props> {
  const [accountId] = useState<string | null>(null);
  const [menu, setMenu] = useState([]);     //列表页的数据及设置方法
  const [basic, setBasic] = useState([]);       //一直显示的按钮，如edit
  //const [sid, setSearch] = useState('');     //列表页的数据及设置方法
  const [opt, setOperation] = useState([]);     //列表页的数据及设置方法
  const [adjunct,setAdjunct] = useState('no selected adjunct');  //组件名称等信息
  //const gui=Controller.getGUI();


  const self={
    //edit按钮的实现
    showBasic:()=>{
      const btns:any=[
        {name:'edit',icon:'paper edit',onClick:self.onEdit},
      ]
      setBasic(btns);
    },

    //绑定内部select的agent
    onSelect:(act:any)=>{
      setAdjunct(JSON.stringify(act));
    },

    //基础功能按钮实现
    stopAdd:()=>{
      Controller.addAdjunct('stop');
    },
    importerAdd:()=>{
      Controller.addAdjunct('importer');
    },
    wallAdd:()=>{
      Controller.addAdjunct('wall');
    },
    objRemove:()=>{
      if(Controller.remove()) console.log('ok,removed');
    },
    objCopy:()=>{
      if(Controller.copy())  console.log('ok,copyed');
    },

    //编辑按钮的动作
    onEdit:()=>{
      Controller.edit(self.showPanel,self.hidePanel);
    },
    showPanel:()=>{
      //1.添加新添按钮
      const tmp:any=[
        {name:'stop',icon:'',onClick:self.stopAdd},
        {name:'wall',icon:'',onClick:self.wallAdd},
        {name:'import',icon:'',onClick:self.importerAdd},
      ]
      setMenu(tmp);

      //2.添加基础的copy和remove按钮
      const opts:any=[
        {name:'remove',icon:'paper delete',onClick:self.objRemove},
        {name:'Copy',icon:'paper copy',onClick:self.objCopy},
      ]
      setOperation(opts);
    },
    hidePanel:()=>{
      setMenu([]);
      setOperation([]);
    },

    //快捷编辑绑定的操作
    up:()=>{
      console.log('up');
    },
    down:()=>{
      console.log('down');
    },
    left:()=>{
      console.log('left');
    },
    right:()=>{
      console.log('right');
    },
    face:()=>{
      //console.log('face clicked');
      Controller.face();
    },
  }



  React.useEffect(() => {
    self.showBasic();
    
    const sel = document.getElementById('gui_container');
    if(sel!=null)sel.appendChild(Controller.getGUI());

    Controller.setAgent('onChange',self.onSelect);

  }, []);    //api是获取数据的polkadot接口，传给内部调用；

  return (
    <main className={className}>

      <table>
        <tbody>
          <tr>
            <td>
              <Space accountId={accountId}/>
            </td>
            <td>
              <div style={{height:'650px',paddingTop:'8px'}}>
                <span>{adjunct}</span>
                <div id="gui_container"></div>
                
              </div>
              {/* <Panel 
                up={self.up}
                down={self.down}
                left={self.left}
                right={self.right}
                face={self.face}
              /> */}
            </td>
          </tr>
          <tr>
            <td>
              <table style={{width:'100%'}}>
                <tbody>
                  <tr>
                    <td>
                      <table style={{width:'100%'}}>
                        <tbody>
                          <tr>
                            <td>
                            <Menu list={menu}/>
                            </td>
                            <td style={{float:'right'}}>
                              <Operation list={opt}/>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td style={{float:'right'}}>
                      <Basic list={basic}/>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td>
            </td>
          </tr>
          <tr>
            <td>
            </td>
            <td>

            </td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}

export default React.memo(TemplateApp);
