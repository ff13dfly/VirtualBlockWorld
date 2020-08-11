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
}

function App(prop:Props): React.ReactElement<Props> {
  return (
    <section>
      <table>
        <tr>
          <td></td>
          <td><button>close</button></td>
          <td></td>
        </tr>
        <tr>
          <td><button>close</button></td>
          <td></td>
          <td><button>close</button></td>
        </tr>
        <tr>
          <td></td>
          <td><button>close</button></td>
          <td></td>
        </tr>
      </table>
    </section>
  );
}

export default React.memo(App);