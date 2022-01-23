#### 题目一

数组为 [3,2,2,3,1]，查询为 (0,3,2)

意思是在数组里下标 0~3 这个范围上，有几个 2 ？答案返回 2。

假设给你一个数组 arr，

对这个数组的查询非常频繁，都给出来

请返回所有查询的结果

分析：查询非常频繁，显然是想让我们优化这种查询的效率

题目中给出的查询方式是 (下标左边界，下标右边界，目标值)

可以知道是查询某个范围上的目标值的个数

这样的话有两个思路：

1. 用哈希表 + 单链表解决，哈希表的键就是数组中的值，哈希表的值就是单链表来按照插入顺序存储索引（O(N^2)）
2. 哈希表 + 数组 + 二分查找，哈希表的键依旧存储数组中的值，但是哈希表的值存储排序好的索引数组，查询的时候使用二分查找大于等于左边界，小于等于右边界的范围（O(N * log(N))）
3. 当数据量不大的时候可以用 哈希表 + 前缀和数组，哈希表的键依旧存储数组中的值，但是哈希表的值存储的数组不再是索引，而是 0 ~ i 范围上有几个这个值（O(N)）



#### 题目二

返回一个数组中，子数组最大累加和

> https://leetcode-cn.com/problems/maximum-subarray/

分析：前缀和

我们从左到右求出前缀和数组，该数组存储以每个点为右边界的子数组的最大累加和

以 i 为右边界的最大累加和子数组只和 i - 1的最大累加和以及本身的值有关，如果当前值做之前子数组的右边界比自己新成立一个子数组更大，那就加入，否则自己成立



```javascript
var maxSubArray = function(nums) {
  let len = nums.length,
      max = nums[0],
      prefixSum = nums[0]
  for(let i=1; i<len; i++){
    prefixSum = Math.max(nums[i], prefixSum + nums[i])
    max = Math.max(max, prefixSum)
  }
  return max
};
```



#### 题目三

给定一个正整数、负整数和 0 组成的 N × M 矩阵，编写代码找出元素总和最大的子矩阵。

返回一个数组 [r1, c1, r2, c2]，其中 r1, c1 分别代表子矩阵左上角的行号和列号，r2, c2 分别代表右下角的行号和列号。若有多个满足条件的子矩阵，返回任意一个均可。

> https://leetcode-cn.com/problems/max-submatrix-lcci/

分析：子矩阵其实本质上还是子数组，只不过是把多个子数组压缩在一起，同加同减

所以我们每轮都规定下上下边界，然后去求压缩数组的最大累加和的子数组，答案一定在其中



```javascript
var getMaxMatrix = function(matrix) {
  let row = matrix.length,
      col = matrix[0].length,
      max = -Infinity,
      res = null
  for(let up = 0; up < row; up++){
    let compression = new Array(col).fill(0)
    for(let down = up; down < row; down++){
      let prefixSum = new Array(col).fill(0),
          left = 0
      compression[0] += matrix[down][0]
      prefixSum[0] = compression[0]
      if(prefixSum[0] > max){
        max = prefixSum[0]
        res = [up, 0, down, 0]
      }
      for(let right = 1; right < col; right++){
        compression[right] += matrix[down][right]
        prefixSum[right] = compression[right]
        if(prefixSum[right] > prefixSum[right - 1] + prefixSum[right]){
          left = right
          if(max < prefixSum[right]){
            max = prefixSum[right];
            res = [up, left, down, right]
          }
        }else{
          prefixSum[right] = prefixSum[right - 1] + prefixSum[right]
          if(max < prefixSum[right]){
            max = prefixSum[right];
            res = [up, left, down, right]
          }
        }
      }
    }
  }
  return res
};
```



#### 题目四

返回一个数组中，选择的数字不能相邻的情况下，最大子序列累加和



分析：经典从左往右的动态规划

对于每个数结尾的子数组有两种情况：

1. 选择当前数字，这种情况下的最大子序列和与以上上个数开头的子数组的最大子序列和有关
2. 不选择，这种情况下的最大子序列和与以上个数开头的子数组的最大子序列和有关
3. base case：
   1. 第一个值，只能选上
   2. 第二个值，和第一个值比较，返回较大值

只有这两种情况，取其中的较大值返回



```javascript
function maxSubsequence(arr){
  if(!arr || arr.length === 0){
    return 0;
  }
  if(arr.length === 1){
    return arr[0]
  }
  if(arr.length === 2){
    return Math.max(...arr)
  }
  const len = arr.length,
        dp = new Array(len).fill(0)
  dp[0] = arr[0];
  dp[1] = Math.max(arr[0], arr[1])
  for(let i=2; i<len; i++){
    let res1 = arr[i] + dp[i - 2],
        res2 = dp[i - 1]
    dp[i] = Math.max(arr[i], res1, res2)
  }
  return dp[len - 1]
}
```





#### 题目五

> https://leetcode-cn.com/problems/candy/

