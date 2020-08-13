// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//import { BareProps } from '@polkadot/react-components/types';

//import React, { useState } from 'react';
//import styled from 'styled-components';

import React from 'react';

interface Props {
  preview: any;
}

function App (prop:Props): React.ReactElement<Props> {
  const self={
    change:(ev:any)=>{
      if(!ev.target || !ev.target.files || !ev.target.files[0]) return false;
      prop.preview(ev.target.files[0]);
      return true;
    },
  }
  return (
    <section style={{ width: '100%',marginTop:'0px'}}>
      <label>选择模型文件[]</label>
      <input type="file" accept=".zip,.fbx" onChange={self.change}/>
    </section>
  );
}


export default React.memo(App);