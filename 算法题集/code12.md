#### 题目一

给定长度为 m 的字符串 aim，以及一个长度为 n 的字符串 str

问能否在 str 中找到一个长度为 m 的子串

使得这个子串刚好由 aim 的 m 个字符组成，顺序无所谓，

返回任意一个满足条件的子串的起始位置

未找到返回 -1

> https://leetcode-cn.com/problems/permutation-in-string/submissions/

分析：

这题要找的不是完全相同的子串，而是和目标字符串词频相同的子串

所以 KMP 用不了

如果用递归的话，**需要回头**，所以会很麻烦，暂时不考虑（基本排除递归）

再考虑到的，就是滑动窗口了，二者词频相同，所以长度相同，那我只需要维护一个 m 长度的窗口，待二者词频相同的时候，就是答案

维护窗口的时间复杂度是 O(N)，那现在问题就是判断词频了

因为没说每个字符出现次数，所以无限制，那就不能用位图

那就需要维护一张词频表，最直接的办法就是，用目标字符串初始化词频表，窗口中出现一个字符，该字符在表中词频就减一；反之加一。待整张表都是 0 的时候就是答案

但是这样判断的话，每次滑动窗口都要判断，那时间复杂度就是 O(N^2)，也可以接受

但是还可以优化

我们再设置一个变量，记录剩余的所有词频数量，只有这个变量为 0 的时候，才有可能是答案，步骤如下：

1. 初始化词频表 `map`，初始化 总词频数量 `all`
2. 开始滑动窗口
   1. 窗口长度小于目标长度，right++，更新 `map` 和 `all`
   2. 窗口长度等于目标长度，left++, right++，更新 `map` 和 `all`
   3. 如果 `map[x]` 大于等于 0，那么 `all` 与其同增同减；否则 `all` 不变，因为这个字符是 **无效变化**
   4. 当 `all` 等于 0 的时候，判断 `map` 是否都是 0，是则返回 left，否则继续



```javascript
function containExactly(str, aim){
  if(!str || !aim || str.length > aim.length){
    return -1
  }
  let len = str.length,
      width = aim.length,
      map = new Array(256).fill(0),
      all = len,
      right = 0
  for(let i=0; i<len; i++){
    map[str.charCodeAt(i)]++
  }
  for(; right<len; right++){
    if(map[aim.charCodeAt(right)]-- > 0){
      all--
    }
  }
  for(; right<width; right++){
    if(all === 0 && map.find((x) => x !== 0) === undefined){
      return right - len
    }
    if(map[aim.charCodeAt(right)]-- > 0){
      all--
    }
    if(map[aim.charCodeAt(right - len)]++ >= 0){
      all++
    }
  }
  if(all === 0 && map.find((x) => x !== 0) === undefined){
    return right - len
  }
  return -1
}
```



#### 题目三

> https://leetcode-cn.com/problems/median-of-two-sorted-arrays/

问题一：给定两个等长有序数组，返回整体的上中位数

```javascript
function getUpMedian(nums1, nums2){
  let s1 = 0,
      e1 = nums1.length,
      s2 = 0,
      e2 = nums2.length
  while(s1 < e1 && s2 < e2){
    let mid1 = s1 + ((e1 - s1) >> 1),
        mid2 = s2 + ((e2 - s2) >> 1)
    if(nums1[mid1] === nums2[mid2]){
      // 1. 二者相等肯定一个上中位数，一个下中位数，返回其一即可
      return nums1[mid1]
    }
    if(((e1 - s1 + 1) & 1) === 1){
      // 奇数长度
      if(nums1[mid1] > nums2[mid2]){
        if(nums1[mid1 - 1] < nums2[mid2]){
          return nums2[mid2]
        }else{
          e1 = mid1 - 1
          s2 = mid2 + 1
        }
      }else{
        if(nums2[mid2 - 1] < nums1[mid1]){
          return nums1[mid1]
        }else{
          e2 = mid2 - 1
          s1 = mid1 + 1
        }
      }
    }else{
      // 偶数长度，可以直接判断
      if(nums1[mid1] > nums2[mid2]){
        e1 = mid1
        s2 = mid2 + 1
      }else{
        s1 = mid1 + 1
        e2 = mid2
      }
    }
  }
  return Math.min(nums1[s1], nums2[s2])
}
```



