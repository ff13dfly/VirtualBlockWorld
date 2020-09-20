// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//import { BareProps } from '@polkadot/react-components/types';

//import React, { useState } from 'react';
//import styled from 'styled-components';

import React from 'react';
//import { Button} from '@polkadot/react-components';
import {Form,Button,Row,Col,ButtonGroup} from 'react-bootstrap';

const self={
  show:()=>{},
}

interface Props {
  // type:number;
  // cage:Array<number>;
  // memo:string;
}


function App(prop:Props): React.ReactElement<Props> {

  const container='thumb_cvs_dom';
  
  const cmap={width: '100%',height:'200px',background:'#BBBBBB'};
  
  return (
    <section>
        <Row>
          <Col>
          <Form.Group>
            <div  id={container} style={cmap}></div>
          </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
          <ButtonGroup className="xs-2">
            <Button size="sm">Left</Button>
            <Button size="sm">Front</Button>
            <Button size="sm">Top</Button>
            <Button size="sm">Right</Button>
            <Button size="sm">Back</Button>
            <Button size="sm">Bottom</Button>
          </ButtonGroup>
          </Col>
        </Row>
      <hr/>
    </section>
  );
}

export default React.memo(App);