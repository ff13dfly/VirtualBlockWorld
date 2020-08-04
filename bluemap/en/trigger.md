# Module trigger



## Function

* Basic component, realize event trigger, create game logic.

* Distribute gifts.

  


## Definition

### Version : 2020

* Data struct : `[ size(X,Y,Z) , position(X,Y,Z) , hold-time , [player-in event , player-out event , player-hold event ] ]`

* Sample : `[[3,0.2,3],[12,6,1.5],[0,0,0],100,[[Vec<u8>,1,3],[],[]]]`

  


### Event

| Definition  | Value | Memo                                        |
| ----------- | ----- | ------------------------------------------- |
| PLAYER_IN   | 0     | event triggered when player move in         |
| PLAYER_OUT  | 1     | event triggered when player move out        |
| PLAYER_HOLD | 2     | event triggered when player hold in trigger |



### Action

| Definition         | Value | Memo                     | More                                                  |
| ------------------ | ----- | ------------------------ | ----------------------------------------------------- |
| ACTION_INFORMATION | 1     | Show an info dialog      | [ info ,how to show , show time]                      |
| ACTION_TRANSFER    | 2     | transfer to target block | [ world ID , X  , Y , X offset , Y offset , gift id ] |
| ACTION_GIFT        | 3     | Distribute gifts         | []                                                    |



## Roadmap

| Notes        | Deadline | Developer | GitHub |
| :------: | :------: | :----: | :------: |
| Data storage on substrate |          |        |          |
| trigger events |          |        |          |
| trigger data encryption | | | |

