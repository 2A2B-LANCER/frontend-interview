#### 题目一

数组中所有数都异或起来的结果，叫做异或和

给定一个数组 arr，返回 arr 的最大子数组异或和



思路：

这道题读起来很像最大子数组的和，但是又不一样，因为最大子数组的和是可以有继承关系的，前面选出来的最大子数组，可以为后面的选择提供参考

但是异或和不行，前面最大的异或和子数组不一定就是现阶段的最大异或和子数组，所以每到一个新的终点，以该点为结尾的子数组的异或和都要重新算一遍然后比较；当然，前缀异或和是有指导意义的

如果我们求出所有 0 ~ i 的前缀异或和，这个时间复杂度是 O(N)（arr.reduce）

然后第一个比较零次，第二个比较一次，第三个比较二次，第n个比较 n - 1 次，这个时间复杂度是 O(N^2)（等差数列求和）

那总体的时间复杂度就是 O(N^2)

很明显，相比于前缀和，麻烦的点就是前面的结果不能给予当前的判断以指导

那如果我们再想优化，方向只能是，“比较” 这个过程

由此，引出 “前缀树” 的数据结构

异或，想要最大那就高位尽量为 1；也就是，当前位和被异或的当前位尽量不同，这样从高位向低位延伸

如果实现了这个数据结构的话，每一次比较出最大异或前缀和的时间就是固定的，即 63 个常量时间，然后要比较 N 个数字，所以时间复杂度就是 O(N) 很大的优化



```javascript
/**
 * 前缀树的 Node 结构
 * nexts[0] -> 下一位是 0
 * nexts[1] -> 下一位是 1
 * nexts[i] === null：没有下一位是 i 的结果
 * nexts[i] !== null：有下一位是 i 的结果，可以跳下一个节点
 */
class Node{
  constructor(zero = null, one = null){
    this.nexts = [zero, one]
  }
}

class Trie{
  constructor(){
    // 头结点
    this.head = new Node()
  }
}

Trie.prototype.add = function(newNum){
  let current = this.head
  for(let i = 63; i >= 0; i--){
    const currentNum = ((newNum >> i) & 1)
    if(!current.nexts[currentNum]){
      current.nexts[currentNum] = new Node()
    }
    current = current.nexts[currentNum]
  }
}

// Trie.prototype.cons = function(){
//   res = []
//   function dfs(node, ans, res, depth){
//     if(depth === 65){
//       res.push(ans)
//     }
//     if(node.nexts[0]){
//       dfs(node.nexts[0], ans + "0", res, depth + 1)
//     }
//     if(node.nexts[1]){
//       dfs(node.nexts[1], ans + "1", res, depth + 1)
//     }
//   }
//   dfs(this.head, "", res, 1)
//   return res
// }

/**
 * 返回 前缀树中与 num 异或后的最大值
 */
Trie.prototype.maxXor = function(num){
  let current = this.head
  let res = 0
  for(let i = 63; i >= 0; i--){
    const currentNum = ((num >> i) & 1),
          bestNum = i === 63 ? currentNum : (currentNum ^ 1)  // 符号位应该期望遇到相同的，为了异或之后符号位能是 0
    if(current.nexts[bestNum]){
      res |= (bestNum ^ currentNum) << i
      current = current.nexts[bestNum]
    }else{
      res |= (((bestNum ^ 1) ^ currentNum) << i)
      current = current.nexts[bestNum ^ 1]
    }
  }
  return res
}
```



```javascript
// 利用前缀树找到最大子数组异或和
function maxXorSubArr(arr){
  if(!arr || arr.length === 0){
    return 0
  }
  let max = -Infinity,
      xor = 0,
      prefixTree = new PrefixTree()
  // 使得所有的异或都有一个默认值，即其本身（0 ^ x === x）
  prefixTree.add(0)
  for(let i = 0; i < arr.length; i++){
    xor ^= arr[i]
    max = Math.max(max, prefixTree.maxXor(xor))
    prefixTree.add(xor)
  }
  return max
}
```



#### 题目二

> https://leetcode-cn.com/problems/maximum-xor-of-two-numbers-in-an-array/



和第一题类似，但是题解更简单，这个只要求两个数进行异或，返回最大值，那就只需要把数组中的所有值存入前缀树，然后再求取最大异或值，返回即可

