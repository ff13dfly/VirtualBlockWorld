// This file is part of VBW.

// Copyright (C) 2020 Fuu<ff13dfly@163.com>.
// SPDX-License-Identifier: Apache-2.0

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// 	http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Ensure we're `no_std` when compiling for Wasm.
#![cfg_attr(not(feature = "std"), no_std)]

//use sp_std::marker::PhantomData;
use frame_support::{
	dispatch::{DispatchResult}, decl_module, decl_storage, decl_event,ensure
};
use sp_std::prelude::*;
//use frame_system::{self as system, ensure_signed};
use frame_system::{self as system,ensure_signed};
use codec::{Encode, Decode};

mod vdecode;
mod extensions;

#[cfg(test)]
mod tests;

/// A type alias for the balance type from this pallet's point of view.
//type BalanceOf<T> = <T as pallet_balances::Trait>::Balance;

/// `frame_system::Trait` should always be included in our implied traits.
pub trait Config: pallet_balances::Config {

	/// The overarching event type.
	type Event: From<Event<Self>> + Into<<Self as frame_system::Config>::Event>;
}

//basic setting
const MAX_X: u32 = 2048;    //x coordinate limit
const MAX_Y: u32 = 2048;    //y coordinate limit
//const MAX_RANGE: u32 = 10;  //range extention limit
//const SIDE_LENGTH:u32=32;   //block side length

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
const WORLD_STATUS_OK: u32 = 1; //world normal status

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
const SOURCE_STATUS_OK: u32 = 1;             //normal status,access freely

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

decl_storage! {
	trait Store for Module<T: Config> as VBW {
		
		// autoincrement world id
        WorldCount get(fn world_count) config():u32=0;

        // world setting
        WorldMap get(fn world_map):map hasher(opaque_blake2_256) u32 => World<T::AccountId,T::BlockNumber,Setting>;
        //WorldArray get(fn world_array):Vec<World<T::AccountId,T::BlockNumber,Setting>>;

        // block data storage
        BlockMap get(fn block_cache) config():map hasher(opaque_blake2_256) (u32,u32,u32) => Basic<T::BlockNumber,T::AccountId,T::AccountId>;       //(world,x,y)的顺序保存世界数据

        // player last exit coordinate
        PlayerPosition get(fn player_postion):map hasher(opaque_blake2_256) T::AccountId => (u32,u32,u32);

        // vec<u8> storage test
        VecJSON get(fn get_vec) config():Vec<u8>;

        // autoincrement resource id
        SourceCount get(fn soucrce_count) config():u32=1;

        // resource summary storage
        SourceMap get(fn get_source):map hasher(opaque_blake2_256) u32 => Source<T::BlockNumber,T::AccountId>;
	}
}

decl_event!(
	/// Events are a simple means of reporting specific conditions and
	/// circumstances that have happened that users, Dapps and/or chain explorers would find
	/// interesting and otherwise difficult to detect.
    ///pub enum Event<T> where B = <T as pallet_balances::Config>::Balance {
    
	pub enum Event<T> where B = <T as pallet_balances::Config>::Balance,AccountId = <T as frame_system::Config>::AccountId {
		// Just a normal `enum`, here's a dummy event to ensure it compiles.
		/// Dummy event, just here so there's a generic type that's used.
		Dummy(B),

		Done(AccountId),
	}
);

decl_module! {
	// Simple declaration of the `Module` type. Lets the macro know what its working on.
	pub struct Module<T: Config> for enum Call where origin: T::Origin {

		fn deposit_event() = default;

		// #[weight=100];
        // fn updaet_source(origin,id:u32,data:Vec<u8>)->DispatchResult{
        //     let _sender = ensure_signed(origin)?;
        //     Ok(())
		// }

		#[weight = 0]
		fn updaet_source(origin,_id:u32,_data:Vec<u8>) -> DispatchResult {
            let _sender = ensure_signed(origin)?;
            
            //extensions::block::BlockModule::hello_world(2,3);

			Ok(())
		}

		#[weight = 0]
		fn demo_vec(origin,data:Vec<u8>) -> DispatchResult {
			let _sender = ensure_signed(origin)?;
			VecJSON::put(data);
			Ok(())
		}

		#[weight = 0]
		fn source_init(origin,hash:Vec<u8>,format:Vec<u8>,owner:T::AccountId) -> DispatchResult {
			let _sender = ensure_signed(origin)?;
			let id=Self::soucrce_count();
            let mut check = Vec::new();
            check.extend_from_slice(b"");

            let data = Source{
                stamp:<system::Module<T>>::block_number(),
                hash:hash,
                check:check,
                format:format,
                status:SOURCE_STATUS_OK,
                owner:owner,
			};
			//1.insert basic data
            <SourceMap<T>>::insert(id,data);

            //2.increase the resource id；
            <SourceCount>::mutate(|nn| *nn += 1);

            Self::deposit_event(RawEvent::Done(_sender));       //回调事件，看看polkadot那边怎么响应的
			Ok(())
		}

		#[weight = 0]
		fn world_init(origin,king:T::AccountId) -> DispatchResult {
			let _sender = ensure_signed(origin)?;
			
			//2.create world setting data;
			let wd = World{
				start:<system::Module<T>>::block_number(),
				xcount:MAX_X,
 				ycount:MAX_Y,
				king:king,
				setting:Setting::default(),
				status:WORLD_STATUS_OK,
			};
			let id=Self::world_count();
			<WorldMap<T>>::insert(&id,wd);

			//3.increase the world id
			<WorldCount>::mutate(|nn| *nn += 1);
			Ok(())
		}

		#[weight = 0]
		fn block_range(origin,x:u32,y:u32,dx:u32,dy:u32,world:u32) -> DispatchResult {
			let _sender = ensure_signed(origin)?;

			//1.check range limitweights::ExtrinsicsWeight
			ensure!(extensions::block::BlockModule::check_range(x,y,dx,dy),"out of range");

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

		#[weight = 0]
		fn block_elevation(origin,x:u32,y:u32,world:u32,ev:u32) -> DispatchResult {
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

		#[weight = 0]
		fn block_update(origin,x:u32,y:u32,world:u32,data:Vec<u8>) -> DispatchResult {
			let _sender = ensure_signed(origin)?;
			let dt=<BlockMap<T>>::get((world,x,y));

			let bb = Basic{
				raw:data,                       //block的原始数据
				elevation:dt.elevation,         //地块的高度
				status: BLOCK_STATUS_OK,        //地块状态
				stamp: <system::Module<T>>::block_number(),          //最后更行的stamp，为blocknumber
				owner: _sender.clone(),          //所有者的AccountId
				tenant: _sender,                //租赁者的AccountId
			};

			<BlockMap<T>>::insert((world,x,y),bb);

			Ok(())
		}
		
		fn offchain_worker(_n: T::BlockNumber) {

		}
	}
}

// The main implementation block for the pallet. Functions here fall into three broad
// categories:
// - Public interface. These are functions that are `pub` and generally fall into inspector
// functions that do not write to storage and operation functions that do.
// - Private functions. These are your usual private utilities unavailable to other pallets.
impl<T: Config> Module<T> {
	//#[allow(dead_code)]
    // fn check_range(x: u32, y: u32, dx: u32, dy: u32) -> bool {
    //     if x == 0 || y == 0 {
    //         false
    //     } else if dx > MAX_RANGE || dy > MAX_RANGE {
    //         false
    //     } else if x + dx > MAX_X || y + dy > MAX_Y {
    //         false
    //     } else {
    //         true
    //     }
    // }
}

