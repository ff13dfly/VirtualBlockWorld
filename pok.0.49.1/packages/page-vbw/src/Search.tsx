// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//import { BareProps } from '@polkadot/react-components/types';

//import React, { useState } from 'react';
//import styled from 'styled-components';

import React from 'react';

interface Props {
  id:number,
}

function Basic (prop: Props): React.ReactElement<Props> {
  return (
    <section>
      <input type="number" value={prop.id}/>

    </section>
  );
}


export default React.memo(Basic);