// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//import { BareProps } from '@polkadot/react-components/types';

//import React, { useState } from 'react';
//import styled from 'styled-components';

import React,{useState}from 'react';
import { Button } from '@polkadot/react-components';

import {Uper} from './common/upload';
import {tools} from './common/tools';
import {useApi} from '@polkadot/react-hooks';
import Preview from './pano/SkyPreview';
import Inputer from './pano/SkyUploader';
import List from './pano/SkyList';
import {Pano} from './pano/pano';

const config:any={
  page:4,
  replace:'http://127.0.0.1:3000/static/pano/',
}

interface Props {
  accountId?: string | null;
}

function Sky (props:Props): React.ReactElement<Props> {

  const {api} = useApi();
  const [list, setData] = useState([]);     //列表页的数据及设置方法
  const [info, setInfo] = useState('');     //出错信息

  let panoFile:any=null;
  const self={
    fresh:(file:File)=>{
      //1.预览文件进行显示
      Uper.folder(file,(fds:any)=>{
        if(!Pano.checkPano(fds.files)) return console.log('非法的pano文件');
        
        const list=Pano.getIndex();

        let mapPano:any=[];
        for(let i=0,len=list.length;i<len;i++){
          const name=list[i]
          const ig=new Image();
          //console.log(config.replace+name)
          ig.src=config.replace+name;
          mapPano[i]=ig;
        }

        for(let i=0,len=list.length;i<len;i++){
          const name=list[i];
          ((id:number,key:string)=>{
            Uper.content(fds,key,(ctx:string)=>{
              mapPano[id].src=ctx
              console.log(key);
              Pano.fresh(mapPano);
            });
          })(i,name);
          
        }

      });

      //2.保存文件信息
      panoFile=file;
    },
    
    uploadClick:()=>{
      console.log('[sky.tsx]ready to upload');
      if(panoFile!=null){
        const owner='5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y';
        const cat='pano';

        const cfg={
          owner:owner,
          cat:cat,
          token:'not yet',      //这里需要进行统一获取
        }
        Uper.up(panoFile,api,cfg,(res:any)=>{
          if(res.success) self.nowPage();
        });
      }else{
        self.info('未选择可以上传的文件');
      }
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
      const step=config.page;
      let now:any=[];
      const decode=tools.decode;
      api.isReady.then(()=>{
        api.query.vbw.sourceCount((obj:any)=>{
          const start=parseInt(obj.words[0])-1;
          if(start<1) return setData([]);
          let ids:Array<number>=[];
          for(let i=0;i<step;i++){
            const id=start-i;
            if(id < 1) break;
            ids.push(id);
          }
          //console.log(ids);

          for(let k in ids){
            const id=ids[k];
            api.query.vbw.sourceMap(id,(dt:any)=>{
              const sou=JSON.parse(JSON.stringify(dt));
              const row={
                id:id,
                format:decode(sou.format),
                hash:decode(sou.hash),
                block:sou.stamp,
                status:sou.status,
              };
              now.push(row)
              if(now.length==ids.length)setData(now);
            });
          }
        });
      });
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
    panoFile=null;
    self.nowPage();
  }, []);

  const tmap={width:'100%'},smap={'marginTop':'5px','marginBottom':'15px','fontSize':'16px'}
  const fmap={float:'right'};
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
              <Preview />
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
                      //icon='paper plane'
                      label='上传全景天空'
                      onClick={self.uploadClick}
                      size='small'
                      tooltip='上传支持的模型文件[fbx,dae]'
                      style={fmap}
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
                size='small'
                tooltip='最新的上传的全景列表'
              />
            <Button
                //icon='paper loading'
                label='更多'
                //onClick=
                size='small'
                tooltip='获取更多全景列表'
              />
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
export default React.memo(Sky);