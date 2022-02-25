#### 题目一

> https://leetcode-cn.com/problems/maximum-sum-of-3-non-overlapping-subarrays/

因为要选三个非重复的子数组，要求最后的和最大

那我们可以先定下来一个选择，然后从剩下的当中再选出两个最优解

假设我们必然选择 [i, i + k - 1]

那么我们需要再从[0, i - 1] 上选出一个长度为 k 的最优子数组

从 [i + k, length - 1] 上选出一个长度为 k 的最优子数组

这个过程必然是有重复计算的，那就可以先记录下一些值

- leftDp[i]：表示 0~i 上长度为 k 的最优子数组
- rightDp[i]：表示 i~length - 1 上长度为 k 的最优子数组

这样就可以省去重复计算

上面说的求解过程的时间复杂度是 O(N)

现在来看求 leftDp 和 rightDp 的时间复杂度

这个的话我们可以先求辅助数组:

- left[i]：表示 [i - k + 1, i] 这个长度为 k 的子数组的累加和
- right[i]：表示 [i, i + k - 1] 这个长度为 k 的子数组的累加和

然后就可以求得 leftDp 和 rightDp 了

这个的时间复杂度也是 O(N)

```javascript
var maxSumOfThreeSubarrays = function(nums, k) {
  if(nums.length === 3 * k){
    return [0, k, 2 * k]
  }
  let help = new Array(nums.length).fill(0),
      sum = 0
  for(let i = 0; i < k; i++){
    sum += nums[i]
  }
  help[k - 1] = sum
  for(let i = k; i < nums.length; i++){
    help[i] = help[i - 1] + nums[i] - nums[i - k]
  }
  let leftDp = new Array(nums.length).fill(0),
      leftMap = new Array(nums.length).fill(0)
  leftDp[k - 1] = help[k - 1]
  leftMap[k - 1] = 0
  for(let i = k; i < nums.length; i++){
    if(help[i] > leftDp[i - 1]){
      leftDp[i] = help[i]
      leftMap[i] = i - k + 1
    }else{
      leftDp[i] = leftDp[i - 1]
      leftMap[i] = leftMap[i - 1]
    }
  }
  sum = 0
  for(let i = nums.length - 1; i > nums.length - 1 - k; i--){
    sum += nums[i]
  }
  help = new Array(nums.length).fill(0)
  help[nums.length - k] = sum
  for(let i = nums.length - 1 - k; i >= 0; i--){
    help[i] = help[i + 1] + nums[i] - nums[i + k]
  }
  let rightDp = new Array(nums.length).fill(0),
      rightMap = new Array(nums.length).fill(0)
  rightDp[nums.length - k] = help[nums.length - k]
  rightMap[nums.length - k] = nums.length - k
  for(let i = nums.length - 1 - k; i >= 0; i--){
    if(help[i] >= rightDp[i + 1]){
      rightDp[i] = help[i]
      rightMap[i] = i
    }else{
      rightDp[i] = rightDp[i + 1]
      rightMap[i] = rightMap[i + 1]
    }
  }
  let max = 0,
      res = nums
  for(let i = k; i < nums.length - 2 * k + 1; i++){
    let mid = help[i],
        left = leftDp[i - 1],
        right = rightDp[i + k]
    if(mid + left + right > max){
      max = mid + left + right
      res = [leftMap[i - 1], i, rightMap[i + k]]
    }
  }
  return res
};
```



#### 题目二-接雨水

> https://leetcode-cn.com/problems/trapping-rain-water/

接雨水经典问题

经典做法就是，正着遍历一遍，求出 i 左侧的最高值；倒着遍历一遍，求出 i 右侧的最高值；最后遍历一遍，求出 i 的蓄水量，时间复杂度是 O(N)，额外空间复杂度是 O(3 * N)

但是可以优化

两个端点是不可能蓄水的，他们只能给最高值做出贡献

定义如下变量：

- left：待决定蓄水量的左端点
- right：待决定蓄水量的右端点
- leftMax：左侧目前探测到的最高值
- rightMax：右侧目前探测到的最高值

现在两端向中间靠拢

leftMax 和 rightMax 小的一端，就可以决定蓄水量了

比如现在 leftMax < rightMax

因为 left 的左边最大值就是 leftMax；右边的最大值大于等于 rightMax，那也大于 leftMax；所以对于 left 这点来说，已经毋庸置疑了，所以可以决定

右边同理

当 leftMax === rightMax 的时候，说明两个端点都可以决定了

```javascript
var trap = function(height) {
  let left = 1,
      right = height.length - 2,
      leftMax = height[0],
      rightMax = height[height.length - 1],
      water = 0
  while(left <= right){
    if(leftMax <= rightMax){
      water += Math.max(0, leftMax - height[left])
      leftMax = Math.max(leftMax, height[left++])
    }else{
      water += Math.max(0, rightMax - height[right])
      rightMax = Math.max(rightMax, height[right--])
    }
  }
  return water
};
```



#### 题目三

一个不含有负数的数组可以代表一圈环形山，每个位置的值代表山的高度

比如，[3,1,2,4,5]、[4,5,3,1,2] 代表同样结构的环形山

山峰 A 和 B 能够互相看见的条件是：

- 如果 A 和 B 是同一座山，认为不能相互看见
- 如果 A 和 B 是不同的山，并且在环中相邻，认为可以相互看见
- 如果 A 和 B 是不同的山，并且在环中不相邻，架设两座山高度的最小值是 min
  - 如果 A 通过顺时针方向到 B 的途中没有高度比 min 大的山峰，认为 A 和 B 可以相互看见
  - 如果 A 通过逆时针方向到 B 的途中没有高度比 min 大的山峰，认为 A 和 B 可以相互看见

两个方向只要有一个可以看见，A 和 B 就可以相互看见

给定一个不含有负数且没有重复值的数组 arr，请返回有多少对山峰能相互看见



进阶问题：给定一个不含有负数但可能有重复值的数组 arr，返回有多少对山峰能相互看见

1:01