#### 题目一

已知一个二叉树的先序遍历数组 pre 和中序遍历数组 mid，能否不重建树，直接生成二叉树的后序遍历数组，已知二叉树没有重复值



```javascript
// 递归
// 先序的第一个元素肯定是后序的最后一个元素
// 中序中，先序第一个元素左边的元素，肯定属于左子树；右边的肯定属于右子树
// 然后就可以切分左右进行递归了
function process(pre, mid){
  if(pre === ""){
    return ""
  }
  let root = pre[0],
      rootInMid = mid.indexOf(root),
      leftMid = mid.substring(0, rootInMid),
      leftPre = pre.substring(1,1 + leftMid.length),
      rightMid = mid.substring(rootInMid + 1),
      rightPre = pre.substring(1 + leftMid.length),
      leftLRD = process(leftPre, leftMid),
      rightLRD = process(rightPre, rightMid)
  return leftLRD + rightLRD + root
  
}

function getLRDFromPreAndLDR(pre, mid){
  if(!pre || !mid || pre.length !== mid.length || pre === ""){
    return "";
  }
  return process(pre, mid)
}
```



#### 题目二

> https://leetcode-cn.com/problems/largest-component-size-by-common-factor/

```javascript
// 辗转相除法求最大公约数
function gcd(a, b){
    return b === 0 ? a : gcd(b, a % b)
}
```

联通性问题，并查集

但是如果我们用 `gcd` 求两个数是否属于同一集合的话，那我们任意两个数都要进行判断，这个时间复杂度就是 O(N^2)

如果换一种方式，经典的，空间换时间

保存一个公共的因子对应表，然后遍历数组，每一个数都求出它的所有因子，如果因子表中有这个因子了，说明这个数应该和之前求出这个因子的 **数们** 合并到一个集合，这样，我们最外层只需要遍历一遍数组 O(N)；然后就是求因子的时间复杂度，求因子最好的时间复杂度也是 val 开平方，所以时间复杂度就是 O(N * (val 开平方))

这两种方法要根据数据情况判断：如果数据量很大，第一种方法应该会超时；如果数据值很大，第二个方法可能会超时

```javascript
var largestComponentSize = function(nums) {
  let unionFind = new UnionFind(nums),
      factorMap = new Map()
  for(let [index, val] of nums.entries()){
    let factors = getFactors(val)
    for(let factor of factors){
      if(factorMap.has(factor)){
        unionFind.union(factorMap.get(factor), index)
      }else{
        factorMap.set(factor, index)
      }
    }
  }
  return unionFind.getMaxSize()
};

function getFactors(num){
  let max = Math.sqrt(num),
      factors = new Set()
  factors.add(num)
  for(let i = 2; i <= max; i++){
    if(num % i === 0){
      factors.add(i)
      factors.add(num / i)
    }
  }
  return Array.from(factors)
}

function UnionFind(nums){
  this.proxy = new Array(nums.length).fill(0).map((val, index) => index);
  this.size = new Array(nums.length).fill(1)
}

UnionFind.prototype.find = function(index){
  let help = []
  while (this.proxy[index] !== index){
    help.push(index)
    index = this.proxy[index]
  }
  for(let x of help){
    this.proxy[x] = index
  }
  return index
}

UnionFind.prototype.union = function(index1, index2){
  const proxy1 = this.find(index1),
        proxy2 = this.find(index2)
  if(proxy1 !== proxy2){
    let big = this.size[proxy1] > this.size[proxy2] ? proxy1 : proxy2,
        small = big === proxy1 ? proxy2 : proxy1
    this.proxy[small] = big
    this.size[big] += this.size[small]
  }
}

UnionFind.prototype.getMaxSize = function(){
  return Math.max(...this.size)
}
```



#### 题目三-完美洗牌问题

给定一个长度为偶数的数组 arr，假设长度为 N * 2

左部分：arr[L1~Ln]

右部分：arr[R1~Rn]

请把 arr 调整成 arr[L1, R1, L2, R2, L3, R3, ..., Ln, Rn]

要求时间复杂度 O(N)，额外空间复杂度 O(1)



#### 题目四

给定一个字符串 str，当然可以生成很多子序列

返回有多少个子序列是回文子序列，空序列不算回文

比如 str = "aba"

回文子序列：[a]	[a]	[a,a]	[b]	[a,b,a]

返回 5



```javascript
// 范围尝试模型
function palindromeNums(str){
  if(!str || str === ""){
    return 0
  }
  const dp = new Array(str.length).fill(0).map(() => new Array(str.length).fill(0))
  for(let i=0; i<str.length; i++){
    dp[i][i] = 1
    if(str[i] === str[i + 1]){
      dp[i][i + 1] = 3
    }else{
      dp[i][i + 1] = 2
    }
  }
  for(let i = str.length - 3; i >= 0; i--){
    for(let j = i + 2; j < str.length; j++){
      dp[i][j] = dp[i + 1][j] + dp[i][j - 1] -dp[i + 1][j - 1]
      if(str[i] === str[j]){
        dp[i][j] += 1 + dp[i + 1][j - 1]
      }
    }
  }
  return dp[0][str.length - 1]
}
```

