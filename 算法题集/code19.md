#### 题目一

给定一个正数 N，比如 N = 13，在纸上把所有数都列出来如下：

1 2 3 4 5 6 7 8 9 10 11 12 13

可以数出 1 这个字符出现了 6 次

给定一个正数 N 如果把 1~N 都列出来，返回 1 这个字符出现多少次

```javascript
// O((log(N))^2)
function getOneNum(num) {
  if(num < 1){
    return 0
  }
  let len = getLenOfNum(num)
  if(len === 1){
    return 1
  }
  let temp1 = Math.pow(10, len - 1),
      first = Math.floor(num / temp1)
  // 最高位 1 的数量
  // 比如 14679：10000 ~ 14679 的最高位都是 1 所以最高位 1 的个数就是 14679 % 10000 + 1
  // 比如 24679：10000 ~ 19999 的最高位都是 1,20000以后的最高位就没有 1 了，所以个数就是 10000
  let firstOneNum =  first === 1 ? num % temp1 + 1 : temp1
  // 出去最高位之外，剩下 1 的数量
  // 10^(k - 2) * (k - 1) * first
  let otherOneNum = (temp1 / 10) * (len - 1) * first
  return firstOneNum + otherOneNum + getOneNum(num % temp1)
}

function getLenOfNum(num) {
  // 获得 num 是几位数
  let len = 0
  while(num !== 0){
    len++
    num = Math.floor(num / 10)
  }
  return len
}
```



#### 题目二

> https://leetcode-cn.com/problems/smallest-range-covering-elements-from-k-lists/

```javascript
// 每个数组中按顺序取出一个数，然后算出这个序列的最小范围
var smallestRange = function(nums) {
  let len = nums.length,
      sortMap = [],
      indexes = new Array(len).fill(0),
      res = [-Infinity, Infinity]
  for(let [index, val] of indexes.entries()){
      sortMap.push([nums[index][val], index])
    }
  sortMap.sort((a, b) => a[0] - b[0])
  if(res[1] - res[0] > sortMap[nums.length - 1][0] - sortMap[0][0]){
    res = [sortMap[0][0], sortMap[nums.length - 1][0]]
  }
  while(isEnd(nums, indexes)){
    let del = sortMap.shift()
    sortMap.push([nums[del[1]][++indexes[del[1]]], del[1]])
    sortMap.sort((a, b) => a[0] - b[0])
    if(res[1] - res[0] > sortMap[nums.length - 1][0] - sortMap[0][0]){
      res = [sortMap[0][0], sortMap[nums.length - 1][0]]
    }
  }
  return res
};

function isEnd(nums, indexes){
  let len = nums.length
  for(let i=0; i<len; i++){
    if(nums[i].length === indexes[i]){
      return false
    }
  }
  return true
}
```



#### 题目三

一张扑克牌有三个属性，每个属性有三种值（A,B,C）

比如 "AAA"，第一个属性 A，第二个属性 A，第三个属性 A

比如 "BCA"，第一个属性 B，第二个属性 C，第三个属性 A

给定一个字符串类型的数组 cards，每一个字符代表一张扑克

从中挑选三张扑克，一个属性达标的条件是：这个属性在三张扑克中全一样，或者全不一样

挑选三张扑克达标的要求是：每个属性都满足上面的条件

比如 "ABC","CBC","BBC"

第一个属性 A,C,B，全不一样，达标

第二个属性 B,B,B，全一样，达标

第三个属性 C,C,C，全一样，达标

所以这三张扑克牌可以作为答案

返回在 cards 中任意挑选三张扑克，达标的方法数

**数据量大概在 100万左右**

分析：递归和动态规划都不现实，因为数据量太大了

所以得从别的方向着手

每张牌有三个属性，每个属性三种值，那牌面一共有 3^3 = 27 种，毫无疑问，cards 中有重复的

根据达标的要求：达标的牌面有多少种呢？

现在来看一个属性达标有多少种可能，

```javascript
// 全一样
AAA, BBB, CCC
// 全不一样
ABC, ACB, BAC, BCA, CAB, CBA
```

一个属性达标有 9 种可能

三个属性就是 9^3 = 729 种

并且，这 729 种牌面是已知的

那么，我们就可以操作了

1. 遍历 cards，求出每种牌面有多少张
2. 遍历这 729 种可能，计算每种可能达标的次数

时间复杂度就是 遍历 cards，计算可能性的时候是常数时间，所以 O(N)