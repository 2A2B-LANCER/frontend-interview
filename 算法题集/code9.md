#### 题目一

给定一个数组 arr，长度为 N，arr 中的值只有 0/1。arr[i] 表示第 i 盏灯的状态，0代表灭灯，1代表亮灯

每一盏灯都有开关，但是按下 i 号灯的开关，会同时改变 i - 1，i + 1 灯的状态

问题一：如果 N 盏灯排成一排，请问最少按下多少次开关，能让灯都亮起来？

- i 会影响 i - 1 和 i + 1
- 0号灯只能影响 0、1号灯
- N - 1 号灯只能影响 N - 1、N - 2 号灯



除了第一盏灯和最后一盏灯只影响两盏灯，其他的灯都会影响前后三盏灯

所以一盏灯的状态可能由前、后、自己，三个过程影响

这样想其实有点像之前二叉树点灯照明，但是又不一样，因为照明只要照亮状态就不会变了，但是开关是会重复变化的

这样我们就只能限定之前的状态了（外部信息简化），限定 i - 1之前的灯必须是亮起的状态，这样我们决策的时候就有目的性了：

1. 前一盏灯是亮起的状态，那么当前这个开关不能碰，因为过了当前这个过程，前一盏灯的就必须是亮起的状态，所以这时候结果只和 i 及其之后灯的开关操作次数有关
2. 前一盏灯是灭的状态，这样的话当前这个开关就必须操作一次，原因之前说了；操作之后，i - 1 肯定是亮起的状态，i 和 i + 1的状态和 arr中的数据相反；所以这时候的结果就是 1 +（i 及其之后灯的开关操作次数）
3. base case 就是 i 到了 arr.length - 1 了，此时的开关只能控制 i - 1 和 i 的状态；如果二者状态相同，那么是可以成功的；否则不可能成功
4. 还有就是第一盏灯，有两种情况
   1. 按第一盏灯的开关
   2. 按第二盏灯的开关
   3. 然后从这两条路中选择最小值



```javascript
// 递归
function process(arr, nextIndex, curStatus, preStatus){
  if(nextIndex === arr.length){
    if(curStatus === preStatus){
      if(curStatus){
        return 0
      }else{
        return 1
      }
    }else{
      return Infinity
    }
  }
  if(preStatus){
    return process(arr, nextIndex, !!arr[nextIndex], curStatus)
  }else{
    return 1 + process(arr, nextIndex + 1, !arr[nextIndex], !curStatus)
  }
}

function getMinStep(arr){
  if(!arr || arr.length === 0){
    return 0
  }
  if(arr.length === 1){
    if(arr[0]){
      return 0
    }else{
      return 1
    }
  }
  return Math.min(1 + process(arr, 2, !arr[1], !arr[0]), process(arr, 2, !!arr[1], !!arr[0]))
}
```



```javascript
// 动态规划
function getTimes(arr, nextIndex, preStatus, curStatus, times){
  for(; nextIndex < arr.length; nextIndex++){
    if(preStatus){
      preStatus = curStatus
      curStatus = !!arr[nextIndex]
    }else{
      times++
      preStatus = !curStatus
      curStatus = !arr[nextIndex]
    }
  }
  if(curStatus === preStatus){
    if(!curStatus){
      times++
    }
  }else{
    times = Infinity
  }
  return times
}

function getMinStep(arr){
  if(!arr || arr.length === 0){
    return 0
  }
  if(arr.length === 1){
    if(arr[0]){
      return 0
    }else{
      return 1
    }
  }
  return Math.min(getTimes(arr, 2, !!arr[0], !!arr[1], 0),
  				  getTimes(arr, 2, !arr[0], !arr[1], 1))
}
```



问题二：如果 N 盏灯排成一圈，请问最少按下多少次开关，能让灯都亮起来？

- i 会影响 i - 1 和 i + 1
- 0号灯会影响 0、1、N - 1号灯
- N - 1 号灯会影响 N - 1、N - 2、0 号灯



