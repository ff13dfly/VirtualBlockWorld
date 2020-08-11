// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//import { BareProps } from '@polkadot/react-components/types';

//import React, { useState } from 'react';
//import styled from 'styled-components';

import React from 'react';

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
}

function App(prop:Props): React.ReactElement<Props> {
  let control=(<Plane />);
  switch (prop.type) {
    case CHORD_PLANE:
      control= (<Plane />);
      break;

    case CHORD_BOX:
      control= (<Box />);
       break;

    case CHORD_ROOF:
      control= (<Roof />);
      break;

    default:
      break;
  }


  
  return (
    <section>
      <input type="text" value={prop.type}/>
      <input type="text" value={prop.memo}/>
      {control}
    </section>
  );
}

export default React.memo(App);