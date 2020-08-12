// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//import { BareProps } from '@polkadot/react-components/types';

//import React, { useState } from 'react';
//import styled from 'styled-components';

import React from 'react';
import Render from './chordPreview';

import Thumb from './thumb/ThumbBox';
import Panel from './panel/PanelBox';
import Plan from './plan/PlanBox';
import Item from './item';

interface Props {
  // type:number;
  // cage:Array<number>;
  // memo:string;
}

function App(prop:Props): React.ReactElement<Props> {
  //const Uper=prop.upper;
  //计算出hash对应的路径
  // for(let k in prop.data){
  //   const row=prop.data[k];
  //   const path=Uper.transPath(row.hash,row.format);
  //   prop.data[k].path=path+row.hash+'.'+row.format;
  // }

  const agent={}
  const data={}

  return (
    <section>
      <table>
        <tbody>
        <tr>
          <td>
            <Render agent={agent} data={data}/>
            <table>
              <tr>
                <td>
                  <Item />
                </td>
                <td></td>
              </tr>
            </table>
          </td>
          <td>
            <Thumb />
            <Panel />
            <Plan />
          </td>
        </tr>
        </tbody>
      </table>
      
    </section>
  );
}

export default React.memo(App);