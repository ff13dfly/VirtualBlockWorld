//Ensure we're `no_std` when compiling for Wasm.
#![cfg_attr(not(feature = "std"), no_std)]

//调用的库放在这里
use codec::{Decode, Encode};
use frame_support::{
    debug, decl_error, decl_event, decl_module, decl_storage, dispatch::DispatchResult,
};
use frame_system::{self as system, ensure_root, ensure_signed};
use sp_std::prelude::*;

//use frame_support::traits::Randomness

//基础的功能实现
pub trait Trait: pallet_balances::Trait + system::Trait {
    type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
}

//const SALT: u32 = 3332;      //map的key的盐，后期可以进行配置处理
const MAX_X: u32 = 2048; //X坐标的最大值 x <= max_x
const MAX_Y: u32 = 2048; //Y坐标的最大值 y <= max_y
                         //const ROOT:str =  "5H6ovpy8J8PF4cJFtQdVindB7qGbNnDEeHpdL3yZ7dB4pt46";      //0号世界的所属

//自定义的出错信息
decl_error! {
    /// Error for the vblock module.
    pub enum Error for Module<T: Trait> {
        /// 坐标超出范围
        OutOfRange,
    }
}

#[derive(Default, Clone, PartialEq)]
#[cfg_attr(feature = "std", derive(Debug))]
pub struct Range {
    x: u32,     //开始x坐标，范围1～2048
    y: u32,     //开始y坐标，范围1～2048
    dx: u32,    //开始x方向延伸,x+dx范围1～2048
    dy: u32,    //开始y方向延伸,y+dx范围1～2048
    world: u32, //世界编号
}

#[derive(Encode, Decode, Default, Clone, PartialEq)]
#[cfg_attr(feature = "std", derive(Debug))]
pub struct Block {
    x: u32,
    y: u32,
    world: u32,
}

