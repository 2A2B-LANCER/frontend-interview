#### 题目一

面值为 1~N 的牌组成一组

每次从组里等概率的抽出 1~N 中的一张

下次抽会换一个新组，共无限组

当累加和 < a 时，一直抽牌

当累加和 >= a 且 < b 时，获胜

当 >= b 时，失败

返回获胜的概率，给定参数 N，a，b



分析：典型从左到右的尝试模型

```javascript
function process(N, sum, min, max){
  if(sum >= min && sum < max){
    return 1
  }
  if(sum >= max){
    return 0
  }
  let res = 0
  for(let i=1; i<=N; i++){
      res += process(N, sum + i, min, max)
  }
  res /= N
  return res
}
```



内部有循环，观察能否优化

假设 N = 4, a = 16, b = 18

如果要求 sum = 2，那就需要

```javascript
(process(3) + process(4) + process(5) + process(6)) / 4
```

如果要求 sum = 3，那就需要

```javascript
(process(4) + process(5) + process(6) + process(7)) / 4
```

其中 process(4) + process(5) + process(6) 是可以被转化为：

```javascript
process(3) * 4 - process(7)
```

所以 sum = 2就变成了

```javascript
(process(3) + process(3) * 4 - process(7)) / 4
```

转化为一般公式：

```javascript
process(i) = (process(i + 1) + process(i + 1) * N - process(i + N + 1)) / N
```

现在就求出了内循环的一般公式，但是边界处不知道是否符合

比如 process(15)

```javascript
process(15) = (process(16) + process(17) + process(18) + process(19)) / 4
process(16) = 1
process(17) = 1
process(18) = 1
process(19) = 0
process(15) = 3 / 4
// 并不等于一般公式结果：5 / 4
```

所以，可以知道边界处并不符合一般公式，而是：

```javascript
process(a - 1) = (b - a) / N
```

那再靠前呢？

```javascript
process(14) = (process(15) + process(16) + process(17) + process(18)) / 4
			= (process(15) + process(15) * 4) / 4
// 虽然没有减去 process(19)，但我们也可以认为减了，因为它是 0，这样的话，可以认为符合一般公式

```

套用以上结果的codeing

```javascript
function process(N, sum, min, max){
  if(sum >= min && sum < max){
    return 1
  }
  if(sum >= max){
    return 0
  }
  if(sum === min - 1){
    return (max - min) / N
  }else{
    return ((N + 1) * process(N, sum + 1, min, max, map) - process(N, sum + N + 1, min, max, map)) / N
  }
}
```



```javascript
// 再加上记忆化搜索，时间复杂度 O(N)
function process(N, sum, min, max, map){
  if(sum >= min && sum < max){
    return 1
  }
  if(sum >= max){
    return 0
  }
  if(map[sum] !== -1){
    return map[sum]
  }
  let res
  if(sum === min - 1){
    res = (max - min) / N
  }else{
    res = ((N + 1) * process(N, sum + 1, min, max, map) - process(N, sum + N + 1, min, max, map)) / N
  }
  map[sum] = res
  return res
}
```

```javascript
// 动态规划
function isWin(N, a, b){
  if(N < 1 || a >= b || a < 0 || b < 0){
    return 0
  }
  if(b - a >= N){
    return 1
  }
  const dp = new Array(a).fill(-1)
  dp[a - 1] = (b - a) / N
  for(let i=a - 2; i>=0; i--){
    dp[i] = (N + 1) * dp[i + 1]
    if(i + N + 1 >= a && i + N + 1 < b){
      dp[i] -= 1
    }else if(i + N + 1 < a){
      dp[i] -= dp[i + N + 1]
    }
    dp[i] /= N
  }
  return dp[0]
}
```



#### 题目二

> https://leetcode-cn.com/problems/super-washing-machines/

分析：贪心

对于每个洗衣机来说，左右两边需要衣服的情况是不确定的

