// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//import { BareProps } from '@polkadot/react-components/types';

//import React, { useState } from 'react';
//import styled from 'styled-components';

import React from 'react';
import {useApi} from '@polkadot/react-hooks';
//import { useApi,useAccounts} from '@polkadot/react-hooks';

import {drawing} from '../block/entry';

interface Props {
  accountId?: string | null;
}

function Space ({ accountId }: Props): React.ReactElement<Props> {
  const container="three_con";
  const {api} = useApi();
  
  //这里替代componentdidmounted
  React.useEffect(() => {
    drawing(container,api,accountId);
    return () => {}; //return部分代替componentUnmount
  }, [api]);    //api是获取数据的polkadot接口，传给内部调用；

  //const cmap={ width: '100%', height: '600px',background:'#888'};
  const cmap={ width: '100%',marginTop:'20px'};
  return (
    <section>
      <div id={container} style={cmap}> Loading </div>
    </section>
  );
}

export default React.memo(Space);