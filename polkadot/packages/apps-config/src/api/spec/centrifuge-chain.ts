// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// structs need to be in order
/* eslint-disable sort-keys */

export default {
  // chain-specific
  AnchorData: {
    id: 'H256',
    docRoot: 'H256',
    anchoredBlock: 'u64'
  },
  Fee: {
    key: 'Hash',
    price: 'Balance'
  },
  PreCommitData: {
    signingRoot: 'H256',
    identity: 'H256',
    expirationBlock: 'u64'
  },
  Proof: {
    leafHash: 'H256',
    sortedHashes: 'H256'
  },
  // Overwrites to Substrate types
  Address: 'AccountId',
  LookupSource: 'AccountId',
  // previous substrate versions
  ReferendumInfo: 'ReferendumInfoTo239',
  StakingLedger: 'StakingLedgerTo240',

  Basic: {
    raw: "Vec<u8>",
    status: "u32",
    stamp: "BlockNumber",
    owner: "AccountId",
    tenant: "AccountId"
  },

  World: {
      start: "BlockNumber",
      xcount: "u32",
      ycount: "u32",
      status: "u32",
      king: "AccountId",
      setting: "Setting"
  },
  Setting: {
      elevation: "u32"
  }
};