1. 衣服多了，需要向当前洗衣机送衣服
2. 衣服少了，需要向当前洗衣机要衣服
3. 正好，不需要操作

因为每没洗衣机的每步操作只能移动一件衣服，所以如果往当前洗衣机放衣服的时候两边可以同步操作，也就是算作一步；如果往两边放衣服就只能异步操作，步数相加

```javascript
var findMinMoves = function(machines) {
  if(machines.reduce((acc, cur) => acc + cur, 0) % machines.length !== 0){
    return -1
  }
  let prefixSum = new Array(machines.length).fill(0)
  machines.reduce((acc, cur, index) => {
    let sub = acc + cur
    prefixSum[index] = sub
    return sub
  }, 0)
  let max = 0,
      avg  = prefixSum[machines.length - 1] / machines.length,
      right = prefixSum[machines.length - 1] - machines[0] - avg * (machines.length - 1),
      left = prefixSum[machines.length - 1] - machines[machines.length - 1] - avg * (machines.length - 1)
  max = Math.max(Math.abs(left), Math.abs(right))
  for(let i=1; i<machines.length - 1; i++){
    left = prefixSum[i] - machines[i] - avg * i
    right = prefixSum[machines.length - 1] - prefixSum[i] - avg * (machines.length - i - 1)
    if(left < 0 && right < 0){
      max = Math.max(max, Math.abs(left) + Math.abs(right))
    }else{
      max = Math.max(max, Math.abs(left), Math.abs(right))
    }
  }
  return max
};
```





#### 题目三

> https://leetcode-cn.com/problems/scramble-string/submissions/



分析：两个字符串，如果是动态规划，大概率是样本对应模型

那我们就定义递归过程

```javascript
process(s1, s2, l1, l2, len)
```

含义为：以 l1 为起点的 s1 的子串 和 以 l2 为起点的 s2 的子串 是否互为扰乱字符串；是返回 true，否则返回 false

- base case：当 len === 1 的时候
  - s1[l1] === s2[l2]，二者互为扰乱字符串，返回 true
  - s1[l1] !== s2[l2]，返回 false
- 一般情况：
  - 以 l1 ~ l1 + len - 1 内的某点为分割点，将其切割为两个非空子串，然后在 s2 上也切一刀，分割为两个与 s1 子串等长的非空子串，递归比较
  - 只有两段分别互为扰乱字符串才能返回 true



```javascript
// 记忆化搜索
var isScramble = function(s1, s2) {
  if(s1 === s2){
    return true
  }
  let map = new Array(s1.length).fill(0).map(() => new Array(s2.length).fill(0).map(() => new Array(s1.length + 1).fill(0)))
  return process(s1, 0, s2, 0, s2.length, map)
};

function process(s1, l1, s2, l2, len, map){
  if(map[l1][l2][len] !== 0){
    return map[l1][l2][len]
  }
  if(len === 1){
    map[l1][l2][len] = (s1[l1] === s2[l2])
    return s1[l1] === s2[l2]
  }
  for(let i = l1; i < l1 + len - 1; i++){
    let p1 = process(s1, l1, s2, l2, i - l1 + 1, map) && process(s1, i + 1, s2, l2 + i - l1 + 1, len - i + l1 - 1, map),
        p2 = process(s1, l1, s2, l2 + len - i + l1 - 1, i - l1 + 1, map) && process(s1, i + 1, s2, l2, len - i + l1 - 1, map)
    if(p1 || p2){
      map[l1][l2][len] = true
      return true
    }
  }
  map[l1][l2][len] = false
  return false
}
```



#### 题目四

> https://leetcode-cn.com/problems/bricks-falling-when-hit/



分析：并查集

