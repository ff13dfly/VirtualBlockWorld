// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//import { BareProps } from '@polkadot/react-components/types';

//import React, { useState } from 'react';
//import styled from 'styled-components';

import React,{useState}from 'react';
import { Button } from '@polkadot/react-components';

import {useApi} from '@polkadot/react-hooks';

import {Uper} from './common/upload';
import {tools} from './common/tools';
import {Run} from './common/runtime';

import Preview from './module/ModulePreview';
import Inputer from './module/ModuleUploader';
import List from './module/ModuleList';
import {Module} from './module/module';

const config:any={
  page:4,
  format:{
    'fbx':true,
    'dae':true,
  },
}


interface Props {
  accountId?: string | null;
}

function App (): React.ReactElement<Props> {

  const {api} = useApi();
  const [list, setData] = useState([]);     //列表页的数据及设置方法
  const [info, setInfo] = useState('');     //出错信息

  let moduleFile:any=null;
  const self={
    fresh:(file:File)=>{

      const suffix=Uper.getSuffix(file.name);
      if(!suffix) return false;

      if(suffix=='zip'){
        Uper.folder(file,(fds:any)=>{
          const entry=Module.checkDae(fds.files);
          if(entry==null) return console.log('not dae zip file');
                //console.log(entry);
          Uper.content(fds,entry.name,(ctx:any)=>{
            Module.fresh(ctx,'dae');
          });
        });
      }else{
        Uper.direct(file,(ctx:any)=>{
          Module.fresh(ctx,suffix);
        });
      }
      //2.保存文件信息
      moduleFile=file;
      return true;
    },
    uploadClick:()=>{
      //console.log('[sky.tsx]ready to upload');
      //console.log(moduleFile)
      if(moduleFile!=null){
        const owner='5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y';
        const cat='module';

        const cfg={
          owner:owner,
          cat:cat,
          token:'not yet',    //这里需要进行统一获取
          suffix:self.getSuffixByName(moduleFile.name),    //对后缀名进行处理，解析出dae
        }

        Uper.up(moduleFile,api,cfg,(res:any)=>{
          if(res.success) self.nowPage();
        });
      }else{
        self.info('未选择可以上传的文件');
      }
    },
    getSuffixByName:(name:string)=>{
      const sfx=name.split('.').pop();
      if(sfx==null) return '';
      if(config.suffixTransform[sfx]!=undefined) return config.suffixTransform[sfx]
      return sfx;
    },

    thumbClick:(id:number)=>{
      
      const decode=tools.decode;
      api.query.vbw.sourceMap(id,(dt:any)=>{
        const sou=JSON.parse(JSON.stringify(dt));
        const hash=decode(sou.hash),format=decode(sou.format);
        const path=Uper.transPath(hash,format);
        const target=path+hash+'.'+format;
        console.log(target);
      });
    },
    info:(txt:string,at:number=2000)=>{
      setInfo(txt);
      setTimeout(()=>{
        setInfo('');
      },at);
    },
    nowPage:()=>{
      api.isReady.then(()=>{
        api.query.vbw.sourceCount((obj:any)=>{
          const start=parseInt(obj.words[0])-1;
          if(start<1) return setData([]);

          self.filterSource(start,config.page,[],(list:any)=>{
            console.log(list);
            setData(list);
          });
        });
      });
    },
    filterSource:(start:number,step:number,now:Array<any>,ck:any)=>{
      //curSourceIndex=start;
      let ids:Array<number>=[];

      for(let i=0;i<step;i++){
        const id=start-i;
        if(id < 1) break;
        ids.push(id);
      }
      const max=ids.length;

      let ready=0;
      const next=start-step;
      for(let k in ids){
        const id=ids[k];
        if(Run.exist(id)){
          ready++;
          const row=Run.get(id);
          if(config.format[row.format]){
            now.push(row);
          }
          if(now.length==step) return ck && ck(now);
          
          if(ready==max){
            if(next<1) return  ck && ck(now);
            console.log('search in cache');
            return self.filterSource(next,step,now,ck);
          }
        }else{
          Run.sync(id,()=>{
            ready++;
            const row=Run.get(id);
            if(config.format[row.format]){
              now.push(row)
            }
            if(now.length==step) return ck && ck(now);
            
            if(ready==max){
              if(next<1) return  ck && ck(now);
              console.log('search in blockchain');
              return self.filterSource(next,step,now,ck);
            }
          });
        }
      }
    },
    nextPage:()=>{
        const next:any=[
          {id:122,format:'fbx',hash:'abcdabcdabcdabcdabcdabcdabcdabcd',check:'',status:1},
          {id:133,format:'fbx',hash:'abcdabcdabcdabcdabcdabcdabcdabcd',check:'',status:1},
          {id:144,format:'fbx',hash:'abcdabcdabcdabcdabcdabcdabcdabcd',check:'',status:1},
          {id:155,format:'fbx',hash:'abcdabcdabcdabcdabcdabcdabcdabcd',check:'',status:1},
        ]
        setData(next);
    },
  }

  React.useEffect(() => {
    moduleFile=null;
    self.nowPage();
  }, []);

  const tmap={width:'100%'},smap={'marginTop':'5px','marginBottom':'15px','fontSize':'16px'}
  //const fmap={float:'right'};
  return (
    <section>
      <table style={tmap}>
        <tbody>
          <tr>
            <td>
              <span style={{'marginTop':'5px','marginBottom':'5px','fontSize':'16px','float':'left'}}>【坐标说明】X轴:红色,Y轴:绿色,Z轴:蓝色</span>
              <span style={{'marginTop':'5px','marginBottom':'5px','fontSize':'16px','float':'right','color':'#EFA322'}}>{info}</span>
            </td>
            <td>
            <span style={smap}>预览列表</span>
            </td>
          </tr>
          <tr>
            <td>
              <Preview/>
            </td>
            <td>
              <List 
                data={list}
                click={self.thumbClick}
                upper={Uper}
              />
            </td>
          </tr>
          <tr>
            <td>
              <table style={tmap}>
                <tbody>
                <tr>
                  <td>
                    <Inputer 
                      preview={self.fresh}
                    />
                  </td>
                  <td>
                    <Button
                      //icon='paper'
                      label='上传模型'
                      onClick={self.uploadClick}
                      //size='small'
                      tooltip='上传支持的模型文件[fbx,dae]'
                      //style={fmap}
                    />
                  </td>
                </tr>
                </tbody>
              </table>
            </td>
            <td>
            <Button
                //icon='paper latest'
                label='最新'
                //onClick=
                //size='small'
                tooltip='最新的上传的全景列表'
              />
            <Button
                //icon='paper loading'
                label='更多'
                //onClick=
                //size='small'
                tooltip='获取更多全景列表'
              />
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

export default React.memo(App);