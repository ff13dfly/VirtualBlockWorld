// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//import { BareProps } from '@polkadot/react-components/types';

//import React, { useState } from 'react';
//import styled from 'styled-components';

import React from 'react';
import { Button} from '@polkadot/react-components';

const self={
  show:()=>{},
}

interface Props {
  // type:number;
  // cage:Array<number>;
  // memo:string;
}


function App(prop:Props): React.ReactElement<Props> {

  const container='thumb_cvs_dom';
  
  const cmap={width: '200px',height:'200px',background:'#BBBBBB'};
  const tmap={width: '100%'};
  
  return (
    <section>
      <div  id={container} style={cmap}></div>
      <table style={tmap} >
        <tbody>
        <tr>
          <td>
            <Button
                label='L'
                onClick={self.show}
                tooltip='左侧面数据'
            />
          </td>
          <td>
            <Button
                label='F'
                onClick={self.show}
                tooltip='右侧面数据'
            />
          </td>
          <td>
            <Button
                label='T'
                onClick={self.show}
                tooltip='右侧面数据'
            />
          </td>
        </tr>
        <tr>
          <td>
            <Button
                label='R'
                onClick={self.show}
                tooltip='底侧面数据'
            />
          </td>
          <td>
            <Button
                label='B'
                onClick={self.show}
                tooltip='底侧面数据'
            />
          </td>
          <td>
            <Button
                label='M'
                onClick={self.show}
                tooltip='底侧面数据'
            />
          </td>
        </tr>
        </tbody>
      </table>
      <hr/>
    </section>
  );
}

export default React.memo(App);