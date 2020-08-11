// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//import { BareProps } from '@polkadot/react-components/types';

//import React, { useState } from 'react';
//import styled from 'styled-components';

import React from 'react';

import {useApi} from '@polkadot/react-hooks';
import {Module} from './module';

interface Props {
  accountId?: string | null;
}

function App(): React.ReactElement<Props> {
  const id='modulePreview';
  const {api} = useApi();
  
  React.useEffect(() => {
    Module.init(id);
  }, [api]);

  return (
    <section style={{ width: '100%'}} id={id}></section>
  );
}


export default React.memo(App);