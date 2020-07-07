// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';

export type LinkTypes = 'address' | 'block' | 'council' | 'extrinsic' | 'proposal' | 'referendum' | 'techcomm' | 'treasury';

export interface ExternalDef {
  isActive: boolean;
  chains: Record<string, string>;
  paths: Partial<Record<LinkTypes, string>>;
  create: (chain: string, path: string, data: BN | number | string, hash?: string) => string;
}