//block的基础数据构成
#[derive(Encode, Decode, Default, Clone, PartialEq)]
#[cfg_attr(feature = "std", derive(Debug))]
pub struct Raw<A, B> {
    adjunct: Vec<u32>, //附属物保存的根
    stop: Vec<u32>,    //阻拦体保存的根
    trigger: Vec<u32>, //触发器保存的根
    light: Vec<u32>,   //灯光保存的根
    extra: Vec<u32>,   //扩展配置保存的根
    preter: u32,       //解释器，[水面,地面]
    elevation: u32,    //地面高度(mm)
    side: u32,         //地块变长(m)
    status: u32,       //地块状态 []
    stamp: B,          //最后更行的stamp，为blocknumber
    owner: A,          //所有者的AccountId
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
//自定义的存储方式
decl_storage! {
    trait Store for Module<T: Trait> as Vblock {
        /*******完整构建的部分********/
        WorldCount get(current_world_id) : u32;         //记录当前世界发行的id

        //AllSaleArray get(pub_sale_list): Vec<u32>;      //list直接用Vec来存储
        AllRentArray get(pub_rent_list): Vec<u32>;      //list直接用Vec来存储
        AllSaleArray get(pub_sale_list): map hasher(blake2_256) u32 => Vec<u32>;      //所有在售block数据的保存方式：world->array;

        //MySaleArray get(pub_sale_list): map hasher(blake2_256) (T::AccountId,u32) => Vec<u32>;      //所有在售block数据的保存方式：world->array;

        //MyBlockList get(my_block_list): map hasher(blake2_256) (T::AccountId,u32) => T::AccountId;         //二维数组,u32为index
        //SaleList get(pub_sale_list): map hasher(blake2_256) (T::AccountId,u32) => T::AccountId;         //二维数组,u32为index

        //VirtualWorld:map hasher(blake2_256) (u32,T::Hash) => T::AccountId;          //所有block数据的保存方式：world->hash(x,y)->data;
        //VirtualWorld:map hasher(blake2_256) (u32,u32,u32) => Raw<T::AccountId,T::BlockNumber>;

        ///所有block地块信息的保存map
        VirtualWorld:map hasher(blake2_256) (u32,u32,u32) => u32;

        //SuperThingsBySuperNumbers get(fn super_things_by_super_numbers):
        //   map hasher(blake2_256) u32 => SuperThing<T::Hash, T::Balance>;

        Nonce: u64;         //临时变量，不知道啥用

        //OwnedKittiesIndex: map T::Hash => u64;
        //let random_hash = (<system::Module<T>>::random_seed(), &sender, nonce)
        //        .using_encoded(<T as system::Trait>::Hashing::hash);
        //<OwnedKittiesIndex<T>>::insert(random_hash, 3);
    }
}

//自定义的事件
decl_event!(
    pub enum Event<T>
    where
        B = <T as pallet_balances::Trait>::Balance,
        AccountId = <T as system::Trait>::AccountId,
    {
        Done(AccountId, B),
    }
);

/**************************************************************/
/***************功能实现部分，需要的数据结构等都放在这里**************/
/**************************************************************/

//自定义的API可调用的方法
decl_module! {
    pub struct Module<T: Trait> for enum Call where origin: T::Origin{
        fn deposit_event() = default;
        //fn deposit_event<T>() = default;

        fn on_finalize(_n: T::BlockNumber){

        }

        ///按照x，y计算保存的键值
        fn block_key(origin,_x:u32,_y:u32,_world:u32) -> DispatchResult{
            let _sender = ensure_signed(origin)?;
            //let _hash = (<system::Module<T>>::random_seed(), &SALT).using_encoded(<T as system::Trait>::Hashing::hash);

            Ok(())
        }

        ///按照坐标，获取block的值
        fn block_view(origin,_x:u32,_y:u32,_world:u32) -> DispatchResult{
            //let _sender = ensure_signed(origin)?;
            let _root= ensure_root(origin)?;

            //let data = VirtualWorld::get((_x,_y,_world));
            Ok(())
        }

        /****************世界相关的部分******************/
        ///新创建一个世界
        fn new_world(origin,_king:T::AccountId)->DispatchResult{

            let _sender = ensure_signed(origin)?;
            //1.获取当前的world自增号
            //let _count = Self::current_world_id();          //storage里的get方法的使用
            let _count=12;
            <WorldCount>::put(520);

            <Nonce>::put(1314);
            Nonce::put(1314);
            Self::change_nonce(2234);

            //let _nonce = <Nonce>::get();
            //2.检查AccountId的合法性

            //3.创建世界的所有土地block
            let _y=33;
            for _x in 0..MAX_X as usize {
                //for _y in 0..MAX_X as usize {
                    <VirtualWorld>::insert((_x as u32, _y as u32,_count as u32),2234);
                //}
            }
            //4.写入默认的世界配置

            //5.向AccountId发行对应的coin

            WorldCount::mutate(|n| *n += 1);

            debug::info!("new world created,fighting...");

            Ok(())
        }

        ///对世界的指定配置进行设置
        fn world_setting(origin)->DispatchResult{
            let _sender = ensure_signed(origin)?;

            Ok(())
        }

        /****************土地交易状态改变******************/
        ///设置range区域到销售状态
        fn range_to_sale(origin,_x:u32,_y:u32,_dx:u32,_dy:u32,_world:u32,_price:T::Balance) -> DispatchResult{
            //fn range_to_sale(origin,rg:Range,price:T::Balance) -> DispatchResult{
            let _sender = ensure_signed(origin)?;

            //<Value<T>>::put(value);
            Ok(())
        }

        ///撤回已经处于销售状态的土地
        fn range_sale_recall(origin,_index:u32) -> DispatchResult{
            let _sender = ensure_signed(origin)?;
            Ok(())
        }

        ///购买指定区域的土地
        fn range_buy(origin, _sale_id:T::Hash,_buyer:T::AccountId)-> DispatchResult{
            let _sender = ensure_signed(origin)?;
            //1.根据sale_id检查合法性，获取土地区域的价格

            //2.检查buyer的合法性，coin是否够

            //3.修改土地的所有权，建立交易

            Ok(())
        }

        ///设置range区域到租赁状态
        fn range_to_rent(origin,_x:u32,_y:u32,_dx:u32,_dy:u32,_world:u32,_price:T::Balance) -> DispatchResult{
            let _sender = ensure_signed(origin)?;
            Ok(())
        }

        ///租赁指定区域的土地
        fn range_rend(origin,_rent_id:T::Hash,_tenant:T::AccountId)-> DispatchResult{
            let _sender = ensure_signed(origin)?;
            Ok(())
        }


        /****************交易市场信息列表******************/
        ///获取可租赁土地的列表
        fn market_rent(origin,_page:u32)->DispatchResult{
            let _sender = ensure_signed(origin)?;
            //1.获取售卖土地列表的分页信息，检查page的合法性

            //2.按照page进行数据输出

            Ok(())
        }

        ///获取可购买土地的列表
        fn market_sale(origin,_page:u32)->DispatchResult{
            let _sender = ensure_signed(origin)?;
            //1.获取售卖土地列表的分页信息，检查page的合法性

            //2.按照page进行数据输出

            Ok(())
        }

        /****************个人列表信息获取******************/

        ///指定用户的出售列表
        fn my_sale_list(origin,_uid:T::AccountId,_page:u32)-> DispatchResult{
            let _sender = ensure_signed(origin)?;
            Ok(())
        }

        ///指定用户的租赁列表
        fn my_rent_list(origin,_uid:T::AccountId,_page:u32)-> DispatchResult{
            let _sender = ensure_signed(origin)?;
            Ok(())
        }


        fn offchain_worker(n: T::BlockNumber){
            debug::info!("hello block [{:?}] , off chain working...",n);

            let _seed=vec!(3,4,7);


            //let _hash=<T as system::Trait>::Hash::hash(&_seed);
            //let _hash=<T as system::Trait>::Randomness::random(&_seed);
            //let _hash=<T as frame_support::Trait>::traits::Randomness::random(&_seed);
            //<T as system::Trait>::Hash

            // if n as u32 ==1 {
            //     debug::info!("substrate first block");
            // }
            //1.当n为1的时候，创建0号世界
            // if T::BlockNumber::sa(1)==1 {
            //     debug::info!("hello substrate , this is the first block");
            // }
        }
    }
}

//扩展功能实现部分
//在decl_module中调用方法为 Self::fun();
impl<T: Trait> Module<T> {
    #[allow(dead_code)]
    fn change_nonce(_n: u64) {
        //<Nonce<T>>::mutate(|n| *n);
        Nonce::mutate(|n| *n);
    }

