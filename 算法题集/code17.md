#### 题目一

给定一个每一行都有序、每一列也有序，整体可能无序的二维数组，在给定一个数 num，返回二维数组中有没有 num 这个数

> https://leetcode-cn.com/problems/sorted-matrix-search-lcci/

分析：因为在该数组中每一行每一列都是升序排列，那对于一个数字来说，它左边的都小于等于它，下边的都大于等于它，这时候，就出现了单调性，如果我们规定：只能朝左和下走，就可以做到全局单调

```javascript
// 时间复杂度 O(n + m)
var searchMatrix = function(matrix, target) {
  if(matrix.length === 0 || matrix[0].length === 0){
    return false
  }
  let row = matrix.length,
      col = matrix[0].length,
      x = 0,
      y = col - 1
  while(x < row && y >= 0){
    
    if(matrix[x][y] < target){
      x++
    }else if(matrix[x][y] > target){
      y--
    }else{
      return true
    }
  }
  return false
};
```



#### 题目二

给定一个每一行都有序、每一列也有序，整体可能无序的二维数组，在给定一个数 正数 k

返回二维数组中最小的第 k 个数

> https://leetcode-cn.com/problems/kth-smallest-element-in-a-sorted-matrix/

分析：二分法

```javascript
// 时间复杂度 O((2 * n) * log(n))
function noMoreNum(matrix, near){
  // near：数组的 小于等于near的数字中 最接近 near 的数字
  // num: near 是排序后的第 几 小
  let x = 0,
      y = matrix.length - 1,
      num = 0
  while(x < matrix.length && y >= 0){
    if(matrix[x][y] <= near){
      // 只有当前数字是小于等于 near 的，它以及比它小的数字才能算入 num
      num += y + 1
      near = Math.max(near, matrix[x][y])
      x++
    }else{
      y--
    }
  }
  return {
    num,
    near
  }
}

var kthSmallest = function(matrix, k) {
  let len = matrix.length,
      left = matrix[0][0],
      right = matrix[len - 1][len - 1],
      res = 0
  while(left <= right){
    let mid = left + ((right - left) >> 1),
        info = noMoreNum(matrix, mid)
    if(info.num < k){
      left = mid + 1
    }else{
      // info.num > k 和 === k 算在一起是因为数字有可能出现多次，这时候只会计算出它的最大次序
      res = info.near
      right = mid - 1
    }
  }
  return res
};
```



#### 题目三

> https://leetcode-cn.com/problems/palindrome-pairs/



#### 题目四

给定两个字符串 S 和 T

返回 S 的所有子序列中

有多少个子序列的字面值等于 T

> https://leetcode-cn.com/problems/21dk04/

分析：经典样本对应模型

定义 `dp[i][j]`：含义为 S 的 0~i 的子序列中 T 的 0~j 出现的个数



```javascript
var numDistinct = function(s, t) {
  let sL = s.length,
      tL = t.length,
      dp = new Array(sL).fill(0).map(() => new Array(tL).fill(0))
  if(s[0] === t[0]){
    // 初始化，只有 二者的第一个字符相同的时候才能是 1
    dp[0][0] = 1
  }
  for(let i = 1; i < sL; i++){
  	// 只要 s[i] === t[0]，那么 s 的 0~i 上就多出了一个 匹配 t 的 0~0 的次数，否则就和 0~i - 1 一样 
    dp[i][0] = dp[i - 1][0]
    if(s[i] === t[0]){
      dp[i][0] += 1
    }
  }
  for(let i = 1; i< sL; i++){
    for(let j = 1; j <= Math.min(i, tL - 1); j++){
      // t 的子串比 s 的子串长是没有意义的
      // 1. s[i] 不参与匹配
      dp[i][j] = dp[i - 1][j]
      if(s[i] === t[j]){
        // 2. s[i] 参与匹配
        dp[i][j] += dp[i - 1][j - 1]
      }
    }
  }
  return dp[sL - 1][tL - 1]
};
```



#### 题目五

给定一个字符串 str

返回 str 的所有子序列中有多少不同的字面值

> https://leetcode-cn.com/problems/distinct-subsequences-ii/

分析：

当字符没有重复的时候，比如 'abc'

```javascript
// 初始位置，子序列中只有一个空串
[""]
// 指针走到 s[0]，'a' 之前没出现过，那之前的子序列再在末尾加上一个 'a' 产生的子序列都是新的
[""] + ["a"]
// 指针走到 s[1]，'b' 没出现过，同理
["", "a"] + ["b", "ab"]
// 指针走到 s[2]，'c' 没出现过，同理
["", "a", "b", "ab"] + ["c", "ac", "bc", "abc"]

// 子序列的个数是 1 -> 2 -> 4 -> 8
// 很明显 2^(字符个数)
```



当字符有重复之后，比如 'aaa'

```javascript
// 初始位置，子序列中只有一个空串
[""]
// 指针走到 s[0]，'a' 之前没出现过，那之前的子序列再在末尾加上一个 'a' 产生的子序列都是新的
[""] + ["a"]
// 指针走到 s[1]，'a' 之前出现过了
["", "a"] + ["a", "aa"] - ["a"]
// 指针走到 s[2], 'a' 之前出现过两次了
["", "a", "aa"] + ["a", "aa", "aaa"] - ["a", "aa"]

// 子序列的个数是 1 -> 2 -> 3 -> 4
//可以看到是有重复的
// 分析一下
```



```javascript
var distinctSubseqII = function(s) {
  const REMAINDER = 1000000007,
        dp = new Array(s.length + 1).fill(0),
        map = new Map()
  dp[0] = 1
  for(let i = 1; i <= s.length; i++){
    dp[i] = (dp[i - 1] * 2) % REMAINDER
    if(!map.has(s[i - 1])){
      map.set(s[i - 1], (dp[i] - dp[i - 1]) % REMAINDER)
    }else{
      // 用 Map 来s[i - 1]存储上一次出现之后，再次出现会重复的子序列个数
      let last = map.get(s[i - 1])
      dp[i] = (dp[i] + REMAINDER - last) % REMAINDER
      map.set(s[i - 1], (last + dp[i] - dp[i - 1]) % REMAINDER)
    }
  }
  return dp[s.length] - 1
};

// 优化一下代码结构
var distinctSubseqII = function(s) {
  const REMAINDER = 1000000007,
        map = new Array(26).fill(0)
  let dp = 1
  for(let i = 1; i <= s.length; i++){
    let lastDp = dp,
        index = s.charCodeAt(i - 1) - 'a'.charCodeAt(0),
        last = map[index]
    dp = (lastDp * 2 + REMAINDER - last) % REMAINDER
    map[index] = (last + dp + REMAINDER - lastDp) % REMAINDER
  }
  return dp - 1
};
```

