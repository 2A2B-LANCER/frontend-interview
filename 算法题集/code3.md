#### 题目一

> https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/

给定一个字符串 `s` ，请你找出其中不含有重复字符的 **最长子串** 的长度

分析：

窗口方法的话就是，窗口右边界向右扩展的时候，判断窗口内是否已经有该字符了；如果没有，直接扩展；如果有，更新最长子串，窗口左边界移动至重复字符的下一个位置

```javascript
// 窗口
var lengthOfLongestSubstring = function(s) {
  if(s === ""){
    return 0
  }
  let arr = s.split(''),
      len = arr.length,
      left = 0,
      right = 1,
      maxLength = 1
  while(right <= len){
    if(arr.indexOf(arr[right], left) < right){
      maxLength = Math.max(maxLength, right - left)
      left = arr.indexOf(arr[right], left) + 1
    }
    right++
  }
  return maxLength
};
```



动态规划就是，以每个位置作为子串结尾，向前寻找该字符出现的最后一个位置，这个长度与以上一个字符为结尾的最长无重复子串长度相比，取最小值

```javascript
// 动态规划
var lengthOfLongestSubstring = function(s) {
  if(s === ""){
    return 0
  }
  let len = s.length,
      max = 1
      dp = [-1, -1]
  for(let i=1; i<len; i++){
    let last = s.lastIndexOf(s[i], i-1)
    dp[0] = dp[1]
    if(last === i){
      dp[1] = dp[0]
    }else{
      dp[1] = Math.max(dp[0], last)
    }
    max = Math.max(max, i - dp[1])
  }
  return max
};
```



#### 题目二

只由小写字母 a~z 组成的一批字符串

都放数组 arr 中

如果其中某两个字符串所含有的字符种类完全一样

就将两个字符串算作一类

比如： baacbba 和 bac 就算做一类

返回 arr 中有多少类

分析：26个小写字母，然后只需要统计种类，那么就不需要统计词频，这样的话使用位图来表示一个字符串的字符种类比较合理

 ```javascript
function types(arr){
  const set = new Set(),
        len = arr.length
  for(let i=0; i<len; i++){
    let map = 0,
        str = new Set(arr[i])
    for(const key of str.values()){
      map |= (1 << (key.charCodeAt(0) - 97))
    }
    set.add(map)
  }
  return set.size
}
 ```



#### 题目三

> https://leetcode-cn.com/problems/largest-1-bordered-square/

给你一个由若干 `0` 和 `1` 组成的二维网格 `grid`

请你找出边界全部由 `1` 组成的最大 **正方形** 子网格

返回该子网格中的元素数量。如果不存在，则返回 `0`。



分析：

前置知识：在 N * N 的区域中，矩形和正方形的个数的数量级各是多少？

矩形是 N^4，因为在 N^2 个点中，任意选取一个点的选择的数量级是 N^2，再选一个点，选择的数量级也是 N^2，他们两个组成组成矩形的数量级自然就是 N^4

正方形的话，选一个点有 N^2种选择，然后选择边长，1~N，所以是 N^3

所以如果我们暴力找出所有的正方形，理论上讲时间复杂度是 O(N^3)

题的限制中，二维数组的长宽最大都是 100，如果暴力找出所有正方形，时间复杂度的数量级就是 10^6，如果我们能在 10^2 内验证这个正方形的边界是否全是 1，那应该就能过

如果我们继续暴力验证它的四条边是不是都是 1 的话，时间复杂度应该是 O(N)，算上外层的时间复杂度，整体的时间复杂度是 O(N^4)

```javascript
var largest1BorderedSquare = function(grid) {
  if(!grid.flat().includes(1)){
    return 0
  }
  let row = grid.length,
      col = grid[0].length,
      max = 0
  for(let i=0; i<row; i++){
    for(let j=0; j<col; j++){
      for(let board = 1; board <= Math.min(row - i, col - j); board++){
        let flag = true
        for(let cols = j; cols<j + board; cols++){
          if(grid[i][cols] === 0 || grid[i + board - 1][cols] === 0){
            flag = false
            break
          }
        }
        if(flag){
          for(let rows = i; rows<i + board; rows++){
            if(grid[rows][j] === 0 || grid[rows][j + board - 1] === 0){
              flag = false
              break
            }
          }
        }
        if(flag){
          max = Math.max(max, Math.pow(board, 2))
        }
      }
    }
  }
  return max
};
```

确实能过，但是太暴力了，而且参数如果要求的再大一两个数量级，应该就过不了了

其实判断边界是否全是 1 的过程是可以优化到 O(1) 的，试想如果我们能够提前知道每个点右方有多少个 1；每个点下方有多少个 1 的话，那我们每次只需要判断 左上角，右上角，左下角，三个点，就能知道该正方形是否满足条件了，这就优化到了 O(1)

