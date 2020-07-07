// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//import { BareProps } from '@polkadot/react-components/types';

//import React, { useState } from 'react';
//import styled from 'styled-components';

import React from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css'


interface Props {
  cropper:any;
}

function PreviewTexture (prop:Props): React.ReactElement<Props> {
  const thumb='source/timg.jpg'
  return (
    <section>
      <Cropper
        ref={prop.cropper}
        src={thumb}
        style={{height:720, width:960}}
        aspectRatio={1/1}
        guides={false}
        />
    </section>
  );
}

export default React.memo(PreviewTexture);