```javascript
var hitBricks = function(grid, hits) {
  let len = hits.length
  for(let i=0; i<len; i++){
    if(grid[hits[i][0]][hits[i][1]] === 1){
      grid[hits[i][0]][hits[i][1]] = 2
    }
  }
  let unionFind = new UnionFind(grid),
      res = new Array(hits.length).fill(0)
  for(let i=hits.length - 1; i>=0; i--){
    if(grid[hits[i][0]][hits[i][1]] === 2){
      grid[hits[i][0]][hits[i][1]] = 1
      res[i] = unionFind.reduction(hits[i][0], hits[i][1])
    }
  }
  return res
};

function UnionFind(matrix){
  this.initData(matrix)
  this.initConnect()
}

UnionFind.prototype.valid = function(x, y){
  return x >= 0 && x < this.row && y >= 0 && y < this.col && this.grid[x][y] === 1
}

UnionFind.prototype.union = function(x1, y1, x2, y2){
  if(!this.valid(x1, y1) || !this.valid(x2, y2)){
    return
  }
  const proxy1 = this.find(x1, y1),
        proxy2 = this.find(x2, y2)
  if(proxy1 !== proxy2){
    let size1 = this.sizeMap[proxy1],
        size2 = this.sizeMap[proxy2],
        status1 = this.cellingSet[proxy1],
        status2 = this.cellingSet[proxy2]
    if(this.sizeMap[proxy1] <= this.sizeMap[proxy2]){
      // 1 并入 2
      this.proxyMap[proxy1] = proxy2
      this.sizeMap[proxy2] += size1
      if(status1 ^ status2){
        this.cellingSet[proxy2] = true
        this.bricksNum += status1 ? size2 : size1
      }
    }else{
      // 2 并入 1
      this.proxyMap[proxy2] = proxy1
      this.sizeMap[proxy1] += size2
      if(status1 ^ status2){
        this.cellingSet[proxy1] = true
        this.bricksNum += status1 ? size2 : size1
      }
    }
  }
}

UnionFind.prototype.find = function(x, y){
  let stack = [],
      index = this.getNum(x, y)
  while(this.proxyMap[index] !== index){
    stack.push(index)
    index = this.proxyMap[index]
  }
  for(let i=0; i<stack.length; i++){
    this.proxyMap[stack[i]] = index
  }
  return index
}

UnionFind.prototype.getNum = function(i, j){
  return i * this.col + j
}

UnionFind.prototype.initData = function(matrix){
  this.row = matrix.length
  this.col = matrix[0].length
  this.proxyMap = new Array(this.row * this.col).fill(0)
  this.sizeMap = new Array(this.row * this.col).fill(0)
  this.bricksNum = 0 // 连到天花板上的砖数
  this.grid = matrix // 原始矩阵
  this.cellingSet = new Array(this.row * this.col).fill(false) // 表示以该节点为头结点的集合是否是天花板集合
  for(let i=0; i<this.row; i++){
    for(let j=0; j<this.col; j++){
      if(matrix[i][j] === 1){
        let num = this.getNum(i, j)
        this.proxyMap[num] = num
        this.sizeMap[num] = 1
        if(i === 0){
          this.cellingSet[num] = true
          this.bricksNum++
        }
      }
    }
  }
}

UnionFind.prototype.initConnect = function(){
  for(let i=0; i<this.row; i++){
    for(let j=0; j<this.col; j++){
      this.union(i, j, i - 1, j)
      this.union(i, j, i + 1, j)
      this.union(i, j, i, j - 1)
      this.union(i, j, i, j + 1)
    }
  }
}

UnionFind.prototype.reduction = function(x, y){
  let num = this.getNum(x, y)
  if(x === 0){
    this.cellingSet[num] = true
    this.bricksNum++
  }
  this.proxyMap[num] = num
  this.sizeMap[num] = 1
  let bricks = this.bricksNum
  this.union(x, y, x - 1, y)
  this.union(x, y, x + 1, y)
  this.union(x, y, x, y - 1)
  this.union(x, y, x, y + 1)
  if(x === 0){
    return this.bricksNum - bricks
  }else{
    return this.bricksNum === bricks ? 0 : this.bricksNum - bricks - 1
  }
}
```

