#### 题目一

问题一：一个字符串至少需要添加多少个字符能整体变成回文串

> https://leetcode-cn.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/

```javascript
// 范围尝试模型
/**
 * dp[i][j]：指 i~j范围上，要形成回文串最少要添加的字符数
 */
var minInsertions = function(s) {
  const len = s.length,
        dp = new Array(len).fill(0).map(() => new Array(len).fill(0))
  for(let i=0; i<len - 1; i++){
    if(s[i] !== s[i + 1]){
      dp[i][i + 1] = 1
    }
  }
  for(let i = len - 3; i >= 0; i--){
    for(let j = i + 2; j < len; j++){
      if(s[i] === s[j]){
        dp[i][j] = dp[i + 1][j - 1]
      }else{
        dp[i][j] = Math.min(dp[i][j - 1] + 1, dp[i + 1][j] + 1)
      }
    }
  }
  return dp[0][len - 1]
};
```

问题二：返回问题一的其中一种结果

```javascript
/**
 * 动态规划表回溯
 * 从终点往回判断每一步的落点
 * 必然可以找到一种答案
 */
function minInsertionsOneWay(s){
  const len = s.length,
        dp = new Array(len).fill(0).map(() => new Array(len).fill(0))
  for(let i=0; i<len - 1; i++){
    if(s[i] !== s[i + 1]){
      dp[i][i + 1] = 1
    }
  }
  for(let i = len - 3; i >= 0; i--){
    for(let j = i + 2; j < len; j++){
      dp[i][j] = Math.min(dp[i][j - 1] + 1,
        dp[i + 1][j] + 1,
        s[i] === s[j] ? dp[i + 1][j - 1] : dp[i + 1][j - 1] + 2)
    }
  }
  let res = new Array(len + dp[0][len - 1]).fill(0),
      resL = 0,
      resR = res.length - 1,
      L = 0,
      R = len - 1
  while(L < R){
    if(dp[L][R - 1] === dp[L][R] - 1){
      res[resL++] = s[R]
      res[resR--] = s[R--]
    }else if(dp[L + 1][R] === dp[L][R] - 1){
      res[resL++] = s[L]
      res[resR--] = s[L++]
    }else{
      res[resL++] = s[L++]
      res[resR--] = s[R--]
    }
  }
  res[resL] = s[L]
  return res.join('')
}
```



问题三：返回问题一的所有结果

```javascript
function minInsertionsAllWays(s){
  const len = s.length,
        dp = new Array(len).fill(0).map(() => new Array(len).fill(0))
  for(let i=0; i<len - 1; i++){
    if(s[i] !== s[i + 1]){
      dp[i][i + 1] = 1
    }
  }
  for(let i = len - 3; i >= 0; i--){
    for(let j = i + 2; j < len; j++){
      dp[i][j] = Math.min(dp[i][j - 1] + 1,
        dp[i + 1][j] + 1,
        s[i] === s[j] ? dp[i + 1][j - 1] : dp[i + 1][j - 1] + 2)
    }
  }
  let res = new Array(len + dp[0][len - 1]).fill(0),
      ans = []
  getOneWay(ans, res, 0, res.length - 1, s, 0, len - 1, dp)
  return ans
}

function getOneWay(ans, res, resL, resR, s, L, R, dp){
  if(resL >= resR){
    if(resL === resR){
      res[resL] = s[L]
    }
    return ans.push(res.join(''))
  }
  if(s[L] === s[R] && (L === R - 1 || dp[L + 1][R - 1] === dp[L][R])){
    res[resL] = s[L]
    res[resR] = s[R]
    getOneWay(ans, res, resL + 1, resR - 1, s, L + 1, R - 1, dp)
  }else{
    if(dp[L][R - 1] === dp[L][R] - 1){
      res[resL] = s[R]
      res[resR] = s[R]
      getOneWay(ans, res, resL + 1, resR - 1, s, L, R - 1, dp)
    }
    if(dp[L + 1][R] === dp[L][R] - 1){
      res[resL] = s[L]
      res[resR] = s[L]
      getOneWay(ans, res, resL + 1, resR - 1, s, L + 1, R, dp)
    }
  }
}
```



