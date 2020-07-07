// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//import { BareProps } from '@polkadot/react-components/types';

//import React, { useState } from 'react';
//import styled from 'styled-components';

import React from 'react';
import { Button } from '@polkadot/react-components';

interface btnAdd{
  onClick:void;
}

interface Props {
  list:Array<btnAdd>,
}

function Menu (prop: Props): React.ReactElement<Props> {
  return (
    <section>
      <ul style={{margin:'0 auto',paddingLeft:'0px'}}>
      {prop.list.map((item:any) => (
        <li key={item.name} style={{listStyle:'none',margin:'0 auto',float:'left'}}>
          <Button
            icon={item.icon}
            label={item.name}
            onClick={item.onClick}
            size='small'
          />
        </li>
      ))}
      </ul>
      
    </section>
  );
}


export default React.memo(Menu);