方法就是预处理数组了，用一张表存储右边有多少个 1；一张表存储下边有多少个 1

怎么生成这两张表呢，动态规划的思想：

1. 右表就从右向左遍历，当前位置是 1 就累加起来，当前位置是 0 就重置为 0
2. 下表从下向上遍历，规则相同

```javascript
// 数据预处理
var setBorderMap = function(matrix){
  let row = matrix.length,
      col = matrix[0].length,
      right = JSON.parse(JSON.stringify(matrix)),
      down = JSON.parse(JSON.stringify(matrix))
  for(let i=0; i<row; i++){
    for(let j=col - 2; j>=0; j--){
      if(right[i][j] === 1){
        right[i][j] += right[i][j + 1]
      }
    }
  }
  for(let j = 0; j<col; j++){
    for(let i = row - 2; i>=0; i--){
      if(down[i][j] === 1){
        down[i][j] += down[i + 1][j]
      }
    }
  }
  return [right, down]
}

var largest1BorderedSquare = function(grid) {
  let row = grid.length,
      col = grid[0].length,
      [rightMap, downMap] = setBorderMap(grid),
      max = 0
  for(let i=0; i<row; i++){
    for(let j=0; j<col; j++){
      for(let board = Math.min(row - i, col - j); board > 0; board--){
        if(board > rightMap[i][j] ||
          board > downMap[i][j] ||
          board > downMap[i][j + board - 1] ||
          board > rightMap[i + board - 1][j]){
          continue;
        }else{
          max = Math.max(max, Math.pow(board, 2))
        }
      }
    }
  }
  return max
};
```



#### 题目四

给定一个数组 arr，代表每个人的能力值。在给定一个非负数 k

如果两个人能力差值正好为 k，那么可以凑在一起比赛

一局比赛只有两个人

返回最多可以同时有多少场比赛



分析：

一个人理论上可以和两种人比赛，比他大，差值为 k；和比他小，差值为 k

现在我们从小到大遍历所有人，并定下这样的选择对手规则：每个人都只能和比自己能力值小或等的对手进行比赛

这样获取对手的时候，每个人都只向一个方向寻找，另一个方向因为在当前选择之前进行选择，所以之前选择者的优先级更高，不会被后来者抢了唯一对手，如果二者都只有唯一对手的话，那最优解也是从二者之中选一个，依然符合规则

```javascript
function mostMatches(arr, k){
  if(k < 0 || !arr || arr.length === 0){
    return 0
  }
  arr.sort((a, b) => a - b)
  let current = 0,
      users = arr.slice(),
      times = 0
  while(current < users.length){
    let target = users[current] - k
    if(![-1, current].includes(users.indexOf(target))){
      times++
      users.splice(current, 1)
      current--
      users.splice(users.indexOf(target), 1)
      current--
    }else{
      current++
    }
  }
  return times
}
```



#### 题目五

给定一个正数数组 arr，代表若干人的体重

在给定一个正数 limit，表示所有船共同拥有的载重量

每艘船最多坐两人，且不能超过载重

想让所有人同时过河，且用最好的分配方法让船尽量少

返回最少的船数



分析：又是凑对，想让船只尽量少的话，就只能让浪费的重量尽量少，也就是说，坐一艘船的两个人体重和尽可能接近 limit：

1. arr 升序排列
2. 小体重指针 left，从左向右移动
3. 大体重指针 right，从右向左移动
4. 如果 `arr[left] + arr[right] <= limit`，船只加一，left + 1，right - 1
5. 如果 `arr[left] + arr[right] > limit`，说明当前这个体重大的人找不到伴了，因为比当前小体重的人体重更小的都已经分配给体重更大的了，所以他只能自己坐一艘船，船只加一，right - 1
6. 直到 left > right，停止，返回船只数量

```javascript
function leastBoats(arr, limit){
  if(!arr || arr.length === 0 || Math.max(...arr) > limit){
    return -1
  }
  let len = arr.length,
      left = 0,
      right = len - 1,
      boatNum = 0
  while(left < right){
    let weight = arr[left] + arr[right]
    if(weight <= limit){
      left++
      right--
      boatNum++
    }else{
      right--
      boatNum++
    }
  }
  if(left === right){
    boatNum++
  }
  return boatNum
}
```



#### 题目六

> https://leetcode-cn.com/problems/closest-subsequence-sum/

给你一个整数数组 nums 和一个目标值 goal 。

你需要从 nums 中选出一个子序列，使子序列元素总和最接近 goal 。也就是说，如果子序列元素和为 sum ，你需要 最小化绝对差 `abs(sum - goal)`

返回 `abs(sum - goal)` 可能的 最小值

注意，数组的子序列是通过移除原始数组中的某些元素（可能全部或无）而形成的数组

- `1 <= nums.length <= 40`
- `-10^7 <= nums[i] <= 10^7`
- `-10^9 <= goal <= 10^9`



