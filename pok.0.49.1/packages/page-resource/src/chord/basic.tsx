// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//import { BareProps } from '@polkadot/react-components/types';

//import React, { useState } from 'react';
//import styled from 'styled-components';

//import { Input} from '@polkadot/react-components';
import React, {useState }from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Button,Form,Container,Row,Col} from 'react-bootstrap';

import Plane from './BasicPlane';
import Box from './BasicBox';
import Roof from './BasicRoof';


const CHORD_PLANE=1;
const CHORD_BOX=2;
const CHORD_ROOF=3;

interface Props {
  type:number;
  cage:Array<number>;
  memo:string;
  raw:any;            //数据部分
}

function App(prop:Props): React.ReactElement<Props> {
  //console.log(prop);
  const self={
    blur:()=>{
      console.log('basic input blur');
    },
    save:()=>{
      console.log('ready to save data to substrate chain');
    },
  }

  const [isRunning,setRun]=useState(false);

  let control=(<Plane />);
  let type=CHORD_PLANE;
  switch (prop.type) {
    case CHORD_PLANE:
      control= (<Plane />);
      type=CHORD_PLANE;
      break;

    case CHORD_BOX:
      control= (<Box />);
      type=CHORD_BOX;
       break;

    case CHORD_ROOF:
      control= (<Roof />);
      type=CHORD_ROOF;
      break;

    default:
      break;
  }

  React.useEffect(() => {
    console.log(prop);
  }, []);

  return (
    <section>
      <Container>
        <Row>
          <Col lg={2}>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>弦粒子类型</Form.Label>
              <Form.Control as="select">
                <option value="1">平面型</option>
                <option value="2">盒子型</option>
                <option value="3">屋顶型</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col lg={3}>
            <Form.Group>
              <Form.Label>尺寸</Form.Label>
              <Form.Control type="text" placeholder="Normal text" value={prop.cage}/>
            </Form.Group>
          </Col>
          <Col lg={3}>
            <Form.Group>
              <Form.Label>说明</Form.Label>
              <Form.Control type="text" placeholder="Normal text" value={prop.memo}/>
            </Form.Group>
          </Col>
          <Col lg={3}>
            <Form.Group>
              <Form.Label>说明</Form.Label>
              <Form.Control type="text" placeholder="Normal text" value={prop.raw}/>
            </Form.Group>
          </Col>
          <Col lg={1}>
          <Form.Group>
            <Form.Label>保存弦粒子</Form.Label>
            <Button variant="primary"
            onClick={self.show}
            >Save</Button>{' '}
          </Form.Group>
          </Col>
        </Row>
      </Container>
      {control}
    </section>
  );
}

export default React.memo(App);