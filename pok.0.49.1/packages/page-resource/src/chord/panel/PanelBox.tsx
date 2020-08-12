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
  return (
    <section>
      <table>
        <tbody>
        <tr>
          <td>
            <Button
                label='Preview'
                onClick={self.show}
                tooltip='预览整个弦粒子'
            />
          </td>
        </tr>
        <tr>
          <td>
            <Button
                label='Left'
                onClick={self.show}
                tooltip='左侧面数据'
            />
          </td>
          <td>
            <Button
                label='Right'
                onClick={self.show}
                tooltip='右侧面数据'
            />
          </td>
        </tr>
        <tr>
          <td>
            <Button
                label='Front'
                onClick={self.show}
                tooltip='前侧面数据'
            />
          </td>
          <td>
            <Button
                label='Back'
                onClick={self.show}
                tooltip='后侧面数据'
            />
          </td>
        </tr>
        <tr>
          <td>
            <Button
                label='Top'
                onClick={self.show}
                tooltip='顶侧面数据'
            />
          </td>
          <td>
            <Button
                label='Bottom'
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