// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//import { BareProps } from '@polkadot/react-components/types';

import React from 'react';
//import styled from 'styled-components';


//import {useApi} from '@polkadot/react-hooks';
interface Props {
  accountId?: string | null;
}

function Chord (props:Props): React.ReactElement<Props> {

  //const {api} = useApi();
  //const [list, setData] = useState([]);     //列表页的数据及设置方法
  //const [info, setInfo] = useState('');     //出错信息

  React.useEffect(() => {
  }, []);

  //const tmap={width:'100%'},smap={'marginTop':'5px','marginBottom':'15px','fontSize':'16px'}
  return (
    <section>
      edit chord here...
    </section>
  );
}
export default React.memo(Chord);