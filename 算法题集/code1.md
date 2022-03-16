#### 题目一

给定一个有序数组 arr，代表作落在 X 轴上的点

给定一个正数 K，代表绳子的长度

返回绳子最多压中几个点

即使绳子边缘处盖住点也算盖住



分析：

1. 数组有序（单调性）
2. 绳子代表着一个范围

很容易想到滑动窗口

```javascript
// 滑动窗口
function mostPoints(arr, k){
  let len = arr.length,
      left = 0,
      right = 0,
      res = 1
  while(right < len){
    if(arr[right] - arr[left] < k){
      res = Math.max(res, right - left + 1)
      right++
    }else{
      left++
    }
  }
  return res
}
```





```javascript
// 以 i 为 右边界，向前寻找左边界（二分法）
function nearestIndex(arr, right, target){
  let left = 0,
      index = right
  while (left < right){
    let mid = left + ((right - left) >> 1),
        midValue = arr[mid]
    if(midValue < target) {
      left = mid + 1
    }else{
      index = mid
      right = mid
    }
  }
  return index
}

function mostPoints(arr, k){
  let len = arr.length,
      res = 1
  for(let i=0; i<len; i++){
    let nearest = nearestIndex(arr, i, arr[i] - k)
    console.log(nearest, i, k)
    res = Math.max(res, i - nearest + 1)
  }
  return res
}
```



#### 题目二

给定一个文件目录的路径，写一个函数统计这个目录下所有的文件数量并返回，隐藏文件也算，文件夹不算



分析：该题属于多叉树的遍历，深度、广度都可以



#### 题目三

给定一个非负整数 num，如何不用循环语句，返回 >= num，且离 num 最近的，2 的某次方



分析：如果可以使用循环语句的话，如果是 2 的某次方，直接返回，如果不是就返回最高位的 1 再高一位的 2 的某次方

```javascript
// 注意 num 是非负整数，如果是 0 target就是 -1，所以要使用无符号右移才能保证正确
function getTargetNum(num){
  let len = 0
  num--
  while(num){
    len++
    num = num >>> 1
  }
  return 1 << len
}
```

但是不能使用循环语句，那就要把低位全部置换为 1，然后在加 1，就是目标值了，这里要注意如果是 2 的某次方不行，所以开始的时候给 num - 1就没问题了

```javascript
function getTargetNum(num){
  num--
  num |= num >>> 1
  num |= num >>> 2
  num |= num >>> 4
  num |= num >>> 8
  num |= num >>> 16
  num |= num >>> 32
  return num < 0 ? 1 : num + 1
}
```



#### 题目四

一个数组中只有 'G' 和 'B'

想让所有的 G 都放在一侧，所有的 B 都放在另一侧

但是只能在相邻字符之间进行交换操作

返回至少需要交换几次



分析：

G在左边，这样的话如果有一个 G 本来就在另一个G 的右边，但是移动的时候，却跑到了左边，毫无疑问，这是浪费次数的，所以我们就可以想到，所有的 G 按照初始顺序，依次移动到 0, 1, 2, 3...，当 G 都在左边之后，B自然就都在右边了，这样是一种交换次序；

但是，G也可以去右边，B在左边，这样的话，又是一种交换次序

样本不同，这两种的优劣不同，所以要都求出来，取最小值



```javascript
function sortGB(arr){
  let len = arr.length,
      index = 0,
      timesG = 0,
      timesB
  for(let i=0; i<len; i++){
    if(arr[i] === 'G'){
      timesG += i - index
      index++
    }
  }

  index = 0
  for(let i=0; i<len; i++){
    if(arr[i] === 'B'){
      timesB += i - index
      index++
    }
  }
  return Math.max(timesG, timesB)
}
```



#### 题目五

给定一个二维数组 matrix，

可以从任何位置出发，走向上下左右四个方向

返回能走出来的最长的递增链长度

> https://leetcode-cn.com/problems/longest-increasing-path-in-a-matrix/

经典暴力递归转记忆化搜索

```javascript
var getMaxLength = function(matrix, row, col, i, j, dp){
  if(dp[i][j]){
    return dp[i][j]
  }
  let up = 1,
      down = 1,
      left = 1,
      right = 1
  if(i > 0 && matrix[i - 1][j] > matrix[i][j]){
    up += getMaxLength(matrix, row, col, i - 1, j, dp)
  }
  if(i < row - 1 && matrix[i + 1][j] > matrix[i][j]){
    down += getMaxLength(matrix, row, col, i + 1, j, dp)
  }
  if(j > 0 && matrix[i][j - 1] > matrix[i][j]){
    left += getMaxLength(matrix, row, col, i, j - 1, dp)
  }
  if(j < col - 1 && matrix[i][j + 1] > matrix[i][j]){
    right += getMaxLength(matrix, row, col, i, j + 1, dp)
  }
  dp[i][j] = Math.max(up, down, left, right)
  return dp[i][j]
}
var longestIncreasingPath = function(matrix) {
  let row = matrix.length,
      col = matrix[0].length,
      dp = new Array(row).fill(0).map(() => new Array(col).fill(0)),
      max = 0
  for(let i = 0; i<row; i++){
    for(let j=0; j<col; j++){
      const len = getMaxLength(matrix, row, col, i, j, dp)
      max = Math.max(max, len)
    }
  }
  return max
};
```



#### 题目六

给定两个非负数组 x 和 hp，长度都是 N,在给定一个正数 range

