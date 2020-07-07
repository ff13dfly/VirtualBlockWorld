import { Run,Queue } from './runtime';
import { Stage } from './render';
import { tools } from './common/tools';
import { ApiPromise } from '@polkadot/api';


const self={
    resource:(api:ApiPromise)=>{
        const ids=[1,2];
        for(let i=0,len=ids.length;i<len;i++){
            const id=ids[i];
            api.query.vBlock.sourceMap(id,(res:any)=>{
                const dt=JSON.parse(JSON.stringify(res));
                const path=tools.decode(dt.hash);
                console.log(path);
            });
        }
        
    },
    limitDemo:()=>{
        const fun=tools.reviseSizeOffset;
        
        const start_01=300,size_01=15000,max_01=16000;
        console.log(`计算的限制长度为${max_01},开始位置为${start_01},组件长度为${size_01}。计算结果为${JSON.stringify(fun(start_01,size_01,max_01))}`)

        const start_02=15000,size_02=3000,max_02=16000;
        console.log(`计算的限制长度为${max_02},开始位置为${start_02},组件长度为${size_02}。计算结果为${JSON.stringify(fun(start_02,size_02,max_02))}`)

        const start_03=15000,size_03=23000,max_03=16000;
        console.log(`计算的限制长度为${max_03},开始位置为${start_03},组件长度为${size_03}。计算结果为${JSON.stringify(fun(start_03,size_03,max_03))}`)
    },

    hashToPath:(hash:string)=>{

    },
    queue:()=>{
        //1.初始化queue及push数据
        const qkey='demo';
        Queue.push(qkey,33);
        Queue.push(qkey,'3a3');
        Queue.push(qkey,'a');
        Queue.push(qkey,213);
        const qa=Queue.get(qkey);
        console.log('push data to queue:'+JSON.stringify(qa));

        //2.删除队列数据
        Queue.remove(qkey,'a');
        const qb=Queue.get(qkey);
        console.log('remove data from queue:'+JSON.stringify(qb));

        //3.检查存在
        const a=213;
        console.log('value['+a+'] exsist in queue '+JSON.stringify(qb)+'?'+Queue.exsist(qkey,a));
        const b='bbb';
        console.log('value['+b+'] exsist in queue '+JSON.stringify(qb)+'?'+Queue.exsist(qkey,b));
        //4.删除队列
        Queue.del(qkey);
        const qc=Queue.get(qkey);
        console.log('remove queue:'+JSON.stringify(qc));
    },
    runtime:()=>{
        Run.set('aa',333);
        Run.set('bb',223);
        Run.set('cc',true);
        console.log('aa value:'+Run.get('aa'));
        console.log('before delete'+JSON.stringify(Run.dump()));
        
        //1.修改数据
        Run.set('aa',1314);
        console.log('aa value:'+Run.get('aa'));

        Run.set('aa',{test:'hello world'});
        console.log('aa value:'+ JSON.stringify(Run.get('aa')));

        //2.删除数据
        Run.del('cc');
        console.log('after delete'+JSON.stringify(Run.dump()));

        //3.获取非法数据
        let key:any='abc'
        console.log('illigle value:'+ JSON.stringify(Run.get(key)));

        key=undefined
        console.log('illigle value:'+ JSON.stringify(Run.get(key)));

        key={cc:123}
        console.log('illigle value:'+ JSON.stringify(Run.get(key)));

    },
    threeLine:()=>{
        const demo={
            geometry:[
                {type:'line',data:[[8000,8000,0],[8000,8000,16000]],position:[8000,8000,0],rotation:[0,0,0],cfg:{
                    color:'#3344FF',
                    opacity:1,
                    edge:false,          //显示边缘
                },
                info:{type:'helper',skip:true},}
            ],
        }
        Stage.add(1,1,demo,0);
    },
}
export{self as test}