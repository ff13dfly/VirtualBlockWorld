#![cfg(test)]

// use super::*;
// use frame_support::{assert_noop, dispatch};
// use sp_core::offchain::{
//     testing::{TestOffchainExt, TestTransactionPoolExt},
//     OffchainExt, OpaquePeerId, TransactionPoolExt,
// };
// use sp_runtime::testing::UintAuthorityId;

//test是多线程的，打印出来不是顺序的
//block的数据块写入测试
#[test]
fn block_test() {
    println!("\ntesting combine block key...");
    let x: u32 = 23;
    let y: u32 = 32;
    let world: u32 = 0;

    let mut key: String = String::from("");
    key += &x.to_string();
    key += "_";
    key += &y.to_string();
    key += "_";
    key += &world.to_string();
    key += "_test";
    println!("key:{}", &key);

    //let fkey=Vblock::get_block_key(x,y,world);

    //println!("\nkey:{},fkey:{}\n", &key,&fkey);

    println!("combine testing done...");
}

#[test]
fn basic_test() {
    let mut n: u32 = 0;
    n += 1;

    //1.循环功能实现样例
    while n < 10 {
        n += 1;
    }
    println!("result:{}", n);

    //2.result类型

    //3.Option类型
}

//基础版本的redis，看看能不能编译过
// #[test]
// fn redis_test() {
//     println!("\ntesting basic redis read and write...");
//     let client = redis::Client::open("redis://127.0.0.1:6379/").unwrap();
//     let mut con = client.get_connection().unwrap();

//     let key = "rust_redis";
//     redis::cmd("SET").arg(key).arg(42).execute(&mut con);
//     let val: i32 = redis::cmd("GET").arg(key).query::<i32>(&mut con).unwrap();
//     println!("\nResult:{}\n", val);
//     println!("testing done...");
// }

//引入redis的测试，通过了，可以用redis来保存数据了
/*#[test]
fn simple_redis() -> Result<(), simple_redis::RedisError> {
    let mut clients = simple_redis::create("redis://127.0.0.1:6379/0")?;		//?表示必须返回Result值
    let aa="hello";

    let bb=clients.set("rust_key", aa);
    let str_val = clients.get::<String>("rust_key");

        //处理redis结果的方法
    match &str_val {		//这里得借用，不然最后就打印不出来了，会报错
        //Ok(vv)		=> println!("\nstring:{}\n", vv)
        Ok(vv)		=> assert_eq!(vv,aa),			//从result里解包出来之后，就可以比较了
        Err(error)	=> println!("error:{}", error)
    }

    println!("\nResult:{:?},String:{:?}\n",bb,str_val);
    Ok(())
}*/