#### 题目二

问题一：一个字符串至少要切几刀能让切出来的子串都是回文串

> https://leetcode-cn.com/problems/palindrome-partitioning-ii/ 

```javascript
// 从左到右的尝试模型
// dp[i]：从 i ~ 末尾，至少要分成几段回文串
var minCut = function(s) {
  let map = createCheckMap(s)
  let dp = new Array(s.length + 1).fill(Infinity)
  dp[s.length] = 0
  for(let i = s.length - 1; i >= 0; i--){
    if(map[i][s.length - 1]){
      dp[i] = 1
    }else{
      for(let j = i; j < s.length; j++){
        if(map[i][j]){
          dp[i] = Math.min(dp[i], 1 + dp[j + 1])
        }
      }
    }
  }
  return dp[0]
};

var createCheckMap = function(s){
  let map = new Array(s.length).fill(0).map(() => new Array(s.length).fill(false))
  for(let i=0; i<s.length; i++){
    map[i][i] = true
    if(s[i] === s[i + 1]){
      map[i][i + 1] = true
    }
  }
  for(let i = s.length - 3; i >= 0; i--){
    for(let j = i + 2; j < s.length; j++){
      if(s[i] === s[j] && map[i + 1][j - 1]){
        map[i][j] = true
      }
    }
  }
  return map
}
```



第二问：返回其中一种结果

```javascript
var minCut = function(s) {
  let map = createCheckMap(s)
  let dp = new Array(s.length + 1).fill(Infinity)
  dp[s.length] = 0
  for(let i = s.length - 1; i >= 0; i--){
    if(map[i][s.length - 1]){
      dp[i] = 1
    }else{
      for(let j = i; j < s.length; j++){
        if(map[i][j]){
          dp[i] = Math.min(dp[i], 1 + dp[j + 1])
        }
      }
    }
  }
  let res = [],
      start = 0
  for(let i = 1; i <= s.length; i++){
    if(map[start][i - 1] && dp[start] === dp[i] + 1){
      res.push(s.substring(start, i))
      start = i
    }
  }
  return res.join(' ')
};

var createCheckMap = function(s){
  let map = new Array(s.length).fill(0).map(() => new Array(s.length).fill(false))
  for(let i=0; i<s.length; i++){
    map[i][i] = true
    if(s[i] === s[i + 1]){
      map[i][i + 1] = true
    }
  }
  for(let i = s.length - 3; i >= 0; i--){
    for(let j = i + 2; j < s.length; j++){
      if(s[i] === s[j] && map[i + 1][j - 1]){
        map[i][j] = true
      }
    }
  }
  return map
}
```



第三问：返回所有结果

```javascript
var minCut = function(s) {
  let map = createCheckMap(s)
  let dp = new Array(s.length + 1).fill(Infinity)
  dp[s.length] = 0
  for(let i = s.length - 1; i >= 0; i--){
    if(map[i][s.length - 1]){
      dp[i] = 1
    }else{
      for(let j = i; j < s.length; j++){
        if(map[i][j]){
          dp[i] = Math.min(dp[i], 1 + dp[j + 1])
        }
      }
    }
  }
  let ans = []
  getOneWay(ans, [], s, map, dp, 0)
  return ans
};

var getOneWay = function(ans, res, s, map, dp, start){
  if(start === s.length){
    ans.push(res.join(' '))
    return
  }
  for(let i = start; i <= s.length; i++){
    if(map[start][i - 1] && dp[start] === dp[i] + 1){
      res.push(s.substring(start, i))
      getOneWay(ans, res, s, map, dp, i)
      res.pop()
    }
  }
}

var createCheckMap = function(s){
  let map = new Array(s.length).fill(0).map(() => new Array(s.length).fill(false))
  for(let i=0; i<s.length; i++){
    map[i][i] = true
    if(s[i] === s[i + 1]){
      map[i][i + 1] = true
    }
  }
  for(let i = s.length - 3; i >= 0; i--){
    for(let j = i + 2; j < s.length; j++){
      if(s[i] === s[j] && map[i + 1][j - 1]){
        map[i][j] = true
      }
    }
  }
  return map
}
```