    #[allow(dead_code)]
    pub fn range_vec(x: u32, y: u32, dx: u32, dy: u32) -> Vec<Block> {
        let mut vv = Vec::new(); //不制定类型也可以，估计是自动推导出来的
                                 //let mut vv:Vec<Block> = Vec::new();       //完整的写法，以后都这么写
        for _i in 0..dx as usize {
            for _j in 0..dy as usize {
                let result = Block {
                    x: x + _i as u32,
                    y: y + _j as u32,
                    world: 0,
                };
                vv.push(result);
            }
        }
        vv
    }

    //将range的数据转换成hash的操作,当成my_list的索引
    #[allow(dead_code)]
    fn range_to_hash(_range: Range) {}

    //将block转换成hash的操作,当做key来保存block的数据
    #[allow(dead_code)]
    fn block_to_hash(_x: u32, _y: u32, _dx: u32, _dy: u32, _world: u32) {}

    //检查区域是否为同一用户所有
    #[allow(dead_code)]
    fn check_owner() -> bool {
        true
    }

    //检查block的range的合法性
    #[allow(dead_code)]
    fn check_range(x: u32, y: u32, dx: u32, dy: u32) -> bool {
        if x == 0 || y == 0 {
            false
        } else if x + dx > MAX_X || y + dy > MAX_Y {
            false
        } else {
            true
        }
    }
}
