# substrate how to add pallet

get the release verion of substrate (https://github.com/paritytech/substrate/releases)

1.find 'Cargo.toml' in substrate root folder, add "frame/vbw" to [workspace]=>members;

2.find 'bin/node/runtime/Cargo.toml'

add "pallet-vbw = { version = "0.0.1-alpha.1", default-features = false, path = "../../../frame/vbw" }" after "[dependencies]"

3.find 'bin/node/runtime/src/lib.rs'

add follow code without any notes.

impl pallet_vbw::Trait for Runtime {
​    type Event = Event;
}

add  in 'construct_runtime' expression

"VBW: pallet_vbw::{Module, Call, Storage, Event<T>},"

4.now,you can run the VBW node with option "--listen-addr" to bind the right IP;

options needed "--ws-external" ,details [https://stackoverflow.com/questions/57753969/kusama-provided-host-header-is-not-whitelisted?r=SearchResults]



# polkadot how to add page

get the release verion of polkadot (https://github.com/polkadot-js/apps/releases/)

1.run "yarn install" in the right folder (install yarn tool first);

2.config the IP binding,find "packages/apps/webpack.base.config.js",find "WebpackPluginServe",add "host"

3.





/usr/bin/node /data/default/node_modules/.bin/webpack --config /data/default/packages/apps/webpack.config.js



http://61.147.107.5/packages/apps/dist/source/save.php