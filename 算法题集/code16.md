#### 题目一

给定一个有正、有负、有零的数组 arr

给定一个整数 k

返回 arr 的子集（子序列）是否能累加出 k

1) 正常怎么做？

分析：典型从左到右的尝试模型

每一个元素都有 要 和 不要 两种状态

定义 `dp[i][j]`：0~i 上的元素能否累加出 j，有两种情况：

1. arr[i] 在 结果子集当中，那么 `dp[i][j]` = `dp[i - 1][j - arr[i]]`
2. arr[i] 不在 结果子集当中，那么 `dp[i][j]` = `dp[i - 1][j]`

问题在于，arr[i] 可正可负可为零，所以中途的累加和是可以大于 k 或者 小于 0 的，这样 j 的范围就不确定了

但是仍然是有界的，把 arr 中所有的负数都累加在一起，arr 的子集累加和不可能小于这个数；所有的整数累加在一起，累加和不可能大于这个数；这个范围就是累加和的范围。这样的话，j 的范围就确定下来了，可能为负的话，就把 j 整体向右平移，让 j === 0 代表最小的那个边界，这样就 OK 了

```javascript
function prefixSum(arr, k){
  if(k === 0){
    // 空数组 也是 子集
    return true
  }
  if(!arr || arr.length === 0){
    return false
  }
  let max = arr.reduce((acc, cur) => cur > 0 ? acc + cur : 0, 0),
      min = arr.reduce((acc, cur) => cur < 0 ? acc + cur : 0, 0),
      len = max - min + 1,
      dp = new Array(arr.length).fill(0).map(() => new Array(len).fill(false))
  if(k < min || k > max){
    // 可选范围之外的 k 不可能累加得到
    return false
  }
  // 0~0 上 累加出 0 是可以的，空集
  dp[0][-min] = true
  // 0~0 上 累加出 arr[0] 是可以的
  dp[0][arr[0] - min] = true
  for(let i = 1; i < arr.length; i++){
    for(let j = 0; j < len; j++){
      // 这个 j 是平移之后的
      dp[i][j] = dp[i - 1][j] || (j - arr[i] >= 0 && j - arr[i] < len) ? dp[i - 1][j - arr[i]] : false
    }
  }
  return dp[arr.length - 1][k - min]
}
```

2) 如果 arr 中的数值很大，但是 arr 的长度不大，怎么做？

数值很大的话，累加和的范围就会很大，这样弄出来的 dp 表填充起来会超时，所以就不能用动态规划了

arr 的长度不大，那就可以用分治去做

```javascript
function process(arr, i, end, pre, res){
  // i 之前的已经做完了决策，现在对 arr[i] 进行决策，一直决策到 end - 1
  // 然后将决策的结果放入集合
  if(i === end){
    if(!res.includes(pre)){
        res.push(pre);
    }
  }else{
    process(arr, i + 1, end, pre, res)
    process(arr, i + 1, end, pre + arr[i], res)
  }
}

function prefixSum(arr, k){
  if(k === 0){
    return true
  }
  if(!arr || arr.length === 0){
    return false
  }
  if(arr.length === 1){
    return arr[0] === k
  }
  let left = [],
      right = []
  // 整体分成两部分，前半部分求累加和，后半部分求累加和
  process(arr, 0, arr.length >> 1, 0, left)
  process(arr, arr.length >> 1, arr.length, 0, right)
  // 判断两部分的累加和能不能合成 k
  for(let l of left.values()){
    if(right.includes(k - l)){
      return true
    }
  }
  return false
}
```



#### 题目二

给定一个正数数组 arr

返回 arr 的子集不能累加出的最小正数

我们先定义一个变量 range，表示现在累加和的范围

一开始没有元素加进去，范围肯定是 0~0，但是问题问的是整数，所以这个没有意义

- 如果，arr 中 不存在 1，又因为所有元素都是正数，那么 不可能累加出 1，1又是最小的正整数，那答案肯定就是 1
- 如果 arr 中有 1，那么现在累加和的范围就变成了 1~1（0对于这个题来说没意义）接下来就可以正式循环了
  - 因为 arr 已经排序过了，那 元素肯定是整体递增的
  - 我们假设现在循环到了 i，range = x，表示 0~i - 1 上的元素能够累加出 1~ x
    - 如果 arr[i] === x + 1，那它自己就可以累加出 x + 1；1 + x + 1，就可以累加出 x + 2，这样一直到 x + x + 1，range 就扩大到了 2 * x + 1
    - 如果 arr[i] === x + 2，0~i - 1只能累加出 1~x，那 x + 1就办法了，即便只有它自己，也是 x + 2，再加上其他正数更不可能是 x + 1，i 后面的数又肯定大于等于 x + 2，所以，x + 1 就是答案
    - 其他情况类似，自己推导

