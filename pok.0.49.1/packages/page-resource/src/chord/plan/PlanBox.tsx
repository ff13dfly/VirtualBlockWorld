// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//import { BareProps } from '@polkadot/react-components/types';

//import React, { useState } from 'react';
//import styled from 'styled-components';

import React from 'react';
//import { Button} from '@polkadot/react-components';
import {Form,Button,Row,Col,ListGroup,ButtonGroup} from 'react-bootstrap';

const self={
  show:()=>{
    console.log('hello button');
  },
}

interface Props {
  // type:number;
  // cage:Array<number>;
  // memo:string;
}

function App(prop:Props): React.ReactElement<Props> {
  return (
    <section>
      <Row>
        <Col lg={6} sm={6}>
          <Form.Group>
            <Button 
              variant="light"
              onClick={self.show}
            >Stop</Button>{' '}
          </Form.Group>
        </Col>
        <Col lg={6} sm={6}>
          <Form.Group>
            <Button 
              variant="light"
              onClick={self.show}
            >Pass</Button>{' '}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col lg={6} sm={6}>
        <ListGroup as="ul">
          <ListGroup.Item as="li" active>Plan 0</ListGroup.Item>
          <ListGroup.Item as="li">Plan 1</ListGroup.Item>
          <ListGroup.Item as="li">Plan 2</ListGroup.Item>
        </ListGroup>
        <ButtonGroup className="xs-6">
          <Button size="sm"> + </Button>
          <Button size="sm"> - </Button>
        </ButtonGroup>
        </Col>
        <Col lg={6} sm={6}>
        <ListGroup as="ul">
          <ListGroup.Item as="li">Plan 0</ListGroup.Item>
          <ListGroup.Item as="li">Plan 1</ListGroup.Item>
          <ListGroup.Item as="li">Plan 2</ListGroup.Item>
        </ListGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group>
            <Button 
              variant="primary"
              onClick={self.show}
            >+ Add </Button>{' '}
            <Button 
              variant="primary"
              onClick={self.show}
            >- Remove </Button>{' '}
          </Form.Group>
        </Col>
      </Row>
    </section>
  );
}

export default React.memo(App);