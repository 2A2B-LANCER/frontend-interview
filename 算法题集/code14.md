#### 题目一

给定一个只有左括号和右括号的字符串

返回最长的有效括号字串的长度



分析：很明显从左到右的尝试模型

dp[i] 含义为以 i 结尾的最大有效子串长度是多少

括号有效有两种情况：

1. 嵌套：嵌套只需要看 dp[i - 1]，上一个有效串之前的那个字符如果是左括号，那么以当前右括号结尾的最大嵌套有效子串长度就是 dp[i - 1] + 2
2. 连接：看完嵌套再看更前面一个有效串，如果是的话，那么二者肯定可以拼接



```javascript
var longestValidParentheses = function(s) {
  let len = s.length,
        dp = new Array(len).fill(0),
        max = 0
  for(let i=1; i<len; i++){
    if(s[i] !== '('){
      let last = i - 1 - dp[i - 1]
      if(last >= 0 && s[last] === '('){
        dp[i] = dp[i - 1] + 2
        
        let preValid = i - 1 - dp[i - 1] - 1
        if(preValid >= 0 && s[preValid] === ')'){
          dp[i] += dp[preValid]
        }
        
        max = Math.max(max, dp[i])
      }
    }
  }
  return max
};
```



#### 题目二

返回 arr 中，子数组的累加和

累加和的要求：是 <= k 的并且是最大的



如果用有序表的话，时间复杂度 O(N * log(N))

如果直接找的话，时间复杂度 O(N ^ 2)



#### 题目三

从二叉树的某个节点 x 开始，往下子节点都要的，叫子树

在二叉树上只要能连起来的任何结构，叫子拓扑结构

返回二叉树上满足搜索二叉树性质的、最大子拓扑结构的节点数

> https://www.nowcoder.com/practice/e13bceaca5b14860b83cbcc4912c5d4a
>



#### 题目四

给定一个完全二叉树

返回这棵树的节点个数

要求时间复杂度小于 O(树的节点数)

> https://leetcode-cn.com/problems/count-complete-tree-nodes/

```javascript
var countNodes = function(root) {
  let depth = 0,
      node = root
  while(node && node.left){
    depth++
    node = node.left
  }
  return process(root, depth)
};

function process(node, depth) {
  // depth是node的子树的高度
  if(!node){
    // 空树，节点数为 0
    return 0
  }
  if(depth === 0){
    // 不是空树，但子树的高度为 0，说明只有一个根节点
    return 1
  }
  let right = node.right,
      height = 0
  while(right && right.left){
    height++
    right = right.left
  }
  if(depth === height + 1){
    // node 的左子树必然是满二叉树
    return Math.pow(2, depth) - 1 + 1 + process(node.right, height)
  }else if(depth === height + 2){
    // node 的右子树必然是满二叉树
    return Math.pow(2, height + 1) - 1 + 1 + process(node.left, depth - 1)
  }
}
```

时间复杂度：每到一个递归，都要遍历根节点右子树的左边界，最多是当前树高度 - 1；

树的高度每次递归都 - 1，所以这就是个高度的等差数列

高度又是节点数的 log(N)

所以时间复杂度就是 O((log(N))^2)



#### 题目五

> https://leetcode-cn.com/problems/recover-binary-search-tree/

搜索二叉树中有两个节点位置不对，交换这两个位置

如果我们要完整的交换两个节点，非常麻烦，要考虑很多父节点，子节点的情况

但是如果我们交换这两个节点的信息，那就简单多了，只需要找出这两个节点，然后交换信息

那现在问题就是找到这两个节点

二叉搜索树的特点就是中序遍历的结果是升序的，那我们就找到非升序的节点就好了：

1. 两个错误节点挨着，那么就只有一对错误，比如：1,2,3,4,5 -> 1,3,2,4,5
2. 两个节点不挨着，那就有两对错误，比如：1,2,3,4,5 -> 1,4,3,2,5

那我们就这样寻找错误节点：

1. 当第一次遇到逆序的时候，第一个存入 left，第二个存入 right
2. 非第一次遇到逆序的时候，第二个存入 right

```javascript
var recoverTree = function(root) {
  let arr = [],
      first = null,
      second = null
  process(root, arr)
  for(let i=0; i<arr.length - 1; i++){
    if(arr[i].val > arr[i + 1].val){
      if(!first){
        first = arr[i]
        second = arr[i + 1]
      }else{
        second = arr[i + 1]
      } 
    }
  };
  [first.val, second.val] = [second.val, first.val]
  return root
};

function process(node, ans){
  if(!node){
    return
  }
  process(node.left, ans)
  ans.push(node)
  process(node.right, ans)
}
```







#### 题目六

> https://leetcode-cn.com/problems/first-missing-positive/

要求：

- 时间复杂度 O(N)
- 空间复杂度 O(1)

要求最小的未出现的正整数

定义有效值：

我们定义两个区间：

1. 有效区间：内的每个下标和数字都是对应关系，表明已出现；最小的未出现自然就是区间的下一个（nums[i] === i + 1 的时候，我们将当前下标划入有效区间）
2. 无效区间：表示当前区间内的数字都是干扰项，都会缩小最小的未出现的值的最大可能（也就是说无效区间开头就是可能已出现的最大值）

初始情况的时候，[1, N + 1] 都有可能是 **没有出现的最小的正整数**

所以 有效区间的初始右边界是 -1（有效区间的下一个表示 **没有出现的最小的正整数的最小可能值**），无效区间的初始左边界是 N（无效区间的下一个表示 **没有出现的最小的正整数的最大可能值**）

定义变量：

- left：有效区间的右边界下标
- right：无效区间的左边界下标

然后遍历数组，每轮要验证的元素下标就是 left + 1

有效区间和无效区间中间的区域就是需要判断的元素，按以下规则判断将当前值划入什么位置：

1. 如果 nums[left + 1] 并没有在 [left + 2, right] 内，说明是干扰项，应当划入无效区间
   - 当前位置元素和无效区间左边界元素互换，无效区间扩大，right--
2. 如果 nums[left + 1] 在 [left + 2, right] 内，但是并不在 nums[left + 1] - 1 上，那这个元素（**不是下标**）可能被划入有效区间，但是并不在这一轮；所以把它放到它该在的位置
3. 如果 nums[left + 1] 在 [left + 2, right] 内
   - left + 1 === nums[left + 1] - 1 && nums[left + 1] === nums[nums[left + 1] - 1]，也就是说当前位置符合划入有效区间的规定，那有效区间扩大，left ++
   - 否则就是可能有效数据放错了位置，把二者互换位置
4. 最后当有效区间和无效区间相接的时候，也就是 left === right - 1 的时候，循环结束，left的下一个位置就是没有出现的最小的正整数，即 left + 2

```javascript
var firstMissingPositive = function(nums) {
  let left = -1,
      right = nums.length
  while(left < right - 1){
    if(nums[left + 1] <= left + 1 || nums[left + 1] > right || (left + 1 !== nums[left + 1] - 1 && nums[left + 1] === nums[nums[left + 1] - 1])){
      // 干扰数据
      // 1. 不在有效数据范围内
      // 2. 在范围内，但是指定位置上已经是正确数据了
      [nums[left + 1], nums[right - 1]] = [nums[right - 1], nums[left + 1]]
      right--
    }else if(nums[left + 1] !== nums[nums[left + 1] - 1]){
      // 有效数据放错了位置
      let x = left + 1,
          y = nums[left + 1] - 1;
      [nums[x], nums[y]] = [nums[y], nums[x]]
    }else{
      // 有效数据在应该在的位置上，或者
      left++
    }
  }
  return left + 2
};
```

