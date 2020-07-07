
// 1. Imports
//1.1. 标准的库
use frame_support::{decl_module, decl_storage, decl_event, dispatch::DispatchResult};
use system::ensure_signed;

//1.2. 非标准的库，支持wasm
#![cfg_attr(not(feature = "std"), no_std)]
use frame_support::{
    decl_module, decl_storage, decl_event, decl_error, ensure, StorageMap
};
use system::ensure_signed;
use sp_std::vec::Vec;

// 2. Pallet Configuration
pub trait Trait: system::Trait { /* --snip-- */ }

// 3. Pallet Events
decl_event! { /* --snip-- */ }

// 4. Pallet Errors
decl_error! { /* --snip-- */ }

// 5. Pallet Storage Items
decl_storage! { /* --snip-- */ }

// 6. Callable Pallet Functions
decl_module! { /* --snip-- */ }