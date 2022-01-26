#### 题目一

> https://leetcode-cn.com/problems/construct-binary-search-tree-from-preorder-traversal/



```javascript
// 单调栈优化查询右侧第一个大于自己的位置，降低时间复杂度
var process = function(arr, left, right, nearBig){
    if(left > right){
        return null
    }
    let node = new TreeNode(arr[left]),
        end = nearBig[left]
    node.left = process(arr, left + 1, end - 1, nearBig)
    node.right = process(arr, end, right, nearBig)
    return node
}
var bstFromPreorder = function(preorder) {
    let nearBig = new Array(preorder.length).fill(preorder.length),
        stack = []
    for(let i=0; i<preorder.length; i++){
        while(stack.length > 0 && preorder[stack[stack.length - 1]] < preorder[i]){
            nearBig[stack.pop()] = i
        }
        stack.push(i)
    }
    stack = null
    return process(preorder, 0, preorder.length - 1, nearBig)
};
```



#### 题目二

编辑距离问题

> https://leetcode-cn.com/problems/edit-distance/



分析：

样本对应模型

`dp[i][j]` 表示 i 长度的 str1 转换成 j 长度的 str2 的最小代价

base case：

1. 0 长度的 str1 转换 j 长度的 str2，只能添加 j 次
2. i 长度的 str1 转换 0 长度的 str1，只能删除 i 次

一般情况：

1. i 长度的 str1 转换成 j 长度的 str2，通过 i 长度的 str1 转换成 j - 1 长度的 str2，然后添加一个字符（`dp[i][j - 1] + 插入代价`）
2. i 长度的 str1 转换成 j 长度的 str2，通过 i - 1 长度的 str1 转换成 j 长度的 str2，然后删除一个字符（`dp[i - 1][j] + 删除代价`）
3. 如果 i 长度的 str1 的最后一个字符 等于 j 长度的 str2 的最后一个字符，那么 i 长度的 str1 转换成 j 长度的 str2，通过 i - 1 长度的 str1 转换成 j - 1 长度的 str2（`dp[i - 1][j - 1]`）
4. 如果 i 长度的 str1 的最后一个字符 不等于 j 长度的 str2 的最后一个字符，那么 i 长度的 str1 转换成 j 长度的 str2，通过 i - 1 长度的 str1 转换成 j - 1 长度的 str2，然后替换一个字符（`dp[i - 1][j - 1] + 替换代价`）

```javascript
var minDistance = function(word1, word2) {
  let len1 = word1.length,
      len2 = word2.length,
      dp = new Array(len1 + 1).fill(0).map(() => new Array(len2 + 1).fill(0))
  for(let i=0; i<=len2; i++){
    dp[0][i] = i
  }
  for(let i=0; i<=len1; i++){
    dp[i][0] = i
  }
  for(let i=1; i<=len1; i++){
    for(let j=1; j<=len2; j++){
      let p1 = dp[i - 1][j] + 1,
          p2 = dp[i][j - 1] + 1,
          p3 = Infinity
      if(word1[i - 1] === word2[j - 1]){
        p3 = dp[i - 1][j - 1]
      }else{
        p3 = dp[i - 1][j - 1] + 1
      }
      dp[i][j] = Math.min(p1, p2, p3)
    }
  }
  return dp[len1][len2]
};
```



#### 题目三

给定两个字符串 s1 和 s2，问 s2 最少删除多少字符可以成为 s1 的子串？

比如 s1 = "abcde"，s2 = "axbc"



第一问：s2 长度远小于 s1 怎么做？

解法：生成 s2的所有子序列，按照长度降序排列，用 KMP 去匹配 s2 的子串 和 s1，第一个匹配成功的就是答案（时间复杂度 O(2^M * N)）

