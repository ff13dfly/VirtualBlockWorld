# substrate how to add pallet

The best way to add vbw to substrate is following the official example
frame/example/
frame/example-offchain-worker/
frame/example-parallel
## substrate version 3.0.0

Need to check the version of dependencies.
## substrate versoin 2.0.0.rc5
get the release verion of substrate (https://github.com/paritytech/substrate/releases)

1.find 'Cargo.toml' in substrate root folder, add "frame/vbw" to [workspace]=>members;

2.find 'bin/node/runtime/Cargo.toml'

add "pallet-vbw = { version = "0.0.1-alpha.1", default-features = false, path = "../../../frame/vbw" }" after "[dependencies]"

3.find 'bin/node/runtime/src/lib.rs'

add follow code without any notes.

`impl pallet_vbw::Trait for Runtime {
​    type Event = Event;
}`

add  in 'construct_runtime' expression

"VBW: pallet_vbw::{Module, Call, Storage, Event<T>},"

4.now,you can run the VBW node with option "--listen-addr" to bind the right IP;

options needed "--ws-external" ,details [https://stackoverflow.com/questions/57753969/kusama-provided-host-header-is-not-whitelisted?r=SearchResults]

5.run the folllow command to run substrate node:
`cargo run --bin substrate  --  --dev  -d ~/Desktop/www/vbw/db --offchain-worker --execution=NativeElseWasm`



# polkadot how to add page

## polkadot version 0.86.2
## polkadot version 0.49.1
get the release verion of polkadot (https://github.com/polkadot-js/apps/releases/)

1.run "yarn install" in the right folder (install yarn tool first);

2.config the IP binding,find "packages/apps/webpack.base.config.js",find "WebpackPluginServe",add "host"

3.find 'packages/app-routing/src/'
add 'vbw.ts' and 'resource.ts'

4.find 'packages/app-routing/src/index.ts'
add the follow code
`import resource from './resource';
import vbw from './vbw';`

5.add pages to the side-menu

6.install packages needed as follow : dat.gui,jszip,lrz,react-cropper

npm install --save jquery
npm install --save dat.gui
npm install --save jszip
npm install --save lrz
npm install --save react-cropper

/usr/bin/node /data/default/node_modules/.bin/webpack --config /data/default/packages/apps/webpack.config.js

http://61.147.107.5/packages/apps/dist/source/save.php



# Substrate compile problems

* failed to select a version for the requirement `wabt = "^0.9.2"`. Modify the version to `"0.9.1"`
* 

