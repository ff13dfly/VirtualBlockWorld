// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//import { BareProps } from '@polkadot/react-components/types';

import React from 'react';

import Basic from './chord/basic';


//import {useApi} from '@polkadot/react-hooks';
interface Props {
  accountId?: string | null;
}

function Chord (props:Props): React.ReactElement<Props> {
  const type=2;
  const cage=[4,4,5];
  const memo='';
  const raw={stop:[],pass:[],cornor:[]};

  //const [type, setType] = useState(true);

  React.useEffect(() => {
    
  }, []);

  return (
    <section>
      <Basic 
        type={type}
        cage={cage}
        memo={memo}
        raw={raw}
      />
    </section>
  );
}
export default React.memo(Chord);