```javascript
function getNextArray(arr){
  if(arr.length === 1){
    return [-1]
  }
  const len = arr.length,
        next = new Array(len)
  next[0] = -1
  next[1] = 0
  let i = 2,	// 当前要填充的索引
      cn = 0	// 要判断和前一个元素是否相等的某一个前缀和末尾元素的索引
  while(i < len){
    if(arr[i - 1] === arr[cn]){
      // 找到了相等的索引，填充进 next 数组
      // 因为索引是从 0 开始的，所以元素个数得 + 1
      // 下一轮循环的时候
      next[i++] = ++cn
    }else if(cn > 0){
      
      cn = next[cn]
    }else{
      next[i++] = 0
    }
  }
  return next
}

function kmp(s1, s2){
  if(!s1 || !s2 || s1.length < s2.length || s2.length < 1){
    // s1、s2不存在的时候无效；s1 的长度小于 s2 的长度无效；s2 为空串无效
    return -1
  }
  const str1 = s1.split(''),
        len1 = str1.length,
        str2 = s2.split(''),
        len2 = str2.length,
        // 求出 s2 的 next 数组
        next = getNextArray(str2)
  let point1 = 0,
      point2 = 0
  while(point1 < len1 && point2 < len2){
    // O(N)
    if(str1[point1] === str2[point2]){
      // 当前的字符相同，进入下一循环
      point1++
      point2++
    }else if(point2 === 0){
      // 当前字符不同，且 s2已经回退到首字符，说明 s1 当前字符不行，s1 进入下一字符
      point1++
    }else{
      // 当前字符不同，s2 回退
      point2 = next[point2]
    }
  }
  // 如果 s2 全部遍历一遍，说明 s1 有 s2 的子串，开头处就是 point1 - point2，否则没有，返回 -1
  return point2 === len2 ? point1 - point2 : -1
}

function process(str, index, sub, arr){
  if(str.length === index){
    arr.push(sub)
  }
  process(str, index + 1, sub + str[index], arr)
  process(str, index + 1, sub, arr)
}

function minCost(s1, s2){
  let subsOfS2 = []
  process(s2, 0, "", subsOfS2)
  subsOfS2.sort((a, b) => b.length - a.length)
  for(let i=0; i<subsOfS2.length; i++){
    if(kmp(s1, subsOfS2[i]) !== -1){
      return s2.length - subsOfS2[i].length
    }
  }
  return s2.length
}
```



第二问：s2 的长度很大怎么做？

解法： M 很大的时候，上面的解法就不适合了，所以就要换一种形式，根据题目二的编辑距离问题，如果我们对 s1 的所有子串都尝试 s2能否只通过删除操作生成；s1 的子串的数量级是 N^2，每一个都用动态规划，那时间复杂度就是 O(N^2 * N * M)，当 M 很大的时候，明显性能比上面的方法好



```javascript
/**
 * x 字符串最少删除几个字符能变为 y 字符串
 */
function onlyDel(x, y){
  if(x.length < y.length){
    return Infinity
  }
  // dp[i][j] 的含义是：x 的 0 ~ i - 1 最少删除几个字符能变为 y 的 0 ~ j - 1
  // 同理，当 i < j 的时候是无意义的，所以全部初始化为 Infinity
  const dp = new Array(x.length + 1).fill(0).map(() => new Array(y.length + 1).fill(Infinity))
  for(let i = 0; i <= x.length; i++){
    // x 的 0 ~ i - 1 变成 y 的 0 ~ 0，即空字符串，只能全部删完
    dp[i][0] = i
  }
  for(let j = 1; j <= y.length; j++){
    for(let i = j; i <= x.length; i++){
      let p1 = dp[i - 1][j] + 1,
          p2 = Infinity
      if(x[i - 1] === y[j - 1]){
        p2 = dp[i - 1][j - 1]
      }
      dp[i][j] = Math.min(p1, p2)
    }
  }
  return dp[x.length][y.length]
}
```



