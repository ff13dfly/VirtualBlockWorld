// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// global app props
import { AppProps as Props } from '@polkadot/react-components/types';
import React,{ useMemo } from 'react';
import { Route, Switch } from 'react-router';
import Tabs from '@polkadot/react-components/Tabs';
import {useApi} from '@polkadot/react-hooks';

import Summary from './Summary';
import Texture from './Texture';
import Module from './Module';
import Pano from './Pano';
import Chord from './Chord';
import {Run} from './common/runtime';

function ResourceApp ({basePath,className}: Props): React.ReactElement<Props> {
  const {api} = useApi();
  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'summary',
      text: '资源预览'
    },
    {
      name: 'texture',
      text: '贴图资源'
    },
    {
      name: 'module',
      text: '模型资源'
    },
    {
      name: 'pano',
      text: '全景天空'
    },
    {
      name: 'chord',
      text: '弦粒子'
    }
  ], []);

  React.useEffect(() => {
    Run.init();
    Run.setAPI(api);
  }, [api]);

  return (
    <main className={className}>
      <header>
        <Tabs
          basePath={basePath}
          items={items}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/summary`}><Summary/></Route>
        <Route path={`${basePath}/texture`}><Texture /></Route>
        <Route path={`${basePath}/module`}><Module /></Route>
        <Route path={`${basePath}/pano`}><Pano /></Route>
        {<Route path={`${basePath}/chord`}><Chord /></Route>}
        <Route>
          <Summary />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(ResourceApp);
