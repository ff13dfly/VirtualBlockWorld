// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//import { BareProps } from '@polkadot/react-components/types';

//import React, { useState } from 'react';
//import styled from 'styled-components';

import React from 'react';

interface Props {
  // type:number;
  // cage:Array<number>;
  // memo:string;
  agent:any,      //调用的agent
  data:any,       //传递的显示数据
}

function App(prop:Props): React.ReactElement<Props> {
  const container='three_cvs_dom';

  const cmap={ width: '900px',height:'600px',background:'#BBBBBB',marginTop:'20px'};
  return (
    <section>
      <div id={container} style={cmap}>3D Render Canvas Container</div>
    </section>
  );
}

export default React.memo(App);