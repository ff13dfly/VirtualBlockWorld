// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//import { BareProps } from '@polkadot/react-components/types';

//import React, { useState } from 'react';
//import styled from 'styled-components';

import React from 'react';

interface Props {
  data:Array<any>;
  click:any;
  upper:any,
}

const thumb:any={
  'fbx':'static/filetype/fbx.png',
  'dae':'static/filetype/dae.png',
}

function App(prop:Props): React.ReactElement<Props> {
  const Uper=prop.upper;
  //计算出hash对应的路径
  for(let k in prop.data){
    const row=prop.data[k];
    const path=Uper.transPath(row.hash,row.format);
    prop.data[k].path=path+row.hash+'.'+row.format;
  }
  
  return (
    <section>
      <ul>
      {prop.data.map((item:any) => (
          <li key={item.id} style={{ listStyle:'none',marginTop:'15px'}}  onClick={()=>prop.click(item.id)}>
            <table>
              <tbody>
                <tr>
                  <td><img src={thumb[item.format]} width="128" height="128"/></td>
                </tr>
                <tr>
                  <td>
                  <span>ID:{item.id},Block:{item.stamp}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </li>
        ))}
      </ul>
    </section>
  );
}


export default React.memo(App);