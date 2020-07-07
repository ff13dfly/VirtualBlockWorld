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
import lrz from 'lrz';

import Preview from './texture/TexturePreview';
import Inputer from './texture/TextureUploader';
import List    from './texture/TextureList';

const config:any={
  page:4,     //每页显示的数量
  //max:10,     //最大搜索深度
  format:{
    'jpg':true,
    'png':true,
  }
}

interface Props {}

function Space (): React.ReactElement<Props> {
  const {api} = useApi();
  const [list, setData] = useState([]);     //列表页的数据及设置方法
  const [info, setInfo] = useState('');     //出错信息
  
  //实现数据的方法
  let cp:any=null;
  //let curSourceIndex:number=0;
  const self={
    cropper:(ev:any)=>{
      if(!!ev) cp=ev.cropper;
    },
    fresh:(file:File|string)=>{
      cp.disabled=false;
      if(typeof file=='string'){
        cp.replace(file);
      }else{
        cp.replace(window.URL.createObjectURL(file));
      }
    },
    
    //上传按钮操作
    uploadClick:()=>{
      const bs64=self.getImageBase64();
      lrz(bs64, {quality: 0.8}).then((ig: any) => {
        //1.显示缩略图
        // let img=new Image();
        // img.src=ig.base64;
        // $('#thumb').html(img);

        //2.进行上传操作
        const owner='5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y';
        const cat='texture';
        ig.file.name='thumb.jpg';

        const cfg={
          owner:owner,
          cat:cat,
          token:'not yet',      //这里需要进行统一获取
        }
        Uper.up(ig.file,api,cfg,(res:any)=>{
          if(res.success) self.nowPage();
        });
      });
    },
    getImageBase64:()=>{
      const cfg=cp.getCanvasData();
      //console.log('[texture.tsx=>uploadClick()] config:'+JSON.stringify(cfg))
      cfg.width=512;
      cfg.height=512;
      const bs64=cp.getCroppedCanvas(cfg).toDataURL();
      return bs64;
    },

    thumbClick:(id:number)=>{
      self.info('图像预览模式，不可编辑');
      const decode=tools.decode;
      api.query.vBlock.sourceMap(id,(dt:any)=>{
        const sou=JSON.parse(JSON.stringify(dt));
        const hash=decode(sou.hash),format=decode(sou.format);
        const path=Uper.transPath(hash,format);
        const target=path+hash+'.'+format;
        self.fresh(target);
        cp.disabled=true;
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
        api.query.vBlock.sourceCount((obj:any)=>{
          const start=parseInt(obj.words[0])-1;
          if(start<1) return setData([]);

          self.filterSource(start,config.page,[],(list:any)=>{
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
              <span style={{'marginTop':'5px','marginBottom':'5px','fontSize':'16px','float':'left'}}>
              【分辨率说明】贴图将自动缩放成为[64*64,128*128,256*256,1024*1024,2048*2048]
              </span>
              <span style={{'marginTop':'5px','marginBottom':'5px','fontSize':'16px','float':'right','color':'#EFA322'}}>{info}</span>
            </td>
            <td>
            <span style={smap}>预览列表</span>
            </td>
          </tr>
          <tr>
            <td>
              <Preview 
                cropper={self.cropper}
              />
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
                      icon='paper plane'
                      label='上传材质'
                      onClick={self.uploadClick}
                      size='small'
                      tooltip='上传文件'
                      style={fmap}
                    />
                  </td>
                </tr>
                </tbody>
              </table>
            </td>
            <td>
            <Button
              icon='paper latest'
              label='最新'
              onClick={self.nowPage}
              size='small'
              style={fmap}
              tooltip='最新的上传的模型列表'
            />
            <Button
                icon='paper loading'
                label='更多'
                size='small'
                style={fmap}
                tooltip='获取更多模型列表'
                onClick={self.nextPage}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}


export default React.memo(Space);