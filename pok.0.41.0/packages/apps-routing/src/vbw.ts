// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Template from '@polkadot/app-vbw';

const route: Route = {
  Component: Template,
  display: {
    isHidden: false,
    needsAccounts: false,
    // needsApi: [
    //   'tx.balances.transfer'
    // ]
  },
  i18n: {
    defaultValue: '虚块世界'
  },
  icon: 'th',
  name: 'VBW'
};

export default route;
