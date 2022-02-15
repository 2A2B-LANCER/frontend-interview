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

思路是：

1. 从第一个岛出发，BFS填充 每个格到第一个岛的距离 + 1
2. 从第二个岛出发，BFS填充 每个格到第二个岛的距离 + 1
3. 将每个格到第一、二个岛的距离加起来 - 3，最小值就是答案

```javascript
var shortestBridge = function(grid) {
  let row = grid.length,
      col = grid[0].length,
      curs = [],
      nexts = [],
      fromIsland1 = new Array(row * col).fill(0),
      fromIsland2 = new Array(row * col).fill(0)
  for(let i=0; i<row; i++) {
    for(let j=0; j<col; j++) {
      if(!fromIsland1.includes(0) && !fromIsland2.includes(0)){
        return getRes(fromIsland1, fromIsland2)
      }
      let thisIsland = fromIsland1.includes(0) ? fromIsland1 : fromIsland2
      infect(grid, i, j, curs, thisIsland)
      while(curs.length !== 0){
        bfs(curs, nexts, col, thisIsland)
        curs = nexts
        nexts = []
      }
    }
  }
  return getRes(fromIsland1, fromIsland2)
};

function getRes(island1, island2) {
  let min = Infinity,
      len = island1.length
  for(let i = 0; i < len; i++){
    min = Math.min(min, island1[i] + island2[i] - 3)
  }
  return min
}

function infect(grid, x, y, curs, thisIsland){
  if(x >= grid.length || x < 0 || y >= grid[0].length || y < 0 || grid[x][y] !== 1){
    return
  }
  grid[x][y] = -1
  let index = x * grid[0].length + y
  curs.push(index)
  thisIsland[index] = 1
  infect(grid, x - 1, y, curs, thisIsland)
  infect(grid, x + 1, y, curs, thisIsland)
  infect(grid, x, y - 1, curs, thisIsland)
  infect(grid, x, y + 1, curs, thisIsland)
}

function bfs(curs, nexts, col, thisIsland) {
  for(let i = 0; i < curs.length; i++) {
    if(curs[i] % col !== 0 && thisIsland[curs[i] - 1] === 0){
      thisIsland[curs[i] - 1] = thisIsland[curs[i]] + 1
      nexts.push(curs[i] - 1)
    }
    if(curs[i] % col !== col - 1 && thisIsland[curs[i] + 1] === 0){
      thisIsland[curs[i] + 1] = thisIsland[curs[i]] + 1
      nexts.push(curs[i] + 1)
    }
    if(curs[i] >= col && thisIsland[curs[i] - col] === 0){
      thisIsland[curs[i] - col] = thisIsland[curs[i]] + 1
      nexts.push(curs[i] - col)
    }
    if(curs[i] + col < thisIsland.length && thisIsland[curs[i] + col] === 0){
      thisIsland[curs[i] + col] = thisIsland[curs[i]] + 1
      nexts.push(curs[i] + col)
    }
  }
}
```



#### 题目三

> https://www.nowcoder.com/questionTerminal/8ecfe02124674e908b2aae65aad4efdf?f=discussion

一去一回，获得最大路径和，但是走过的点，再走是没有收获的

所以就把这个过程等同为：两个人同时从起点往终点走，如果在同一个点，只加一次，二者同时移动，那肯定会同时到达终点，求这个最大路径和

```javascript
function getMax(matrix, x1, y1, x2, y2, dp){
  if(x1 >= matrix.length ||
     x2 >= matrix.length ||
     y1 >= matrix[0].length ||
     y2 >= matrix[0].length){
    return -Infinity
  }
  if(dp[x1][y1][x2] !== -1){
    return dp[x1][y1][x2]
  }
  if(x1 === matrix.length - 1 && y1 === matrix[0].length - 1){
    dp[x1][y1][x2] = matrix[x1][y1]
    return matrix[x1][y1]
  }
  let res = matrix[x1][y1]
  if(x1 !== x2 || y1 !== y2){
    res += matrix[x2][y2]
  }
  let p1 = getMax(matrix, x1 + 1, y1, x2 + 1, y2, dp),
      p2 = getMax(matrix, x1, y1 + 1, x2, y2 + 1, dp),
      p3 = getMax(matrix, x1 + 1, y1, x2, y2 + 1, dp),
      p4 = getMax(matrix, x1, y1 + 1, x2 + 1, y2, dp)
  res += Math.max(p1, p2, p3, p4)
  dp[x1][y1][x2] = res
  return res
}

function getMaxSum(matrix){
  if(matrix.length === 0 || matrix[0].length === 0){
    return 0
  }
  let n = matrix.length,
      m = matrix[0].length
  let dp = new Array(n).fill(0).map(() => new Array(m).fill(0).map(() => new Array(n).fill(-1)))
  getMax(matrix, 0, 0, 0, 0, dp)
  
  return dp[0][0][0]
}
```



#### 题目四

> https://www.nowcoder.com/practice/7201cacf73e7495aa5f88b223bbbf6d1

大根堆