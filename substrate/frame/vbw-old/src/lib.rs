#![cfg_attr(not(feature = "std"), no_std)]

mod tests; 

//substrate crate implement
use codec::{Decode, Encode};
use frame_support::{
    debug, decl_error, decl_event, decl_module, decl_storage, dispatch::DispatchResult, ensure,
    storage::StorageValue,
};
use frame_system::{self as system, ensure_root, ensure_signed};
use sp_std::prelude::*;

pub trait Trait: pallet_balances::Trait + system::Trait {
    type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
}

//basic setting
const MAX_X: u32 = 2048;    //x coordinate limit
const MAX_Y: u32 = 2048;    //y coordinate limit
const MAX_RANGE: u32 = 10;  //range extention limit
const SIDE_LENGTH:u32=32;   //block side length

//error definition
decl_error! {
    /// Error definition for the vblock module.
    pub enum Error for Module<T: Trait> {
        /// request out of block limit
        OutOfRange,
    }
}

//block range defination
#[derive(Default, Clone, PartialEq)]
#[cfg_attr(feature = "std", derive(Debug))]
pub struct Range {
    x: u32,     //x coordinate,1~MAX_X
    y: u32,     //y coordinate,1~MAX_Y
    dx: u32,    //x extention,x+dx:1~MAX_X
    dy: u32,    //y extention,y+dy:1~MAX_Y
    world: u32, //world id
}

//block status definition
const BLOCK_STATUS_OK: u32 = 1;             //normal status,access freely
//const BLOCK_STATUS_PRIVATE: u32 = 2;        //private status,only for owner
//const BLOCK_STATUS_GIFT_CHECK: u32 = 3;     //block normal status
//const BLOCK_STATUS_ABANDON: u32 = 4;        //block normal status
//const BLOCK_STATUS_SELLING: u32 = 5;        //block normal status
//const BLOCK_STATUS_RENTING: u32 = 6;        //block normal status

#[derive(Encode, Decode, Default, Clone, PartialEq)]
#[cfg_attr(feature = "std", derive(Debug))]
pub struct Basic<A, B, C> {
    raw: Vec<u8>,   //block raw data
    status: u32,    //block status:[normal,private,gift,abandoned,selling,renting]
    elevation: u32, //block elevation
    stamp: A,       //block update timestamp:blocknumber
    owner: B,       //block owner:  AccountId
    tenant: C,      //block tenant: AccountId
}

//world status definition
//const WORLD_STATUS_PRE:u32 = 2; //world auction status
//const WORLD_STATUS_OK: u32 = 1; //world normal status

#[derive(Encode, Decode, Default, Clone, PartialEq)]
#[cfg_attr(feature = "std", derive(Debug))]
pub struct World<A, N, S> {
    start: N,       //world start timestamp:blocknumber
    //pub auction:    N,              //world publish timestamp:blocknumber
    xcount: u32,    //world x coordinate limit 
    ycount: u32,    //world y coordinate limit 
    king: A,        //world king: accountID
    setting: S,     //world setting
    status: u32,    //world stauts:[auction,normal]
}

//resource definition
#[derive(Encode, Decode, Default, Clone, PartialEq)]
#[cfg_attr(feature = "std", derive(Debug))]
pub struct Source<N,W> {
    stamp: N,        //resource create timestamp:blocknumber
    hash: Vec<u8>,   //resource save hash
    check: Vec<u8>,  //resource file md5 check result
    format: Vec<u8>, //resource file format: [image,module,pano,...]
    status: u32,     //resource status:[]
    owner:W,         //resource owner:AccountId
}

//world setting definition
#[derive(Encode, Decode, Clone, PartialEq)]
#[cfg_attr(feature = "std", derive(Debug))]
pub struct Setting {
    elevation: u32,     //world elevation,unit:mm
}

impl Default for Setting {
    fn default() -> Self {
        Setting {
            elevation: 0,   //default world elevation
        }
    }
}

