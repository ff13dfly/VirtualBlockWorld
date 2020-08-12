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
            <h4>Close</h4>
            <table>
              <tbody>
              <tr>
                <td>
                <Button
                  label='Plan 0'
                  onClick={self.show}
                  tooltip='左侧面数据'
                />
                </td>
              </tr>
              <tr>
                <td>
                <Button
                  label='Plan 1'
                  onClick={self.show}
                  tooltip='左侧面数据'
                />
                </td>
              </tr>
              </tbody>
            </table>
          </td>
          <td>
            <h4>Pass</h4>
            <table>
              <tbody>
              <tr>
                <td>
                <Button
                  label='Plan 0'
                  onClick={self.show}
                  tooltip='左侧面数据'
                />
                </td>
              </tr>
              <tr>
                <td>
                <Button
                  label='Plan 1'
                  onClick={self.show}
                  tooltip='左侧面数据'
                />
                </td>
              </tr>
              <tr>
                <td>
                <Button
                  label='Plan 2'
                  onClick={self.show}
                  tooltip='左侧面数据'
                />
                </td>
              </tr>
              </tbody>
            </table>
          </td>
        </tr>
        </tbody>
      </table>
      <table>
        <tbody>
        <tr>
          <td>
            <Button
            label='- Remove'
            onClick={self.show}
            tooltip='左侧面数据'
          />
          </td>
          <td>
            <Button
            label='+ Add'
            onClick={self.show}
            tooltip='左侧面数据'
          />
          </td>
        </tr>
        </tbody>
      </table>
    </section>
  );
}

export default React.memo(App);