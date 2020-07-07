
//Ensure we're `no_std` when compiling for Wasm.
#![cfg_attr(not(feature = "std"), no_std)]

//1.调用的库放在这里
use codec::{Encode, Decode};
use frame_support::{
    debug, decl_event, decl_module, decl_storage, dispatch::DispatchResult
};
use frame_system::{self as system, ensure_signed};
use sp_std::prelude::*;

//2.基础的功能实现
pub trait Trait: pallet_balances::Trait + system::Trait {
    type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
}

//世界的基本配置结构
#[derive(Encode, Decode,Default, Clone, PartialEq)]
#[cfg_attr(feature = "std", derive(Debug))]
pub struct Setting<A> {
    king: A,            //world的king   
    stamp:u64,        //世界发行的block号
}

//自定义的出错信息
// decl_error! {
//     /// Error for the vblock module.
//     pub enum Error for Module<T: Trait> {
//         /// 创建世界失败
//         FailToCreateWorld,
//     }
// }

// 3. Pallet Events
decl_event! {
    pub enum Event<T>
    where
        B = <T as pallet_balances::Trait>::Balance,
        AccountId = <T as system::Trait>::AccountId,
    {
        Created(AccountId,B),
    }
}


// 5. Pallet Storage Items
decl_storage! {
    trait Store for Module<T: Trait> as world {
        WorldCount get(current_world_id) : u32;         //记录当前世界发行的id
    }
}

// 6. Callable Pallet Functions
decl_module! {
    pub struct Module<T: Trait> for enum Call where origin: T::Origin{
        fn deposit_event() = default;
        //fn deposit_event<T>() = default;

        fn on_finalize(_n: T::BlockNumber){

        }

        fn new_world(origin,_king:T::AccountId)->DispatchResult{
            let _sender = ensure_signed(origin)?;

            //1.获取当前的world自增号
            <WorldCount>::put(520);

            //2.检查AccountId的合法性

            //3.创建世界的所有土地block
            // let _y=33;
            // for _x in 0..MAX_X as usize {
            //     //for _y in 0..MAX_X as usize {
            //         <VirtualWorld>::insert((_x as u32, _y as u32,_count as u32),2234);
            //     //}
            // }
            //4.写入默认的世界配置

            //5.向AccountId发行对应的coin
            debug::info!("new world created,fighting...");

            Ok(())
        }

        fn offchain_worker(n: T::BlockNumber){
            debug::info!("hello world module [{:?}] , off chain working...",n);
        }
    }
}

impl<T: Trait> Module <T> {
    // #[allow(dead_code)]
    // fn change_nonce(n:u64){
    //     //<Nonce<T>>::mutate(|n| *n);
    //     Nonce::mutate(|n| *n);
    // }
}