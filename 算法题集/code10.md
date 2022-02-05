#### 题目一

> https://leetcode-cn.com/problems/jump-game-ii/



```javascript
// 动态规划，内部有循环，时间复杂度 O(N^2)
var jump = function(nums) {
  let len = nums.length,
      dp = new Array(len).fill(Infinity)
  dp[len - 1] = 0
  for(let index = len - 2; index >= 0; index--){
    let maxJump = nums[index],
        bu = 1
    while(bu + index < len && bu <= maxJump){
      dp[index] = Math.min(dp[index], 1 + dp[index + bu])
      bu++
    }
  }
  return dp[0]
};
```



```javascript
// 状态递推，我认为也属于动态规划，时间复杂度 O(N)
/**
 * step：表示能走到 i 的最少步数
 * right：表示 step 步能走到的最右侧
 * next：表示 到 i 为止，step + 1 步能走到的最右侧
 */
var jump = function(nums) {
  let len = nums.length,
      step = 0,
      right = 0,
      next = nums[0]
  for(let i=0; i<len; i++){
    if(right < i){
      step++
      right = next
    }
    next = Math.max(next, i + nums[i])
  }
  return step
};
```



**贪心不行，比如 [5,2,15,1,4]**



#### 题目二

> https://leetcode-cn.com/problems/k-inverse-pairs-array/



```javascript
// 动态规划
var kInversePairs = function(n, k) {
  const MOD = 1000000007
  let dp = new Array(n + 1).fill(0).map(() => new Array(k + 1).fill(0))
  dp[0][0] = 1
  for(let i = 1; i<=n; i++){
    dp[i][0] = 1
    for(let j=1; j<=k; j++){
      dp[i][j] = (dp[i - 1][j] + dp[i][j - 1]) % MOD
      if(i <= j){
        dp[i][j] = (dp[i][j] - dp[i - 1][j - i] + MOD) % MOD
      }
    }
  }
  return dp[n][k]
};
```



#### 题目三

> https://leetcode-cn.com/problems/convert-binary-search-tree-to-sorted-doubly-linked-list/submissions/



```javascript
// 二叉树的递归套路
function dfs(node){
  if(!node){
    return {
      head: null,
      tail: null
    }
  }
  let left = dfs(node.left),
      right = dfs(node.right),
      res = {
        head: node,
        tail: node
      }
  if(left.tail){
    left.tail.right = node
    node.left = left.tail
  }
  if(left.head){
    res.head = left.head
  }
  if(right.head){
    node.right = right.head
    right.head.left = node
  }
  if(right.tail){
    res.tail = right.tail
  }
  return res
}
var treeToDoublyList = function(root) {
    if(!root){
      return null
    }
    let info = dfs(root)
    info.head.left = info.tail
    info.tail.right = info.head
    return info.head
};
```



#### 题目四

> https://leetcode-cn.com/problems/boolean-evaluation-lcci/

分析：范围尝试模型

因为这个表达式是有效的，所以字符串中偶数位必然是数字，奇数位必然是符号，且以数字开头结尾

那我们就定义递归过程：

```javascript
process(str, left, right)
```

返回 left~right 的表达式，true有多少种情况，false有多少种情况

单次递归内有循环过程

```javascript
for(let i = left + 1; i < right; i += 2){
    
}
```

第 i 位必然是符号位，以 i 为分割点，左边一个子式，右边一个子式，分别调用递归函数

```javascript
L = process(str, left, i - 1)
R = process(str, i + 1, right)
```

然后根据 i 的符号种类，分别求出 left~right 的式子，true有多少种情况，false有多少种情况

```javascript
if(str[i] === '|'){
    res[0] += L[0] * R[0] + L[0] * R[1] + L[1] * R[0]
    res[1] += L[1] * R[1]
}
if(str[i] === '&'){
    res[0] += L[0] * R[0]
    res[1] += L[0] * R[1] + L[1] * R[0] + L[1] * R[1]
}
if(str[i] === '^'){
    res[0] += L[0] * R[1] + L[1] * R[0]
    res[1] += L[0] * R[0] + L[1] * R[1]
}
```

即可求出答案



```javascript
// 暴力递归转记忆化搜索
function process(str, left, right, dp){
  if(dp[left][right]){
    return dp[left][right]
  }
  if(left === right){
    if(str[left] === '0'){
      return [0, 1]
    }else{
      return [1, 0]
    }
  }
  let res = [0, 0]
  for(let i = left + 1; i < right; i += 2){
    let L = process(str, left, i - 1, dp),
        R = process(str, i + 1, right, dp)
    if(str[i] === '|'){
      res[0] += L[0] * R[0] + L[0] * R[1] + L[1] * R[0]
      res[1] += L[1] * R[1]
    }
    if(str[i] === '&'){
      res[0] += L[0] * R[0]
      res[1] += L[0] * R[1] + L[1] * R[0] + L[1] * R[1]
    }
    if(str[i] === '^'){
      res[0] += L[0] * R[1] + L[1] * R[0]
      res[1] += L[0] * R[0] + L[1] * R[1]
    }
  }
  dp[left][right] = res
  return res
}

var countEval = function(s, result) {
  let dp = new Array(s.length).fill(0).map(() => new Array(s.length).fill(0))
  let res = process(s, 0, s.length - 1, dp)
  if(result){
    return res[0]
  }else{
    return res[1]
  }
};
```