问题二：给定两个有序数组（长度不定），返回整体的第 k 小的数字

```javascript
function findKthNum(nums1, nums2, k){
  const long = nums1.length >= nums2.length ? nums1 : nums2,
        short = nums1.length < nums2.length ? nums1 : nums2
  if(k <= short.length){
    // 1. k 比短的还小
    return getUpMedian(short, 0, k - 1, long, 0, k - 1)
  }
  if(k > short.length && k <= long.length){
    // 2. k 在长短之间
    if(long[k - short.length - 1] > short[short.length - 1]){
      return long[k - short.length - 1]
    }
    return getUpMedian(short, 0, short.length - 1, long,  k - short.length, k - 1)
  }
  if(k > long.length){
    // 3. k 比长的还大
    // 此时需要手动判断开头两个是否是答案
    if(short[k - long.length - 1] >= long[long.length - 1]){
      return short[k - long.length - 1]
    }
    if(long[k - short.length - 1] >= short[short.length - 1]){
      return long[k - short.length - 1]
    }
    return getUpMedian(short, k - long.length, short.length - 1, long, k - short.length, long.length - 1)
  }
}
```



#### 题目四

> https://leetcode-cn.com/problems/regular-expression-matching/ 



分析：

1. 检验数据有效性
   1. `s` 如果有 `.` 或 `*` 直接返回 `false`
   2. `p` 的第一个字符如果是 `*` 或者两个 `*` 连着出现，返回 `false`
2. 定义递归函数 `process(s, si, p, pi)` 含义为：s 中 从 si 开头的子串能否被 p 从 pi 开头的子串完全匹配（**样本对应模型**）



```javascript
var isMatch = function(s, p) {
  return process(s, 0, p, 0)
};

function process(s, si, p, pi){
  if(pi === p.length && si === s.length){
    return true
  }
  if(pi + 1 === p.length || p[pi + 1] !== '*'){
    // 首先检验 pi + 1 是否越界，因为后面的判断用到了 pi + 1
    // 因为 * 可以匹配 0~多个前面字符，所以判断下一个是不是 *
    // 不是 * 的话，当前字符必须匹配
    // 即 p[pi] 必须是 s[si] 或者 .
    if(si !== s.length && [s[si], '.'].includes(p[pi])){
      // s不能到头，因为 pi 还没到头，而且下一个 pi 不是 *（如果是的话，可以匹配0个）
      // 这时候 s 到头的话，就不能完全匹配了 
      return process(s, si + 1, p, pi + 1)
    }else{
      return false
    } 
  }
  // pi + 1 是 *
  // 这样的话 就可以有 0~无穷个 p[pi]
  while(si !== s.length && [s[si], '.'].includes(p[pi])){
    // * 分别匹配 0/1/2/3...个 p[pi] 进行递归
    if(process(s, si++, p, pi + 2)){
      return true
    }
  }
  // si 到头了，或者 s[si] 和之前不一样了，* 匹配不上了，
  // 这种情况也是有可能成功的，所以再进行一次递归
  return process(s, si, p, pi + 2)
}
```





#### 题目五

> https://leetcode-cn.com/problems/longest-consecutive-sequence/



```javascript
// 一张头表，一张尾表
// 分别存储片段的头尾
var longestConsecutive = function(nums) {
  nums = Array.from(new Set(nums))
  let head = new Map(),
      tail = new Map(),
      max = 0,
      len = nums.length
  for(let i = 0; i < len; i++) {
    let preLen = 0,
        postLen = 0,
        all = 1
      if(tail.has(nums[i] - 1)){
        preLen = tail.get(nums[i] - 1)
        tail.delete(nums[i] - 1)
      }
      if(head.has(nums[i] + 1)){
        postLen = head.get(nums[i] + 1)
        head.delete(nums[i] + 1)
      }
      all += preLen + postLen
      head.set(nums[i] - preLen, all),
      tail.set(nums[i] + postLen, all)
      max = Math.max(max, all)
  }
  return max
};
```