```javascript
// 该方法对动态规划的过程做了优化，时间复杂度为 O(N^2 * M)
function minCost(s1, s2){
  let dp = new Array(s1.length).fill(0).map(() => new Array(s2.length).fill(Infinity)),
      res = s2.length
  for(let start = 0; start < s1.length; start++){
    // 判断以 start为开头的 s1 的子串能否由 s2 删除得来
    dp[0][start] = s2[0] === s1[start] ? 0 : Infinity
    for(let i=1; i<s2.length; i++){
      // 如果 s2[i] === s1[start] 或者 i 之前有值 === s1[start] 那就最少删掉 i 个字符才能得到这一个
      dp[i][start] = (s2[i] === s1[start] || dp[i - 1][start] !== Infinity) ? i : Infinity
    }
    res = Math.min(res, dp[s2.length - 1][start])
    for(let end = start + 1; end < Math.min(s1.length, s2.length + start); end++){
      let first = end - start
      dp[first][end] = (s2[first] === s1[end] && dp[first - 1][end - 1] === 0) ? 0 : Infinity
      for(let row = first + 1; row < s2.length; row++){
        // dp[row][end] 意味着 s2 的 0 ~ row 最少删除几个字符可以得到 s1 的 start ~ end 子串
        // Infinity 表示无法得到 
        dp[row][end] = Infinity
        if(dp[row - 1][end] !== Infinity){
          dp[row][end] = dp[row - 1][end] + 1
        }
        if(dp[row - 1][end - 1] !== Infinity && s2[row] === s1[end]){
          dp[row][end] === Math.min(dp[row][end], dp[row - 1][end - 1])
        }
      }
    }
  }
}
```





#### 题目六

如果一个节点 X，它左子树和右子树完全一样

那么我们说以 X 为根节点的子树是相等子树

给定一棵二叉树的头结点 head

返回 head 整棵树上有多少颗相等子树



分析：

如果正常判断的话，我们从根节点开始判断，每找到一个相等子树就给结果值加 1（闭包），这样可以实现

```javascript
function same(left, right){
  if(!left && !right){
    return true
  }
  if(!left || !right){
    return false
  }
  return left.val === right.val && same(left.left, rigth.left) && same(left.right, rigth.right)
}

function sameSubTree(node){
  if(!node){
    return 0
  }
  return sameSubTree(node.left) + sameSubTree(node.right) + same(node.left, node.right)
}
```



但是这样自上而下的判断的话，下面的相等子树其实是要被判断多次的，如果我们能把每个相等子树的判断次数缩减到 1 次，然后把这个信息向上返回，进而判断上面的树是不是相等子树的话，这样自下而上的判断效率更高

那就定义一个递归过程：判断以当前节点为根节点的树有多少颗相等子树，返回值包含的信息有：

1. 以当前节点为根节点的树有多少颗相等子树
2. 以当前节点为根节点的树的状态（用来给该树的父节点判断相等子树）

那这个状态我们如何表示呢?

序列化，因为序列化的结果是唯一的

然后我们把序列化后的结果用字符串存储，字符串在 JS 中是在堆内存存储的，我们实际访问的是字符串的地址，相同的字符串地址相同，不会一个个字符去比较，所以这个效率和 hashcode的效率相当

然后就是序列化的生成了，我们采用先序的生成方式

因为我们是自底向上生成树的序列化结果的，先序的话，根左右的顺序，到了新的根节点只需要按照 根、左子树、右子树的顺序拼接就可以了

```javascript
function Node(val, left, right){
  this.val = val
  this.left = left
  this.right = right
}

function sameSubTree(node){
  if(!node){
    return {
      size: 0,
      serialization: 'null'
    }
  }
  let left = sameSubTree(node.left),
      right = sameSubTree(node.right)
  return {
    size: left.size + right.size + (left.serialization === right.serialization ? 1 : 0),
    serialization: `${node.val},${left.serialization},${right.serialization}`
  }
}
```

