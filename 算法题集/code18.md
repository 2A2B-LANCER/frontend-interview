#### 题目一

给定一个数组 arr，长度为 N，arr 中的值只有 1,2,3 三种

arr[i] === 1，代表汉诺塔问题中，从上往下第 i 个圆盘目前在左

arr[i] === 2，代表汉诺塔问题中，从上往下第 i 个圆盘目前在中

arr[i] === 3，代表汉诺塔问题中，从上往下第 i 个圆盘目前在右

那么 arr 整体就代表汉诺塔游戏过程中的一个状况

如果这个状况不是汉诺塔最优解运动过程中的状况，返回 -1

如果这个状况是汉诺塔最优解运动过程中的状况，返回它是第几个状况



```javascript
function isValid(arr){
  return process(arr, arr.length - 1, 1, 3, 2)
}
/**
 * 0~index 的汉诺塔在 arr 的情况下，已经走了多少步
 */
function process(arr, index, from, to, help){
  if(index === -1){
    return 0
  }
  if(arr[index] === help){
    return -1
  }
  // 挪动圆盘分三个过程
  // 1. 0~i - 1 从 form 挪到 help（总共 ((2 ^ i) - 1) 步，已经走了若干步 ）
  // 2. 第 i 个从 form 挪到 to（总共 1 步）
  // 3. 0~i - 1 从 help 挪到 to（总共 (2 ^ (i - 1)) 步，已经走了若干步)
  // 三个过程总共 ((2^ i) - 1)
  if(arr[index] === from){
    // index 还在 from，打算挪到目标位置，那就需要把 i - 1 个圆盘挪到辅助位置
    // 也就是说，现在已经走了多少步，取决于 第一大步，走了多少步
    return process(arr, index - 1, from, help, to)
  }else{
    // index 已经在 to 了，说明第一、二大步已经走完了，第三大步走了多少步不知道
    let p1 = (1 << index) - 1,
        p2 = 1,
        p3 = process(arr, index - 1, help, to, from)
    if(p3 === -1){
      return -1
    }else{
      return p1 + p2 + p3
    }
  }
  
}
```

```javascript
// 循环版本
function isValid(arr){
  let from = 1,
      help = 2,
      to = 3,
      steps = 0,
      index = arr.length - 1
  while(index >= 0){
    if(arr[i] === help){
      return -1
    }
    if(arr[i] === from){
      [to, help] = [help, to]
    }else{
      steps += 1 << index;
      [from, help] = [help, from]
    }
    index--
  }
  return steps
}
```



#### 题目二

> https://leetcode-cn.com/problems/shortest-bridge/

