// This file is part of VBW.

// Copyright (C) 2020 Fuu.
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


const MAX_X: u32 = 2048;    //x coordinate limit
const MAX_Y: u32 = 2048;    //y coordinate limit
const MAX_RANGE: u32 = 10;  //range extention limit

#[derive(Clone, Eq, PartialEq, Default)]
pub struct BlockModule {
	
}

impl BlockModule {
    #[allow(dead_code)]
    pub fn check_range(x: u32, y: u32, dx: u32, dy: u32) -> bool {
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
}