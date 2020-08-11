// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//import { BareProps } from '@polkadot/react-components/types';

//import React, { useState } from 'react';
//import styled from 'styled-components';

import React from 'react';
import { Button } from '@polkadot/react-components';

interface btnOpt{
  onClick:void;
}

interface Props {
  list:Array<btnOpt>,
}

function Menu (prop: Props): React.ReactElement<Props> {
  return (
    <section>
      <ul style={{margin:'0 auto',paddingLeft:'0px'}}>
      {prop.list.map((item:any) => (
        <li key={item.name} style={{listStyle:'none',margin:'0 auto',float:'left'}}>
          <Button
            //icon={item.icon}
            label={item.name}
            onClick={item.onClick}
            //size = 'small'
          />
        </li>
      ))}
      </ul>
      
    </section>
  );
}


export default React.memo(Menu);