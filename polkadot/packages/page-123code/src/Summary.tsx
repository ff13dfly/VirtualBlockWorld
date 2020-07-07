// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';

import React from 'react';
import styled from 'styled-components';

import { useApi } from '@polkadot/react-hooks';

interface Props extends BareProps {
  children: React.ReactNode;
}



//将字符串转换成vec<u8>的操作
function encode(str:string){
  //return 0xbb33ddaa;
  return [123,22,33,44,55,66];
}


//将vec<u8>转换成字符串
function decode(hexString:string){
  var trimedStr = hexString.trim();
  var rawStr =trimedStr.substr(0,2).toLowerCase() === "0x"? trimedStr.substr(2):trimedStr;
  var len = rawStr.length;
  if(len % 2 !== 0)return false;
  var curCharCode;
  var resultStr = [];
  for(var i = 0; i < len;i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
    resultStr.push(String.fromCharCode(curCharCode));
  }
  return resultStr.join("");
}

function Summary ({ children, className, style }: Props): React.ReactElement<Props> {

  //1.解析数据的demo，通过storage的方法获取数据
  console.log("ready to say hello world");
  const { api} = useApi();
  api.query.vBlock.blockMap([0,101,124],(res)=>{
    var vv=JSON.parse(JSON.stringify(res));
    console.log(decode(vv.raw));
  });
  console.log("--------------end-----------------");
  //2.执行方法，调用自定义module里的方法
  // const king="5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y";
  // const owner="5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc";
  // api.tx.vBlock.worldInit(king).signAndSend(owner, (result) => {
  //   console.log(`Current status is ${result.status}`);
  //   if (result.status.isInBlock) {
  //     console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
  //   } else if (result.status.isFinalized) {
  //     console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
  //     //unsub();
  //   }
  // });

  //3.更行数据测试，更行到vec<u8>数据
  const x=100;
  const y=124;
  const world=0;
  const jj={"aa":333};
  const data=encode(JSON.stringify(jj));
  const owner="5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y";
  console.log(`ready to write data  world:${world}[${x},${y}],data:${data}`);
  api.tx.vBlock.blockUpdate(x,y,world,data).signAndSend(owner, (result) => {
    console.log(`Current status is ${result.status}`);
    if (result.status.isInBlock) {
      console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
    } else if (result.status.isFinalized) {
      console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
    }
  });


  return (
    <div
      className={className}
      style={style}
    >
      {children}
    </div>
  );
}

export default React.memo(styled(Summary)`
  opacity: 0.5;
  padding: 1rem 1.5rem;
`);
