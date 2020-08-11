// Copyright 2020 Fuu<ff13dfly@163.com> authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

interface Props {
  preview: any;
}

function ImageUploader (prop:Props): React.ReactElement<Props> {
  const self={
    change:(ev:any)=>{
      if(!ev.target || !ev.target.files || !ev.target.files[0]) return false;
      prop.preview(ev.target.files[0]);
      return true;
    },
  }

  return (
    <section style={{ width: '100%',marginTop:'0px'}}>
      <label>选择贴图文件</label>
      <input type="file" accept="image/*" onChange={self.change}/>
    </section>
  );
}


export default React.memo(ImageUploader);