分析：很明显，背包问题。但是，数据太大了

暴力递归的话，超时

动态规划的话，表大小会查出内存限制

所以动态规划不对

数组的长度最大才 40，可以考虑分治，分别求子序列的和，然后凑出最接近的结果

```javascript
var minAbs = function(nums, index, end, sum, fill, arr){
  if(index === end){
    arr[fill++] = sum
  }else{
    fill = minAbs(nums, index + 1, end, sum, fill, arr)
    fill = minAbs(nums, index + 1, end, sum + nums[index], fill, arr)
  }
  return fill
}

var minAbsDifference = function(nums, goal) {
  let lMap = new Array(),
      rMap = new Array(),
      res = Infinity,
  le = minAbs(nums, 0, nums.length >> 1, 0, 0, lMap),
  re = minAbs(nums, nums.length >> 1, nums.length, 0, 0, rMap)
  lMap.sort((a, b) => a - b)
  rMap.sort((a, b) => b - a)
  let left = 0,
      right = 0
  while(left < le && right < re){
    let addNum = lMap[left] + rMap[right]
    res = Math.min(res, Math.abs(addNum - goal))
    if(addNum > goal){
      right++
    }else if(addNum < goal){
      left++
    }else{
      return 0
    }
  }
  return res
};
```



#### 题目七

> https://leetcode-cn.com/problems/freedom-trail/

经典动态规划

```javascript
var getLength = function(ring, from, to, direction){
  let len = ring.length,
      location = -1,
      length = 0
  if(direction){
    if(ring.indexOf(to, from) === -1){
      location = ring.indexOf(to)
      length = len - Math.abs(location - from) + 1
    }else{
      location = ring.indexOf(to, from)
      length = location - from + 1
    }
  }else{
    if(ring.lastIndexOf(to, from - 1) === -1){
      location = ring.lastIndexOf(to)
      length = len - Math.abs(location - from) + 1
    }else{
      location = ring.lastIndexOf(to, from - 1)
      length = from - location + 1
    }
  }
  return [location, length]
}

var process = function(ring, key, ringIndex, keyIndex, map){
  if(map[ringIndex][keyIndex] !== -1){
    return map[ringIndex][keyIndex]
  }
  if(keyIndex === key.length){
    return 0
  }
  let target = key[keyIndex],
      [positive, positiveLength] = getLength(ring, ringIndex, target, true),
      [reverse, reverseLength] = getLength(ring, ringIndex, target, false),
      res = 0
  if(positive === reverse){
    res = Math.min(positiveLength, reverseLength) + process(ring, key, positive, keyIndex + 1, map)
  }else{
    let resPositive = positiveLength + process(ring, key, positive, keyIndex + 1, map),
      resReverse = reverseLength + process(ring, key, reverse, keyIndex + 1, map)
    res = Math.min(resPositive, resReverse)
  }
  map[ringIndex][keyIndex] = res
  return res
}

var findRotateSteps = function(ring, key) {
  const map = new Array(ring.length + 1).fill(0).map(() => new Array(key.length + 1).fill(-1))
  return process(ring, key, 0, 0, map)
};
```



#### 题目八

给定三个参数：

二叉树的头结点 head，树上某个节点 target，正数 K

从 target 开始，可以向上走或者向下走

返回与 target  的距离是 K 的所有节点

> https://leetcode-cn.com/problems/all-nodes-distance-k-in-binary-tree/



分析：该树是经典二叉树，没有指向父节点的指针，那我们可以在不改变树的结构的情况下，构建一张父节点表，键为当前节点，值为父节点；这样我们就模拟实现了一张图的结构，然后就可以以 `target` 为出发点，广度优先遍历整张图，直到找到距离为 k 的节点们

```javascript
var setParentMap = function(map, parentNode, curNode){
  // 构建父表
  if(!curNode){
    return
  }
  map.set(curNode, parentNode)
  setParentMap(map, curNode, curNode.left)
  setParentMap(map, curNode, curNode.right)
}

var distanceK = function(root, target, k) {
  const parentMap = new Map(),
        queue = [],
        set = new Set()
  setParentMap(parentMap, null, root)
  // 图的广度优先遍历，需要有标记已走过的节点的表
  queue.push(target)
  set.add(target)
  while(k > 0){
    const len = queue.length
    for(let i=0; i<len; i++){
      const currentNode = queue.shift()
      if(currentNode.left && !set.has(currentNode.left)){
        set.add(currentNode.left)
        queue.push(currentNode.left)
      }
      if(currentNode.right && !set.has(currentNode.right)){
        set.add(currentNode.right)
        queue.push(currentNode.right)
      }
      if(parentMap.get(currentNode) && !set.has(parentMap.get(currentNode))){
        set.add(parentMap.get(currentNode))
        queue.push(parentMap.get(currentNode))
      }
    }
    k--
  }
  return queue.map(x => x.val)
};
```