x 有序，x[i] 表示 i 号怪兽在 x 轴上的位置

hp[i] 表示 i 号 怪兽的血量

range 表示法师如果站在 x位置，用 AOE 技能打到的范围是：[x - range, x + range]，被打到的每只怪兽损失 1 点血量

返回要把所有怪兽血量清空，至少需要释放多少次 AOE 技能



分析：这道题读完之后，第一反应是贪心，因为很像 最少盏灯照亮街道 那道题

既然如此，就用贪心的策略去尝试几组数据

都对，那大概率就是贪心了

```javascript
function leastAoe(x, hp, range){
  let left = x[0],
      right = x[0] + 2 * range,
      mons = [],
      allTimes = 0
  while(left !== -1){
    // 找到这一轮该更新的位置
    for(let i=0; i<x.length; i++){
      if(x[i] >=left && x[i] <=right){
        mons.push(i)
      }
    }
    // 更新次数
    allTimes += hp[mons[0]]
    // 更新血量
    for(let i=mons.length - 1; i>=0; i--){
      hp[mons[i]] -= hp[mons[0]];
    }
    // 初始化下一轮的范围和怪兽
    mons = []
    let index = hp.findIndex((x) => x > 0)
    left = index === -1 ? -1 : hp[index]
    right = x[index] + 2 * range
  }
  return allTimes
}
```

普通的贪心

每一轮都找到最左侧未打死的怪物的位置，然后以该位置为左边界攻击，然后更新位置和血量，直到所有的怪物血量都小于等于 0



考虑到线段树可以同步更新区间内的值，该题的 hp 更新部分可以用线段树来做，这样时间复杂度可以达到 O(N * log(N))



#### 题目七

给定一个数组 arr，可以在每个数字之前决定 + 或 - 

但是必须所有数字都参与

在给定一个数字 target，请问最后算出 target 的方法数是多少

> https://leetcode-cn.com/problems/target-sum/

```javascript
// 记忆化搜索
var findTargetSumWays = function(nums, target) {
  function process(arr, rest, index, map){
    if(map.has(index) && map.get(index).has(rest)){
      return map.get(index).get(rest)
    }
    if(index === arr.length){
      if(rest === 0){
        return 1
      }else{
        return 0
      }
    }
    let ways1 = process(arr, rest + arr[index], index + 1, map),
        ways2 = process(arr, rest - arr[index], index + 1, map),
        res = ways1 + ways2

    if(!map.has(index)){
      map.set(index, new Map())
    }
    map.get(index).set(rest, res)
    return res
  }
  const dp = new Map()
  return process(nums, target, 0, dp)
};
```

| dp表的形式                      | 执行用时/ms | 内存消耗/MB |
| ------------------------------- | ----------- | ----------- |
| 对象（`${index}_${rest}` 做键） | 1760        | 37.7        |
| Map（`${index}_${rest}` 做键）  | 248         | 46          |
| 双层 Map（看上面代码）          | 124         | 43.3        |

因为这道题 rest 可能是负数，所以不能直接使用二维数组，

根据上面的尝试看来，二维 Map 的常数时间优化最好



优化点：

1. 因为每个数字都有 + 和 - 两种操作，对正数的 + 相当于对负数的 -；对正数的 - 相当于 对 负数的 +；所以可以把 nums 中的所有数字都转换为正数，结果不会受到影响
2. 有了第一步的优化之后，我们又可以做出一个判断：如果目标值大于所有正数的累加和，或者小于所有负数的累加和，那一定不能得到目标值，直接返回 0
3. 一系列数，进行加减操作，最终结果奇偶性不会改变

因为，奇 + 奇 = 偶；奇 + 偶 = 奇；偶 + 偶 = 偶；变换可得

​			奇 - 偶  = 奇；奇 -  奇 = 偶；偶 -  偶 = 偶

所以这道题第一步优化就是运算之前判断所有数之和与目标值的奇偶性是否一致，不一致直接返回 0

4. 现在把 nums 的所有数全都转化为正数，那我们可以对所有的方法做出判断：可以把所有的数字分成两组，一组进行加操作称为 P，一组进行减操作称为 Q

   那么 `sum(P) - sum(Q) = target` 

   两边都加上 `sum(P) + sum(Q)`，即 `sum(nums)`

   得，`2 * sum(P) = target + sum(nums)`

   那就可以得出一个结论，只要 `nums` 的任意 **子序列** 和为 `(target + sum(nums)) / 2`，它就与 一个方法一一对应

   这样，原问题就改变为了经典背包问题

5. 动态规划中的空间压缩技巧（优化空间复杂度）



利用以上优化点，写出下方代码

```javascript
var findTargetSumWays = function(nums, target) {
  let sum = nums.reduce((acc, cur) => acc + cur, 0)
  if((sum & 1) ^ (target & 1) === 1){
    // 3
    return 0
  }
  let arr = nums.map((x) => Math.abs(x))
  sum = arr.reduce((acc, cur) => acc + cur, 0)
  if(sum < target || sum + target < 0){
    // 1, 2
    return 0
  }
  target = (target + sum) >> 1
  // 4, 5
  const len = nums.length,
  dp = new Array(target + 1).fill(0)
  dp[0] = 1
  for(let index = len - 1; index >=0; index--){
    for(let rest = target; rest >= 0; rest--){
      if(rest - nums[index] >= 0){
        dp[rest] += dp[rest - nums[index]]
      }
    }
  }
  return dp[target]
};
```

