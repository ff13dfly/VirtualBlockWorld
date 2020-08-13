// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {Pano} from './pano';

interface Props {

}

function App(prop:Props): React.ReactElement<Props> {
  const id='panoPreview';
  
  //这里替代componentdidmounted
  React.useEffect(() => {
    Pano.init(id);
  }, []);    //api是获取数据的polkadot接口，传给内部调用；

  return (
    <section style={{ width: '100%'}} id={id}></section>
  );
}

export default React.memo(App);