这样的话，我们要明确一个前提，如果一圈下来，不能让所有的灯都亮起来，那再来多少圈也不行；所以，终结的位置就是开始的位置

那我们选择从 0 开始

现在 0 和 length - 1 也会互相影响了，所以我们操作 0 的时候，最后一位会变，如果我们修改 arr 中的数据，那这个一维数组也成了自变量，改动态规划太麻烦了，所以不行

那想要把 length - 1 的状态记录下来就只能用变量存下来了，就像 `preStatus`，同理，0 的状态也得存储下来，因为 length - 1也会影响它

```javascript
// 递归
function process(arr, nextIndex, curStatus, preStatus, firstStatus, lastStatus){
  if(nextIndex === arr.length){
    if(lastStatus === firstStatus && lastStatus === preStatus){
      return lastStatus ? 0 : 1
    }else{
      return Infinity
    }
  }
  if(preStatus){
    return process(arr,
      nextIndex + 1,
      nextIndex === arr.length - 1 ? lastStatus : !!arr[nextIndex],
      curStatus,
      firstStatus,
      lastStatus)
  }else{
    return 1 + process(arr,
      nextIndex + 1,
      nextIndex === arr.length - 1 ? !lastStatus : !arr[nextIndex],
      !curStatus,
      firstStatus,
      nextIndex === arr.length - 1 ? !lastStatus : lastStatus)
  }
}

function getMinStep(arr){
  if(!arr || arr.length === 0){
    return 0
  }
  if(arr.length === 1){
    return arr[0] ? 0 : 1
  }
  if(arr.length === 2){
    if(arr[0] === arr[1]){
      return arr[0] ? 0 : 1
    }else{
      return Infinity
    }
  }
  if(arr.length === 3){
    if(arr[0] === arr[1] && arr[0] === arr[2]){
      return arr[0] ? 0 : 1
    }else{
      return Infinity
    }
  }
  let p1 = process(arr, 3, !!arr[2], !!arr[1], !!arr[0], !!arr[arr.length - 1]),
      p2 = 1 + process(arr, 3, !!arr[2], !arr[1], !arr[0], !arr[arr.length - 1]),
      p3 = 1 + process(arr, 3, !arr[2], !arr[1], !arr[0], !!arr[arr.length - 1]),
      p4 = 2 + process(arr, 3, !arr[2], !!arr[1], !!arr[0], !arr[arr.length - 1])
  return Math.min(p1, p2, p3, p4)
}
```



```javascript
function getTimes(arr, curStatus, preStatus, firstStatus, lastStatus){
  let times = 0
  for(let nextIndex = 3; nextIndex < arr.length; nextIndex++){
    if(preStatus){
      if(nextIndex === arr.length - 1){
        curStatus = lastStatus
      }else{
        curStatus = !!arr[nextIndex]
      }
      preStatus = curStatus
    }else{
      times++
      if(nextIndex === arr.length - 1){
        curStatus = !lastStatus
        lastStatus = !lastStatus
      }else{
        curStatus = !arr[nextIndex]
      }
      preStatus = !curStatus
    }
  }
  if(lastStatus === firstStatus && lastStatus === preStatus){
    if(!lastStatus){
      times++
    }
  }else{
    times = Infinity
  }
  return times
}

function getMinStep(arr){
  if(!arr || arr.length === 0){
    return 0
  }
  if(arr.length === 1){
    return arr[0] ? 0 : 1
  }
  if(arr.length === 2){
    if(arr[0] === arr[1]){
      return arr[0] ? 0 : 1
    }else{
      return Infinity
    }
  }
  if(arr.length === 3){
    if(arr[0] === arr[1] && arr[0] === arr[2]){
      return arr[0] ? 0 : 1
    }else{
      return Infinity
    }
  }
  let p1 = getTimes(arr, !!arr[2], !!arr[1], !!arr[0], !!arr[arr.length - 1]),
      p2 = 1 + getTimes(arr, !!arr[2], !arr[1], !arr[0], !arr[arr.length - 1]),
      p3 = 1 + getTimes(arr, !arr[2], !arr[1], !arr[0], !!arr[arr.length - 1]),
      p4 = 2 + getTimes(arr, !arr[2], !!arr[1], !!arr[0], !arr[arr.length - 1])
  return Math.min(p1, p2, p3, p4)
}
```



