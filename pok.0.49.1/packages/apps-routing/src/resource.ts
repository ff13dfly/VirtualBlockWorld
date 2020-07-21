// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.


import { Route } from './types';

import Component from '@polkadot/app-resource';

export default function create (t: <T = string> (key: string, text: string, options: { ns: string }) => T): Route {
  return {
    Component,
    display: {
      isHidden: false,
      needsAccounts: false,
      needsApi: [
        'tx.balances.transfer'
      ]
    },
    icon: 'th',
    name: 'Resource',
    //text: t<string>('nav.123-code', 'Template', { ns: 'apps-routing' })
    text: t<string>('nav.123-code', 'Template', { ns: 'apps-routing' })
  };
}
