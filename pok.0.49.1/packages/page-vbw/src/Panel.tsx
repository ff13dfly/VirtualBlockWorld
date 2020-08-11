// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//import { BareProps } from '@polkadot/react-components/types';

//import React, { useState } from 'react';
//import styled from 'styled-components';

import React from 'react';
import { Button } from '@polkadot/react-components';

interface Props {
  up:any;
  down:any;
  left:any;
  right:any;
  face:any;
}

function Panel (props: Props): React.ReactElement<Props> {
  return (
    <table>
      <tbody>
        <tr>
          <td> 
            <Button
              //icon='paper'
              label='up'
              onClick={props.up}
              size='small'
            />
          </td>
        </tr>
        <tr>
          <td> 
            <Button
              //icon='paper'
              label='left'
              onClick={props.left}
              size='small'
            />
          </td>
          <td> 
            <Button
              //icon='paper'
              label='right'
              onClick={props.right}
              size='small'
            />
          </td>
        </tr>
        <tr>
          <td> 
            <Button
              //icon='paper'
              label='down'
              onClick={props.down}
              size='small'
            />
          </td>
        </tr>
        <tr>
          <td> 
            <Button
              //icon='paper'
              label='face'
              onClick={props.face}
              size='small'
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
}


export default React.memo(Panel);