#### 题目二

> https://leetcode-cn.com/problems/remove-invalid-parentheses/submissions/

递归 + 剪枝

```javascript
var remove = function(s, res, checkIndex, deleteIndex, par){
  for(let count = 0, i = checkIndex; i < s.length; i++){
    if(s[i] === par[0]){
      count++
    }
    if(s[i] === par[1]){
      count--
    }
    if(count < 0){
      for(let j = deleteIndex; j <= i; j++){
        if(s[j] === par[1] && (j === deleteIndex || s[j - 1] !== par[1])){
          remove(s.substring(0, j) + s.substring(j + 1, s.length), res, i, j, par)
        }
      }
      return
    }
  }
  let reversed = s.split('').reverse().join('')
  if(par[0] === '('){
    remove(reversed, res, 0, 0, [')', '('])
  }else{
    res.push(reversed)
  }
}

var removeInvalidParentheses = function(s) {
  let res = []
  remove(s, res, 0, 0, ['(', ')'])
  return res
};
```



#### 题目三

> https://leetcode-cn.com/problems/longest-increasing-subsequence/

最长递增子序列

```javascript
// 动态规划 O(N^2)
// dp[i] 表示以 nums[i] 结尾的最长递增子序列的长度
var lengthOfLIS = function(nums) {
  let dp = new Array(nums.length).fill(0)
  dp[0] = 1
  for(let i=1; i<nums.length; i++){
    let longest = 0
    for(let j=0; j<i; j++){
      if(nums[j] < nums[i]){
        longest = Math.max(longest, dp[j])
      }
    }
    dp[i] = longest + 1
  }
  return Math.max(...dp)
};
```



```javascript
var lengthOfLIS = function(nums) {
  // end[i] 表示 长度为 i + 1 的最长递增子序列中，最小的最大值
  let end = new Array(nums.length).fill(null)
  end[0] = nums[0]
  let right = 0,
      l = 0,
      r = 0,
      max = 1
  for(let i=1; i<nums.length; i++) {
    l = 0
    r = right
    // 寻找 已知的最长递增子序列中可以接上 nums[i] 的子序列
    while(l <= r){
      // 二分查找
      // 如果 end[mid] 小于 nums[i]，说明可以接上，接上后，这个子序列长度 + 1，最大值为 nums[i]
      // 所以 l 要 + 1
      // 如果 end[mid] 大于等于 nums[i]，说明不能接，能接的都更短，所以 r - 1
      let mid = l + ((r - l) >> 1)
      if(nums[i] > end[mid]){
        l = mid + 1
      }else{
        r = mid - 1
      }
    }
    // 最后找到的不能接的位置，也就是 nums[i] 所在最长子序列的新长度
    // 更新 end[l]，因为存最小值
    // 如果最大长度更新了，就更新最大长度
    right = Math.max(right, l)
    end[l] = nums[i]
    max = Math.max(max, l + 1)
  }
  return max
};
```





扩展：现有一系列俄罗斯套娃 arr

每个套娃有两个信息，宽度 width，高度 height

已知，必须宽度高度都递增的套娃才能套在一起

问，这批套娃最多能套在一起几个？



分析：如果我们按照 宽度递增；宽度相同的，高度递减的顺序排列数组的话

那高度的最长递增子序列长度就是结果

因为相同宽度的套娃高度是递减的，所以排序后，高度递增，宽度必然递增



#### 题目六

定义 step sum：比如 680，680 + 68 + 6 = 754，680 的 step sum 就是 754

给定一个整数 num，判断它是不是某个数的step sum？



分析：如果明确规定 num 是正数，则有

- 一个数增大，这个数的步骤和必然增大
- 一个数必然比这个数的步骤和小

所以这个数的范围就是 0 ~ step num，但是怎么缩小这个范围呢？

二分法



