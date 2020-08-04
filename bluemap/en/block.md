# VBW block notes

The basic component of VBW, with the default size of 32m * 32m, represents the position in the world in the form of coordinates [x, y]. This brings great convenience for the management of digital assets. 3D components on each block can be easily copied to other blocks, and the data content does not need to be changed.

The following figure shows the block diagram:

![土地的示意图](../static/block_cn.jpg)



## Content

The content of the block is completely saved in the chain created by substrateand the resources involved are synchronized. In this way, the whole virtual world is completely saved on the chain. These contents are called "digital assets", which can be a well-designed scene or a fun game.

The data structure is as follows:

```
{
	raw: 				Vec<u8>,   			//module data 
	status: 		u32,						//status of block
	elevation: 	u32, 						//elevation of block
	stamp: 			BlockNumber,    //last update blockchain blocknumber
	owner: 			UserID,       	//account
	tenant: 		UserID,     	 	//account
}
```



## Obtain

* By way of world auction, King acquires the block ownership of the whole new VBW world.
* The way of purchase, block transaction between players through purchase.
* The way to pick-up,block in the abandoned state can be directly owned.



## Status

| 状态                    | 值   | 数据类型 | 说明                                     |
| ----------------------- | ---- | -------- | ---------------------------------------- |
| BLOCK_STATUS_OK         | 1    | u32      | normal access                            |
| BLOCK_STATUS_PRIVATE    | 2    | u32      | private，only owner or tenant can access |
| BLOCK_STATUS_GIFT_CHECK | 3    | u32      | need special gift to access              |
| BLOCK_STATUS_ABANDON    | 4    | u32      | anyone can pick up                       |
| BLOCK_STATUS_SELLING    | 5    | u32      | block on sale                            |
| BLOCK_STATUS_RENTING    | 6    | u32      | block on rent                            |

