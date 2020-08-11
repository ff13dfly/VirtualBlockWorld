// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//import { BareProps } from '@polkadot/react-components/types';

//import React, { useState } from 'react';
//import styled from 'styled-components';

import { Input,/*Dropdown*/ } from '@polkadot/react-components';
import React from 'react';

import Plane from './BasicPlane';
import Box from './BasicBox';
import Roof from './BasicRoof';



const CHORD_PLANE=1;
const CHORD_BOX=2;
const CHORD_ROOF=3;

let types=[
  
]

const self={
  blur:(e:any)=>{
    //console.log(e);
    console.log('basic input blur');
  }
}

interface Props {
  type:number;
  cage:Array<number>;
  memo:string;
}

function App(prop:Props): React.ReactElement<Props> {
  console.log(prop);
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

  const tmap={width:'100%'};
  //<Dropdown
  //defaultValue={types}
  //label='type of chord'
  //onChange={self.blur}
  ///>
  return (
    <section>
      <h4>chord basic param</h4>
      <table style={tmap}>
        <tr>
          <td>
            <Input
              label={'type of chord'}
              onChange={self.blur}
              value={prop.type}
            />
          </td>
          <td>
            <Input
              label={'memo'}
              onChange={self.blur}
              value={prop.memo}
            />
          </td>
          <td>
            <Input
              label={'size of chord'}
              onChange={self.blur}
              value={prop.cage}
            />
          </td>
        </tr>
      </table>
      
      {control}
    </section>
  );
}

export default React.memo(App);