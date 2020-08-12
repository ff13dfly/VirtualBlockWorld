// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//import { BareProps } from '@polkadot/react-components/types';

//import React, { useState } from 'react';
//import styled from 'styled-components';

import { Input,Button/*Dropdown*/ } from '@polkadot/react-components';
import React, { useEffect, useState }from 'react';

import Plane from './BasicPlane';
import Box from './BasicBox';
import Roof from './BasicRoof';


const CHORD_PLANE=1;
const CHORD_BOX=2;
const CHORD_ROOF=3;

interface Props {
  type:number;
  cage:Array<number>;
  memo:string;
  raw:any;            //数据部分
}

function App(prop:Props): React.ReactElement<Props> {
  console.log(prop);
  const self={
    blur:()=>{
      console.log('basic input blur');
    },
    save:()=>{
      console.log('ready to save data to substrate chain');
    },
  }

  const [isRunning,setRun]=useState(false);

  let control=(<Plane />);
  let type=CHORD_PLANE;
  switch (prop.type) {
    case CHORD_PLANE:
      control= (<Plane />);
      type=CHORD_PLANE;
      break;

    case CHORD_BOX:
      control= (<Box />);
      type=CHORD_BOX;
       break;

    case CHORD_ROOF:
      control= (<Roof />);
      type=CHORD_ROOF;
      break;

    default:
      break;
  }

  React.useEffect(() => {
    
  }, []);
  
  const tmap={width:'100%'};
  return (
    <section>
      <h4>chord basic param</h4>
      <table style={tmap}>
        <tbody>
        <tr>
          <td>
            <Input
              autoFocus
              className='medium'
              help=''
              isDisabled = {isRunning}
              //isError={!isMatchValid}
              label='type of chord'
              //onChange={_onChangeMatch}
              //onEnter={_toggleStart}
              value={prop.type}
            />
          </td>
          <td>
            <Input
              label={'memo'}
              onBlur={self.blur}
              value={prop.memo}
            />
          </td>
          <td>
            <Input
              label={'size of chord'}
              onBlur={self.blur}
              value={JSON.stringify(prop.cage)}
            />
          </td>
          <td>
            <Button
              label='save chord'
              onClick={self.save}
              tooltip='底侧面数据'
            />
          </td>
        </tr>
        </tbody>
      </table>
      
      {control}
    </section>
  );
}

export default React.memo(App);