/*
#vis #name get(fn #getter) config(#field_name) build(#closure): #type = #default;

#vis：设置结构体的可见性。pub或不设置。
#name：存储项的名称，用作存储中的前缀。
get(fn #getter)：可选，实现Module的名称为#getter的函数。
config(#field_name)：可选，定义可在GenesisConfig中包含该存储项。如果设置了get，则field_name是可选的。
build(#closure)：可选，定义闭包，调用它可以覆盖存储项的值。
#type：存储项的类型。
#default：定义默认值，即无值时的返回值。
*/

decl_storage! {
    trait Store for Module<T: Trait> as Vblock {
        /// autoincrement world id
        WorldCount get(fn world_count):u32=0;

        /// world setting
        WorldMap get(fn world_map):map hasher(opaque_blake2_256) u32 => World<T::AccountId,T::BlockNumber,Setting>;
        //WorldArray get(fn world_array):Vec<World<T::AccountId,T::BlockNumber,Setting>>;

        /// block data storage
        BlockMap get(fn block_cache):map hasher(opaque_blake2_256) (u32,u32,u32) => Basic<T::BlockNumber,T::AccountId,T::AccountId>;       //(world,x,y)的顺序保存世界数据

        /// player last exit coordinate
        PlayerPosition get(fn player_postion):map hasher(opaque_blake2_256) T::AccountId => (u32,u32,u32);

        /// vec<u8> storage test
        VecJSON:Vec<u8>;

        /// autoincrement resource id
        SourceCount get(fn soucrce_count):u32=1;

        /// resource summary storage
        SourceMap get(fn get_source):map hasher(opaque_blake2_256) u32 => Source<T::BlockNumber,T::AccountId>;
    }
}

decl_event!(
    pub enum Event<T>
    where
        AccountId = <T as system::Trait>::AccountId,
    {
        Done(AccountId),
    }
);

