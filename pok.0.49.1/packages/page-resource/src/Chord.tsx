// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//import { BareProps } from '@polkadot/react-components/types';

import React from 'react';

import Basic from './chord/basic';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button,Form} from 'react-bootstrap';

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
      <Form.Group>
      <Form.Control size="lg" type="text" placeholder="Large text" />
      <br />
      <Form.Control type="text" placeholder="Normal text" />
      <br />
      <Form.Control size="sm" type="text" placeholder="Small text" />
    </Form.Group>
      <Button variant="primary">Primary</Button>{' '}
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