```javascript
function unformedSum(arr){
	if(!arr || arr.length === 0 || !arr.includes(1)){
        return 1
    }
    arr.sort((a, b) => a - b)
    let range = 1
    for(let i = 1; i<arr.length; i++){
        if(arr[i] > range + 1){
        	return range + 1
        }else{
            range += arr[i]
        }
    }
    return range + 1
}
```



#### 题目三

> https://leetcode-cn.com/problems/patching-array/

 ```javascript
// 思路和题目二一样
var minPatches = function(nums, n) {
  let range = 0,
      res = 0
  if(nums[0] !== 1){
    res++
    range = 1
  }
  for(let i=0; i<nums.length; i++){
    if(range >= n){
      return res
    }
    if(nums[i] > range + 1){
      res++
      i--
      range += range + 1
    }else{
      range += nums[i]
    }
  }
  while(range < n){
    res++
    range += range + 1
  }
  return res
};
 ```



#### 题目五-约瑟夫环问题

给定一个链表头结点 head，和一个正数 m

从头开始，每次数到 m 就杀死当前节点

然后被杀节点的下一个节点从 1 开始重新数

周而复始直到只剩下一个节点，返回最后的节点

> https://leetcode-cn.com/problems/yuan-quan-zhong-zui-hou-sheng-xia-de-shu-zi-lcof/

分析：很明显可以模拟来做，但是时间复杂度是 O(N * M)（因为每一轮都要走 M 个节点找到需要被删除的，最后剩下一个节点，也就是要删除 N - 1个节点，进行 N - 1 轮）

这个过程有个规律：每一轮删除一个节点，循环 N - 1 轮，最后剩下一个节点

如果我们每一轮都给节点进行编号的话，那最后一轮，就只剩下一个节点，它的编号肯定是 1

如果我们可以找到一个公式，输入这一轮的新编号，输出上一轮的旧编号，那我循环 N - 1 次，不就知道最后剩下的这个节点，在一开始的编号是啥了吗

那现在来想这个问题：报的数字和对应编号之间有什么关系？

假设一共有四个人，每个人按顺序有各自的编号 [1,2,3,4]，现在让他们报数，请写出报数和编号的关系式？

横坐标：报数

纵坐标：编号

人数 n：4

这个对应的图画出来之后，看起来很像 y = x % n 吧，但是不一样，是平移之后的图像

函数平移的规则：左加右减，上加下减，那报数和编号的关系式不就有了：

编号 = ((报数 - 1) % n) + 1（报数从 1 开始）

现在再来写新旧编号的关系式

假设现在人的编号是 [1,2,3,4,5,6,7]，m = 3，那踢掉 报数为 3 的人之后，新编号是怎样对应的？

```javascript
[1,2,3,4,5,6,7]
[5,6,x,1,2,3,4]
```

画出坐标图，发现和编号-报数关系式很像，就是向左平移了 m 格

那就可以假设：旧编号 = ((新编号 - 1 + m) % n) + 1

```javascript
var lastRemaining = function(n, m) {
  let res = 1
  for(let i = 2; i<=n; i++){
    res = ((res - 1 + m) % i) + 1
  }
  return res - 1
};
```





#### 题目六

给定整数 power，给定数组 arr，给定数组 reverse，含义如下

arr 的长度一定是 2 的 power 次方

reverse 中每个值一定都在 0~power范围内

例如 power = 2，arr = [3,1,4,2]，reverse = [0,1,0,2]

任何一个在前的数字可以和任何一个在后的数字，构成一对

可能是升序、相等、降序

比如 arr 开始时有如下的降序对：[3,1]，[3,2]，[4,2]，一共 3 对

接下来根据 reverse 对 arr 进行 reverse.length 次调整，调整规则如下：

1. reverse[i] 表示 arr 的 2^i 个数组成一组，内部进行逆序操作（[1,2,3]变成[3,2,1]）
2. 每一次操作之后 arr 就更新成新的状态，存储 现在有多少个降序对
3. 最后返回 reverse.length 的数组，存储的是每一步有多少个降序对