n 个孩子站成一排。给你一个整数数组 ratings 表示每个孩子的评分。

你需要按照以下要求，给这些孩子分发糖果：

每个孩子至少分配到 1 个糖果。
相邻两个孩子评分更高的孩子会获得更多的糖果。
请你给每个孩子分发糖果，计算并返回需要准备的 最少糖果数目 。



分析：和接雨水思路一样，但是这个是找较大值，因为 “相邻两个孩子评分更高的孩子会获得更多的糖果。” 这句话可以拆成两个意思：

1. 如果我比我左边的分数高，我要的糖多
2. 如果我比我右边的分数高，我要的糖多
3. 两个条件要同时满足，与的关系，所以同大取大



```javascript
var candy = function(ratings) {
  let len = ratings.length,
      left = new Array(len).fill(1),
      right = new Array(len).fill(1)
  for(let i=1; i<len; i++){
    if(ratings[i] > ratings[i - 1]){
      left[i] = left[i - 1] + 1
    }
  }
  for(let i=len - 2; i>=0; i--){
    if(ratings[i] > ratings[i + 1]){
      right[i] = right[i + 1] + 1
    }
  }
  return left.map((x, index) => Math.max(x, right[index])).reduce((acc, cur) => acc + cur, 0)
};
```



进阶：如果相邻的孩子分数一样高，糖果数必须一样多

这样的话就是三个判定条件

1. 我比相邻的孩子分数高，糖果变多
2. 我比相邻的孩子分数低，糖果变少
3. 一样，糖果相同

```javascript
var candy = function(ratings) {
  let len = ratings.length,
      left = new Array(len).fill(1),
      right = new Array(len).fill(1)
  for(let i=1; i<len; i++){
    if(ratings[i] > ratings[i - 1]){
      left[i] = left[i - 1] + 1
    }else if(ratings[i] === ratings[i - 1]){
        left[i] = left[i - 1]
    }
  }
  for(let i=len - 2; i>=0; i--){
    if(ratings[i] > ratings[i + 1]){
      right[i] = right[i + 1] + 1
    }else if(ratings[i] === ratings[i + 1]){
        right[i] = right[i + 1]
    }
  }
  return left.map((x, index) => Math.max(x, right[index])).reduce((acc, cur) => acc + cur, 0)
};
```



#### 题目六

生长长度为 size 的达标数组

达标：对于任意的 i < k < j，满足 [i] + [j] != [k] * 2

给定一个正数 size，返回长度为 size 的达标数组



分析：

如果 [i] + [j] != [k] * 2

那么 2 * ( [i] + [j]) != 2 * [k] * 2

且 2 * ( [i] + 1 + [j] + 1) != 2 * ([k] + 1) * 2

然后将其组合 [ 2[i], 2[k], 2[j], 2[i] + 1, 2[k] + 1, 2[j] + 1]

左半部分达标，右半部分达标

2[i] + 2[k] + 1 != 2 * 2[j]，因为 奇数 + 偶数 != 偶数

2[k] + 2[j] + 1 != 2 * (2[i] + 1)，因为 奇数 + 偶数 != 偶数

所以我们就由一个 base size 的达标数组，扩展出来了一个长度为 2倍 base size 的达标数组，这样不断扩大，就可以在 O(log(N)) 的时间复杂度内，扩展出 size 长度的达标数组

```javascript
function makeNo(size){
  if(size === 1){
    return [1]
  }
  let half = Math.ceil(size / 2),
      base = makeNo(half),
      ans = new Array(size),
      index = 0
  for(; index<half; index++){
    ans[index] = base[index] * 2 - 1
  }
  for(let i=0; index < size; i++, index++){
    ans[index] = base[i] * 2
  }
  return ans
}
```



#### 题目七

> https://leetcode-cn.com/problems/interleaving-string/



思路一：s1,s2,s3都有指针从头开始移动

1. s3 当前指向的值既不等于 s1 当前指向的值，也不等于 s2 当前指向的值，直接返回 false
2. 当前 s3 指向的值 和 s1 指向的值相等，把该值分配给 s1，s1 和 s3 的指针 + 1，递归；否则这条路径设置为 false
3. 当前 s3 指向的值 和 s2 指向的值相等，把该值分配给 s2，s2 和 s3 的指针 + 1，递归；否则这条路径设置为 false
4. 返回 2 || 3

改动态规划，成功

