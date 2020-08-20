// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//import { BareProps } from '@polkadot/react-components/types';

//import React, { useState } from 'react';
//import styled from 'styled-components';

import React from 'react';
//import { Button} from '@polkadot/react-components';
import {Form,Button,Row,Col} from 'react-bootstrap';

const self={
  show:()=>{},
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
        <Col>
          <Form.Group>
            <Button 
              variant="primary"
              size="sm"
              onClick={self.show}
            >Preview</Button>{' '}
          </Form.Group>
        </Col>
      </Row>
      <Row>
          <Col lg={6} sm={6}>
          <Form.Group>
            <Button 
              variant="primary"
              size="sm"
              onClick={self.show}
            >Left</Button>{' '}
            </Form.Group>
          </Col>
          <Col lg={6} sm={6}>
            <Form.Group>
            <Button 
              variant="primary"
              size="sm"
              onClick={self.show}
            >Right</Button>{' '}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col lg={6} sm={6}>
          <Form.Group>
            <Button 
              variant="primary"
              size="sm"
              onClick={self.show}
            >Left</Button>{' '}
            </Form.Group>
          </Col>
          <Col lg={6} sm={6}>
            <Form.Group>
            <Button 
              variant="primary"
              size="sm"
              onClick={self.show}
            >Right</Button>{' '}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col lg={6} sm={6}>
          <Form.Group>
            <Button 
              variant="primary"
              size="sm"
              onClick={self.show}
            >Left</Button>{' '}
            </Form.Group>
          </Col>
          <Col lg={6} sm={6}>
            <Form.Group>
            <Button 
              variant="primary"
              size="sm"
              onClick={self.show}
            >Right</Button>{' '}
            </Form.Group>
          </Col>
        </Row>
      <hr/>
    </section>
  );
}

export default React.memo(App);