decl_module!{
    pub struct Module<T: Trait> for enum Call where origin: T::Origin{
        fn deposit_event() = default;
        fn on_finalize(_n: T::BlockNumber){}

        #[weight=100];
        fn updaet_source(origin,id:u32,data:Vec<u8>)->DispatchResult{
            let _sender = ensure_signed(origin)?;
            Ok(())
        }

        #[weight=100];
        fn demo_vec(origin,data:Vec<u8>)->DispatchResult{
            let _sender = ensure_signed(origin)?;
            // let mut buf = Vec::new();
            // buf.extend_from_slice(b"hello vec");
            VecJSON::put(data);
            Ok(())
        }

        /// Vec<u8> read and write test
        #[weight=100];
        fn inside_vec(origin)->DispatchResult{
            let _sender = ensure_signed(origin)?;
            let mut buf = Vec::new();
            buf.extend_from_slice(b"hello vec");
            VecJSON::put(buf);

            Self::deposit_event(RawEvent::Done(_sender));       //callback test
            Ok(())
        }

        /// 设置player的用户存盘点
        #[weight=100];
        fn player_position_save(origin,world:u32,x:u32,y:u32)-> DispatchResult{
            let player = ensure_signed(origin)?;

            //1.判断world值是否超限；

            //2.判断[x,y]值是否超限；

            //3.判断[x,y]是否合法，player可以正常进入；

            <PlayerPosition<T>>::insert(player,(world,x,y));
            Ok(())
        }
        
        /// initializing resource
        #[weight=100];
        fn source_init(origin,hash:Vec<u8>,format:Vec<u8>,owner:T::AccountId) -> DispatchResult{
            let _sender = ensure_signed(origin)?;

            let id=Self::soucrce_count();
            let status=1;
            let mut check = Vec::new();
            check.extend_from_slice(b"");

            let data = Source{
                stamp:<system::Module<T>>::block_number(),
                hash:hash,
                check:check,
                format:format,
                status:1,
                owner:owner,
            };

            //1.insert basic data
            <SourceMap<T>>::insert(id,data);

            //2.increase the resource id；
            <SourceCount>::mutate(|nn| *nn += 1);

            Self::deposit_event(RawEvent::Done(_sender));       //回调事件，看看polkadot那边怎么响应的
            Ok(())
        }

        /// initializing a new world
        #[weight=100];
        fn world_init(origin,king:T::AccountId)-> DispatchResult{
            //1.check root authority；
            let _sender = ensure_signed(origin)?;

            //2.create world setting data;
            let wd = World{
                start:<system::Module<T>>::block_number(),
                xcount:MAX_X,
                ycount:MAX_Y,
                king:king,
                setting:Setting::default(),
                status:1,
            };
            let id=Self::world_count();
            <WorldMap<T>>::insert(&id,wd);

            //3.increase the world id
            <WorldCount>::mutate(|nn| *nn += 1);

            Ok(())
        }

        /// get multi resource data by ids;
        #[weight=100];
        fn source_ids(origin,ids:Vec<u32>)-> DispatchResult{
            let _sender = ensure_signed(origin)?;
            for i in &ids {

            }
            Ok(())
        }

        /// initializing a range of blocks
        #[weight=100];
        fn block_range(origin,x:u32,y:u32,dx:u32,dy:u32,world:u32)-> DispatchResult{
            let _sender = ensure_signed(origin)?;
            //1.check range limit
            ensure!(Self::check_range(x,y,dx,dy),"out of range");
            //let mut vv = Vec::new();

            //2.get the world setting for owner data
            let wd=Self::world_map(world);
            if wd.status==0 {       //阻断world没有初始化的情况
               return Ok(());
            }

            //3.create default blocks 
            for i in 0..dx as usize {
                for j in 0..dy as usize {
                    let nx=x+i as u32;
                    let ny=y+j as u32;
                    let bk = Self::block_cache((world,&nx,&ny));
                    if bk.status!=BLOCK_STATUS_OK{
                        let mut buf = Vec::new();
                        buf.extend_from_slice(b"{}");       //block写入空数据

                        let bk = Basic{
                            raw:buf,       //block的原始数据
                            status: BLOCK_STATUS_OK,       //地块状态
                            elevation:0,        //海拔高度
                            stamp: <system::Module<T>>::block_number(),          //最后更行的stamp，为blocknumber
                            owner: wd.king.clone(),     //所有者的AccountId
                            tenant: wd.king.clone(),    //租赁者的AccountId,后面替换成enum
                        };

                        <BlockMap<T>>::insert((world,nx,ny),bk.clone());
                    }
                    //vv.push((world,nx,ny,bk));          //输出到vec，调用事件
                }
            }

            Ok(())
        }

        /// update block elevation
        #[weight=100];
        fn block_elevation(origin,x:u32,y:u32,world:u32,ev:u32)-> DispatchResult{
            let _sender = ensure_signed(origin)?;
            let dt=<BlockMap<T>>::get((world,x,y));
            let bb = Basic{
                raw:dt.raw,       
                elevation:ev,
                status: dt.status,
                stamp: dt.stamp,  
                owner: dt.owner, 
                tenant: dt.tenant,
            };
            <BlockMap<T>>::insert((world,x,y),bb);

            Ok(())
        }

        /// update single block
        #[weight=100];
        fn block_update(origin,x:u32,y:u32,world:u32,data:Vec<u8>)-> DispatchResult{
            let _sender = ensure_signed(origin)?;

            let dt=<BlockMap<T>>::get((world,x,y));
           // if dt.status!=BLOCK_STATUS_OK{
                //let mut buf = Vec::new();
                //buf.extend_from_slice(b"{aaa}");       //block写入空数据
                let bb = Basic{
                    raw:data,                       //block的原始数据
                    elevation:dt.elevation,         //地块的高度
                    status: BLOCK_STATUS_OK,        //地块状态
                    stamp: <system::Module<T>>::block_number(),          //最后更行的stamp，为blocknumber
                    owner: _sender.clone(),          //所有者的AccountId
                    tenant: _sender,                //租赁者的AccountId
                };

                <BlockMap<T>>::insert((world,x,y),bb);
            //}

            let v=<BlockMap<T>>::get((world,x,y));
            //VecJSON::put(v.raw);      //测试Vec<u8>的前端显示

            Ok(())
        }

        /// set range status to saling
        #[weight=100];
        fn range_to_sale(origin,_x:u32,_y:u32,_dx:u32,_dy:u32,_world:u32,_price:T::Balance) -> DispatchResult{
            //fn range_to_sale(origin,rg:Range,price:T::Balance) -> DispatchResult{
            let _sender = ensure_signed(origin)?;

            //<Value<T>>::put(value);
            Ok(())
        }

        /// 撤回已经处于销售状态的土地
        #[weight=100];
        fn range_sale_recall(origin,_index:u32) -> DispatchResult{
            let _sender = ensure_signed(origin)?;
            Ok(())
        }

        ///购买指定区域的土地
        #[weight=100];
        fn range_buy(origin, _sale_id:T::Hash,_buyer:T::AccountId)-> DispatchResult{
            let _sender = ensure_signed(origin)?;
            //1.根据sale_id检查合法性，获取土地区域的价格

            //2.检查buyer的合法性，coin是否够

            //3.修改土地的所有权，建立交易

            Ok(())
        }

        ///设置range区域到租赁状态
        #[weight=100];
        fn range_to_rent(origin,_x:u32,_y:u32,_dx:u32,_dy:u32,_world:u32,_price:T::Balance) -> DispatchResult{
            let _sender = ensure_signed(origin)?;
            Ok(())
        }

        ///租赁指定区域的土地
        #[weight=100];
        fn range_rend(origin,_rent_id:T::Hash,_tenant:T::AccountId)-> DispatchResult{
            let _sender = ensure_signed(origin)?;
            Ok(())
        }


        /****************交易市场信息列表******************/
        ///获取可租赁土地的列表
        #[weight=100];
        fn market_rent(origin,_page:u32)->DispatchResult{
            let _sender = ensure_signed(origin)?;
            //1.获取售卖土地列表的分页信息，检查page的合法性

            //2.按照page进行数据输出

            Ok(())
        }

        ///获取可购买土地的列表
        #[weight=100];
        fn market_sale(origin,_page:u32)->DispatchResult{
            let _sender = ensure_signed(origin)?;
            //1.获取售卖土地列表的分页信息，检查page的合法性

            //2.按照page进行数据输出

            Ok(())
        }

        /****************个人列表信息获取******************/

        ///指定用户的出售列表
        #[weight=100];
        fn my_sale_list(origin,_uid:T::AccountId,_page:u32)-> DispatchResult{
            let _sender = ensure_signed(origin)?;
            Ok(())
        }

        ///指定用户的租赁列表
        #[weight=100];
        fn my_rent_list(origin,_uid:T::AccountId,_page:u32)-> DispatchResult{
            let _sender = ensure_signed(origin)?;
            Ok(())
        }
        // fn add_init_count(origin)-> DispatchResult{
        //     let _sender = ensure_signed(origin)?;
        //     WorldInitCount::mutate(|n|*n+=1);
        //     Ok(())
        // }
        //块打包时候的自动操作,注意,经测试,是没法修改storage的
        fn offchain_worker(_nb: T::BlockNumber){

            debug::info!("Off-chain working...");
            let _data = r#"{
                "name": "John Doe",
                "age": 43,
                "phones": [
                    "+44 1234567",
                    "+44 2345678"
                ]
            }"#;
        }
    }
}

//扩展功能实现部分
//在decl_module中调用方法为 Self::fun();
impl<T: Trait> Module<T> {
    //block range check
    #[allow(dead_code)]
    fn check_range(x: u32, y: u32, dx: u32, dy: u32) -> bool {
        if x == 0 || y == 0 {
            false
        } else if dx > MAX_RANGE || dy > MAX_RANGE {
            false
        } else if x + dx > MAX_X || y + dy > MAX_Y {
            false
        } else {
            true
        }
    }

    //检查区域是否为同一用户所有
    #[allow(dead_code)]
    fn check_owner() -> bool {
        true
    }
}
