// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//import { BareProps } from '@polkadot/react-components/types';

//import React, { useState } from 'react';
//import styled from 'styled-components';

import React,{useState} from 'react';

import {useApi} from '@polkadot/react-hooks';
import {tools} from './common/tools';
import {Uper} from './common/upload';
import { Run } from './common/runtime';

const thumb:any={
  'fbx':'static/filetype/fbx.png',
  'dae':'static/filetype/dae.png',
}

interface Props{}


function Summary (): React.ReactElement<Props> {
  const {api} = useApi();
  const [max,setMax]=useState(0);
  const [list,setList]=useState([]);

  const self={
    format:(row:any)=>{
      const tail=tools.shorter;
      const format=row.format,hash=row.hash;
      if(format==null) return null;
      const path=Uper.transPath(hash,format);
      
      let target:string;
      if(thumb[format]){
        target=thumb[format]
      }else{
        target=path+hash+'.'+format;
      }
      return {
        id:row.id,
        format:format,
        hash:tail(hash),
        block:row.stamp,
        status:row.status,
        owner:tail(row.owner),
        src:target,
      };
    },
    show:()=>{
      const step=20;
      let now:any=[];
      
      api.isReady.then(()=>{
        api.query.vbw.sourceCount((obj:any)=>{
          const start=parseInt(obj.words[0])-1;
          setMax(start);
          if(start<1) return setList([]);
          let ids:Array<number>=[];
          for(let i=0;i<step;i++){
            const id=start-i;
            if(id < 1) break;
            ids.push(id);
          }

          const format=self.format;
          for(let k in ids){
            const id=ids[k];
            if(Run.exist(id)){
              const row=Run.get(id);
              now.push(format(row))
              if(now.length==ids.length)setList(now);
            }else{
              Run.sync(id,()=>{
                const row=Run.get(id);
                now.push(format(row))
                if(now.length==ids.length)setList(now);
              });
            }
          }
        });
      });
    },
  }

  React.useEffect(() => {
    self.show();
  },[]);

  const pmap={margin:'0 auto'};
  return (
    <section style={{width:'100%'}}>
      共有{max}个资源
      <ul>
      {list.map((item:any) => (
          <li key={item.id} style={{ width: '25%',marginTop:'5px',listStyle:'none',float:'left'}}>
            <img src={item.src} width="256" height="256"/>
            <p style={pmap}>ID:{item.id},Block:{item.block},Format:{item.format}</p>
            <p style={pmap}>Hash:{item.hash}</p>
            <p style={pmap}>Owner:{item.owner}</p>
          </li>
        ))}
        </ul>
    </section>
  );
}

export default React.memo(Summary);