#### 题目一

给定一个非负数组成的数组，长度一定大于1

想知道数组中哪两个数 & 的结果最大

返回这个最大结果



分析：如果暴力解的话，每个数都和其他的数进行 & 操作，那时间复杂度就是 O(N^2)

现在我们考虑位运算。不管几个数，进行任何位运算，只要想求最大值，那就必然是想要除符号位外的高位尽量为 1；比如第5位是 1，即便 1~4 位都是 1，也不会比 第五位是 1 大；所以我们就可以模拟一个高位到低位的淘汰机制，比如上一节的前缀树，比如接下来的淘汰机制：

因为所有数字都是非负数，所以符号位肯定是 0，那就从第 63 位开始验证

1. 验证当前位是否为 1
   1. 是 1，该数可能是结果之一，留待考察
   2. 不是 1，该数必然不是结果之一，淘汰
2. 当前位判断完毕
   1. 未被淘汰的数字大于 2 个，结果肯定在其中，所以当前位必然是 1，把结果值当前位置为 1
   2. 未被淘汰数字小于 2 个，结果不一定在其中，这一轮淘汰的数字都有可能，所以这一轮淘汰的数字都是待考察对象；
   3. 未被淘汰数字等于 2 个，结果肯定就是这两个数字按位与了，返回结果值
3. 如果仍未返回，考察下一位，重复上述过程

```javascript
function maxAndValue(arr){
  // [0, garbageBorder - 1]是需要验证当前位的区域
  // [garbageBorder, arr.length - 1]是在之前某位淘汰的区域
  let garbageBorder = arr.length,
      max = 0
  for(let bit = 62; bit >= 0; bit--){
    let i=0,
        tmp = garbageBorder
    while(i < garbageBorder){
      if(arr[i] & (1 << bit) !== 1){
        garbageBorder--;
        [arr[i], arr[garbageBorder]] = [arr[garbageBorder], arr[i]]
      }else{
        i++
      }
    }
    if(garbageBorder > 2){
      // 有多个数字在 bit位 是 1
      max |= (1 << bit)
    }else if(garbageBorder < 2){
      // 少于 2 个数字在 bit位 是 1，那结果的 bit位不可能是1
      garbageBorder = tmp
    }else{
      // 正好 2 个数字在 bit位 是 1，结果肯定是这两个数字按位与
      return arr[0] & arr[1]
    }
  }
}
```



#### 题目二

> https://leetcode-cn.com/problems/binary-tree-cameras/



分析：二叉树的递归套路问题

我的第一反应，回归到某一节点必须以该节点为根节点的子树全覆盖，有两种情况：

1. 当前节点没有相机，要都覆盖到，只能它的子节点有相机，那就是 `Math.min(左有相机 + Math.min(右有相机，右无相机)，Math.min(左有相机，左无相机) + 右有相机)`
2. 当前节点有相机，那就是 `1 + Math.min(左有相机，左无相机) + Math.min(右有相机，右无相机)`
3. `Math.min(1, 2)`

**但是，这样想必然会造成相机的浪费，因为第二种情况的时候，子节点都是被覆盖的，当前节点放相机，不如在父节点放相机**

相机的覆盖范围是父、本身、子节点，这样的话，本身其实是可以不覆盖到的，留给父节点去解决

所以，递归思想改为，回归到某一节点时，不包含该节点的子树必须全覆盖：

1. 当前节点没有被覆盖，需要的最少相机数
2. 当前节点被覆盖，但是当前节点没有相机，需要的最少相机数
3. 当前节点被覆盖，而且当前节点有相机，需要的最少相机数

base case：

1. 叶子节点放置相机，`null` 被覆盖，但是当前节点没有相机，子树需要 0 台相机
2. 叶子节点的父节点放置相机，`null` 没有被覆盖，最少需要 0 台相机
3. `null` 节点不可能放置相机，所以第三种情况不可能，至少需要 `Infinity` 台相机



```javascript
function dfs(node){
  if(!node){
    return [0, 0, Infinity]
  }
  let left = dfs(node.left),
      right = dfs(node.right)
  return [left[1] + right[1],
  Math.min(left[2] + Math.min(right[1], right[2]), Math.min(left[1], left[2]) + right[2]),
  1 + Math.min(...left) + Math.min(...right)]
}
var minCameraCover = function(root) {
  let res = dfs(root)
  return Math.min(res[0] + 1, res[1], res[2])
};
```

因为整棵树根节点的返回值中，第一种情况根节点没有被覆盖，所以需要 + 1

 

其实上述过程是可以通过贪心求解的

我们可以知道，如果子节点处于被覆盖状态的话，当前节点是没有必要放置相机的

但是当前节点仍旧是有上述三种状态的

所以可以更改为以下版本：res[0] 控制状态，res[1] 控制相机数量

```javascript
// 贪心版本
function dfs(node){
  if(!node){
    return [1, 0]
  }
  let left = dfs(node.left),
      right = dfs(node.right)
  if([left[0], right[0]].includes(0)){
    return [2, left[1] + right[1] + 1]
  }else if(left[0] === 1 && right[0] === 1){
    return [0, left[1] + right[1]]
  }else{
    return [1, left[1] + right[1]]
  }
}
var minCameraCover = function(root) {
  let res = dfs(root)
  return res[1] + ((res[0] === 0) ? 1 : 0)
};
```



#### 题目三

给定一个数组 arr

返回如果排序后，相邻两数的最大差值

要求：时间复杂度 O(N)