```javascript
var findMaximumXOR = function(nums) {
  let max = -Infinity,
      prefixTree = new PrefixTree(),
      len = nums.length
  for(let i=0; i<len; i++){
    prefixTree.add(nums[i])
  }
  for(let i=0; i<len; i++){
    max = Math.max(max, prefixTree.maxXor(nums[i]))
  }
  return max
};
```



#### 题目三

> https://leetcode-cn.com/problems/maximum-xor-with-an-element-from-array/submissions/

这道题还是求两个数的异或值中的最大值，但是又有了新的限制

这种在前缀树的基础上扩展的题，只需要在前缀树节点的结构上扩充一些信息，然后改动一些遍历条件，即可完成

```javascript
// 注意，由于该题的数据问题，如果前缀树节点用对象存储会爆内存
// 所以改用数组存储
class Trie{
  constructor(){
    this.head = [null, null, Infinity]
  }
}

Trie.prototype.add = function(newNum){
  let current = this.head
  current[2] = Math.min(current[2], newNum)
  for(let i = 30; i >= 0; i--){
    const currentNum = ((newNum >> i) & 1)
    if(!current[currentNum]){
      current[currentNum] = [null, null, Infinity]
    }
    current = current[currentNum]
    current[2] = Math.min(current[2], newNum)
  }
}

Trie.prototype.maxXor = function(num, max){
  let current = this.head,
      res = 0
  if(current[2] > max){
    return -1
  }
  for(let i = 30; i >= 0; i--){
    let currentNum = ((num >> i) & 1),
        bestNum = currentNum ^ 1
    if(!current[bestNum] || current[bestNum][2] > max){
      bestNum ^= 1
    }
    res |= (bestNum ^ currentNum) << i
    current = current[bestNum]
  }
  return res
}
var maximizeXor = function(nums, queries) {
  let trie = new Trie(),
      res = []
  nums.forEach(x => {
    trie.add(x)
  })
  queries.forEach(([x, m]) => {
    res.push(trie.maxXor(x, m))
  })
  return res
};
```



#### 题目四

数组中所有数都异或起来的结果，叫做异或和

给定一个数组 arr，可以任意切分成若干个不相交的子数组

其中一定存在一种最优方案，使得切出异或和为 0 的子数组最多，返回这个最多数量



分析：我们假设这样一个动态规划：

dp[i] 代表 0 ~ i 上最多的异或和为零的子数组个数

那么我们最终要返回的就是 dp[arr.length - 1]

当 i = 0 的时候，代表 0~0 上最多有几个异或和为零的数组

0~0只有 arr[0] 一个元素，那就只有两种情况：

1. arr[0] === 0，此时 dp[0] = 1
2. arr[0] !== 0，此时 dp[0] = 0

dp[i]（普遍情况怎么解）：

1. arr[i] 对于组成异或和为零的子数组有贡献；这样的话，在 0~i 上一定至少有一个子数组 0~pre 的异或和等于 0~i 的异或和，以至于 pre + 1 ~ i 的异或和为零，这个解就是 dp[pre] + 1
2. arr[i] 对于组成异或和为零的子数组没有贡献；这样的话，arr[i] 分配给哪个子数组是无所谓的，最优情况是，它对后面是有贡献的，这样遍历到后面的时候会返回来利用它，这个解是 dp[i - 1]
3. 从以上二者中取最大值，存入 dp[i]

优化：对于找到上一个异或和相等的位置是可以有优化的。每遍历到一个点位，就把这个异或和更新进最后出现的异或和Map，这样找的时候就是 O(1)



```javascript
// 假设答案的动态规划
function mostXor(arr){
  if(!arr || arr.length === 0){
    return 0
  }
  let len = arr.length,
      dp = new Array(len).fill(0),
      map = new Map(),
      xor = 0
  map.set(0, -1)
  if(arr[0] === 0){
    dp[0] = 1
    map.set(0, 0)
  }
  xor ^= arr[0]
  for(let i=1; i<len; i++){
    xor ^= arr[i]
    if(map.has(xor)){
      const pre = map.get(xor)
      dp[i] = pre === -1 ? 1 : (dp[pre] + 1)
    }
    dp[i] = Math.max(dp[i - 1], dp[i])
    map.set(xor, i)
  }
  return dp[len - 1]
}
```



#### 题目五

> https://leetcode-cn.com/problems/game-of-nim/

结论：整个数组进行异或，结果为零，后手赢；否则先手赢