```javascript
// 动态规划
var isInterleave = function(s1, s2, s3) {
  if(s1.length + s2.length !== s3.length){
    return false
  }
  let last = new Array(s3.length + 1).fill(0).map(() => new Array(s3.length + 1).fill(false))
  let dp = new Array(s3.length + 1).fill(0).map(() => new Array(s3.length + 1).fill(false))
  last[s1.length][s2.length] = true
  for(let indexOfS3 = s3.length - 1; indexOfS3 >= 0; indexOfS3--){
    for(let indexOfS1 = s3.length - 1; indexOfS1 >= 0; indexOfS1--){
      for(let indexOfS2 = s3.length - 1; indexOfS2 >= 0; indexOfS2--){
        let res1 = false, res2 = false
        if(s3[indexOfS3] === s1[indexOfS1]){
          res1 = last[indexOfS1 + 1][indexOfS2]
        }
        if(s3[indexOfS3] === s2[indexOfS2]){
          res2 = last[indexOfS1][indexOfS2 + 1]
        }
        dp[indexOfS1][indexOfS2] = res1 || res2
        
      }
    }
    last = dp
    dp = new Array(s3.length + 1).fill(0).map(() => new Array(s3.length + 1).fill(false))
  }
  return last[0][0]
};
```



思路二：

进行以下递归过程：length1长度的 s1串和 length2 长度的 s2 串是否可以交错组成 length1 + length2 长度的 s3

1. s3[length1 + length2 - 1] === s1[length1 - 1]，那么就去判断，length1 - 1长度的 s1串和 length2 长度的 s2 串是否可以交错组成 length1 - 1 + length2 长度的 s3
2. s3[length1 + length2 - 1] === s2[length2 - 1]，那么就去判断，length1长度的 s1串和 length2 - 1 长度的 s2 串是否可以交错组成 length1 + length2 - 1 长度的 s3
3. 如果 1/2 都不成立，直接返回 false，意为 length1长度的 s1串和 length2 长度的 s2 串不可以交错组成 length1 + length2 长度的 s3
4. 如果 1 || 2 成立，那么返回 true，意为 length1长度的 s1串和 length2 长度的 s2 串可以交错组成 length1 + length2 长度的 s3
5. base case：如果 s1 和 s2 一直缩短，就说明某种正确匹配在顺利往前推导，直到 s1 或 s2 的长度为 0 的时候
   1. s1 长度为 0，s2 长度不为 0，如果 length2 长度的 s2 的前缀和 length2 长度的 s3 的前缀相同，则说明可以生成，返回 true；否则返回 false
   2. s2 长度为 0，s1 长度不为 0，如果 length1 长度的 s1 的前缀和 length1 长度的 s3 的前缀相同，则说明可以生成，返回 true；否则返回 false
   3. 都为 0，也就是说 两个空字符串能否生成一个空字符串，明显可以，返回 true（但是已经包含在前两种情况中了）

```javascript
// 样本对应模型的暴力递归
var beg = function(s3, s1, s2, indexOfS1, indexOfS2, dp){
  if(dp[indexOfS1][indexOfS2] !== -1){
    return dp[indexOfS1][indexOfS2]
  }
  if(indexOfS1 === 0){
    if(s2.slice(0, indexOfS2) === s3.slice(0, indexOfS2)){
      return true
    }else{
      return false
    }
  }
  if(indexOfS2 === 0){
    if(s1.slice(0, indexOfS1) === s3.slice(0, indexOfS1)){
      return true
    }else{
      return false
    }
  }
  let res1 = false,
      res2 = false,
      indexOfS3 = indexOfS1 + indexOfS2 - 1
  if(s3[indexOfS3] === s1[indexOfS1 - 1]){
    res1 = beg(s3, s1, s2, indexOfS1 - 1, indexOfS2, dp)
  }
  if(s3[indexOfS3] === s2[indexOfS2 - 1]){
    res2 = beg(s3, s1, s2, indexOfS1, indexOfS2 - 1, dp)
  }
  dp[indexOfS1][indexOfS2] = res1 || res2
  return res1 || res2
}
var isInterleave = function(s1, s2, s3) {
  if(s1.length + s2.length !== s3.length){
    return false
  }
  let dp = new Array(s1.length + 1).fill(0).map(() => new Array(s2.length + 1).fill(-1))
  return beg(s3, s1, s2, s1.length, s2.length, dp)
};
```



```javascript
// 动态规划
var isInterleave = function(s1, s2, s3) {
  if(s1.length + s2.length !== s3.length){
    return false
  }
  let dp = new Array(s1.length + 1).fill(0).map(() => new Array(s2.length + 1).fill(false))
  dp[0][0] = true
  for(let i=0; i <= s1.length; i++){
    if(s1[i - 1] !== s3[i - 1]){
      break
    }else{
      dp[i][0] = true
    }
  }
  for(let i=0; i<=s2.length; i++){
    if(s2[i - 1] !== s3[i - 1]){
      break
    }else{
      dp[0][i] = true
    }
  }
  for(let i=1; i<= s1.length; i++){
    for(let j=1; j <= s2.length; j++){
      if((s1[i - 1] === s3[i + j - 1] && dp[i - 1][j]) ||
         (s2[j - 1] === s3[i + j - 1] && dp[i][j - 1])){
           dp[i][j] = true
         }
    }
  }
  return dp[s1.length][s2.length]
};
```



#### 题目八

> https://leetcode-cn.com/problems/the-skyline-problem/