>  https://leetcode-cn.com/problems/maximum-gap/
>

分析：桶排序的思想

一共 N 个数，平分到 N + 1 个桶里，每个桶只记录自己范围内的最大值和最小值，可以预见的是，至少会有一个桶是空的，每个桶的范围都是（(max - min) / (N + 1)）

根据我们分数进桶的规则可以知道，两个相邻的非空桶，左边桶的最大值，在排序之后，一定会挨着右边桶的最小值，所以并且，这个值是可以超过（(max - min) / (N + 1)）的

但是同一个桶内，相邻两数的最大差值肯定不过（(max - min) / (N + 1)）

由此可知，同一个桶内的解不可能是最终结果，因为 **至少有一个桶是空的**，这也就意味着至少有两个桶内的最大最小值的差值是超过（(max - min) / (N + 1)）的

这样，我们就淘汰了一众 **平凡解**

然后，只需要去判断两个相邻桶的最大最小差值就 OK 了

```javascript
function maxDifference(arr){
  if(!arr || arr.length < 2 || Math.min(...arr) === Math.max(...arr)){
    return 0
  }
  let min = Math.min(...arr),
      max = Math.max(...arr),
      len = arr.length,
      hasNum = new Array(len + 1).fill(false),
      mins = new Array(len + 1).fill(0),
      maxs = new Array(len + 1).fill(0)
  for(let i=0; i<len; i++){
    let bid = Math.floor(((arr[i] - min) * (len + 1)) / (max - min))
    mins[bid] = hasNum[bid] ? Math.min(mins[bid], arr[i]) : arr[i]
    maxs[bid] = hasNum[bid] ? Math.max(maxs[bid], arr[i]) : arr[i]
    hasNum[bid] = true
  }
  let res = 0,
      lastMax = maxs[0]
  for(let i=1; i<=len; i++){
    if(hasNum[i]){
      res = Math.max(res, mins[i] - lastMax)
      lastMax = maxs[i]
    }    
  }
  return res
}
```



#### 题目四

给定一个有序数组 arr，其中的可正可负可为零

返回 arr 中每个数都平方之后不同的结果有多少种？



分析：这个题的意思是，arr 中每个数都平方之后这个数组有多少非重复值，因为如果同时存在 -1和 1，那他们平方之后是一样的，这算一种结果

这样的话，第一种方法，直接取绝对值，然后放入 Set，自动去重

第二种方法：双指针

谁指向的数字绝对值大，谁向中间移动；一样大就都移动，直到left > right

注意：如果存在重复值比如说：[-8, -8, -8, -7, -6, 0, 6, 8, 8, 8, 9]，这里的 -8应该都算作一个结果

```javascript
function powRes(arr){
  if(!arr || arr.length === 0){
    return 0
  }
  let left = 0,
      right = arr.length - 1,
      res = 0
  while(left <= right){
    if(Math.abs(arr[left]) === Math.abs(arr[right])){
      while(arr[left + 1] === arr[left]){
        left++
      }
      left++
      while(arr[right - 1] === arr[right]){
        right--
      }
      right--
    }else if(Math.abs(arr[left]) < Math.abs(arr[right])){
      while(arr[right - 1] === arr[right]){
        right--
      }
      right--
    }else{
      while(arr[left + 1] === arr[left]){
        left++
      }
      left++
    }
    res++
  }
  return res
}
```



给定一个数组 arr，先递减然后递增，

返回 arr 中有多少个不同的数字

这个也类似



#### 题目七

假设所有字符都是小写字母，大字符串是 str

arr 是去重的单词表，每个单词都不是空字符串且可以使用任意次

使用 arr 中的单词有多少种拼接 str 的方式

返回方法数



```javascript
// 从左到右模型 O(N^3)
function process(str, i, arr){
  if(i === str.length){
    return 1
  }
  let ways = 0,
      len = str.length
  for(let index = i + 1; index <= len; index++){
    if(arr.includes(str.slice(i, index))){
      ways += process(str, index, arr)
    }
  } 
  return ways
}

function wordsBreak(str, arr){
  if(!str || str === "" || !arr || arr.length === 0){
    return 0
  }
  return process(str, 0, arr)
}
```



分析时间复杂度，dp 的长度是 N，然后每轮内部循环，N，内部还有判断子串是不是合法片段，N，一共 O(N^3)

但是，如果我们把单词表预处理为前缀树，那么每轮内部，寻找一个前缀是否在单词表内的时间复杂度就降为了 O(1)，然后搜索前缀的次数不确定 O(N)，这样就降低为了 O(N^2)



```javascript
function process(str, i, trie){
  if(i === str.length){
    return 1
  }
  let ways = 0,
      len = str.length,
      node = trie
  for(let index = i; index < len; index++){
    let path = str[index].charCodeAt(0) - 97
    if(node[path] === null){
      break
    }
    node = node[path]
    if(node[26]){
      ways += process(str, index + 1, trie)
    }
  }
  return ways
}

function wordsBreak(str, arr){
  if(!str || str === "" || !arr || arr.length === 0){
    return 0
  }
  let root = new Array(27).fill(null),
      len = arr.length
  root[26] = false
  for(let i=0; i<len; i++){
    let target = arr[i],
        width = target.length,
        node = root
    for(let j = 0; j<width; j++){
      let index = target[j].charAt(0) - 97
      if(node[index] === null){
        node[index] = new Array(27).fill(null)
        node[index][26] = false
      }
      node = node[index]
    }
    node[26] = true
  }
  return process(str, 0, root)
}
```

