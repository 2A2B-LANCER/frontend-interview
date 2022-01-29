#### 题目一

给定一个字符串 str，str 表示一个公式

公式里可能有整数，加减乘除符号和左右括号

返回公式的计算结果，难点在于括号可能嵌套很多层

str = “48 * ((70 - 65) - 43) + 8 * 1”，返回 -1816

str = "3  + 1 * 4"，返回 7

str = "3 + (1 * 4)"，返回 7

【说明】

1. 可以认为给定的字符串一定是正确的公式，即不需要对 str 做公式有效性检查
2. 如果是负数，就需要用括号括起来，比如 “4 * (-3)”，但如果负数作为公式的开头或者括号部分的开头，则可以没有括号，比如 “-3 * 4” 和 “(-3 * 4)” 都是合法的
3. 不用考虑计算过程中会发生溢出的情况



> https://leetcode-cn.com/problems/basic-calculator-iii/solution/



分析：做这道题之前，我们先想一下，没有括号的四则运算字符串如何实现计算

首先准备一个栈 stack；

变量 currentNum，表示当前收集到的操作数是多少，初始化为 0；

指针 point，从左往右遍历

1. 如果当前指针指向数字，循环收集操作数，currentNum = currentNum * 10 + str[point]，直到 point 指向 符号 为止
2. 判断栈顶是 加减 还是 乘除
   1. 加减，操作数直接入栈
   2. 乘除，弹出栈顶的两个元素，肯定一个操作数，一个符号，与 currentNum 运算完毕之后入栈
   3. point 指向的符号也入栈，point++，currentNum 恢复为 0
3. 直到 point === str.length；然后对栈内元素进行相应的加减操作



这个过程就定义了一种合理的四则运算的计算过程

然后我们再考虑这道题增加的难点：括号

括号在一个表达式中起到了作用？提升优先级

我们在进行计算的时候，肯定按照由内而外的顺序进行括号的运算的，因为括号的优先级比四则运算高，但是括号内本质上不也是 四则运算 吗？大不了嵌套括号，那就继续深入，直到你饿不没有括号，不就是 四则运算 吗？

所以上述的 普通四则运算过程其实就是该题的嵌套子过程，每一层递归运算一个括号内的四则运算，遇到括号就递归

```javascript
 * 计算结果
 */
var getRes = function(stack, currentNum){
  if(['+', '-', '*', '/'].includes(stack[stack.length - 1]) ||
  stack.length === 0){
    // 如果栈顶元素是操作符或者栈为空，就把当前收集到的操作数入栈
    stackPush(stack, currentNum)
  }
  // 加减运算，从左到右
  let left = stack.shift(),
      right,
      operator = null
  while(stack.length !== 0){
    operator = stack.shift()
    right = stack.shift()
    switch(operator){
      case "+":
        left += right;
        break;
      case "-":
        left -= right;
        break;
      case "*":
        left *= right
        break;
      case "/":
        left = Math.floor(left / right)
    }
  }
  return left
}

var stackPush = function(stack, value){
  if(stack[stack.length - 1] === '*'){
    stack.pop()
    stack.push(stack.pop() * value)
  }else if(stack[stack.length - 1] === '/'){
    stack.pop()
    let left = stack.pop()
    // 注意取整，LeetCode 中，向零取整
    if(left / value >= 0){
      stack.push(Math.floor(left / value))
    }else{
      stack.push(Math.ceil(left / value))
    }
  }else{
    stack.push(value)
  }
}

/**
 * str 是要计算的字符串
 * i 是计算的起始位置
 * 返回值,[res, index]
 * res 是这部分计算的结果
 * index 是这部分计算的末位置 + 1，也就是上层计算再次开始的位置
 */
var recursion = function(str, i){
  const stack = []
  let currentNum = 0,
      index = i
  while(index < str.length && ')' !== str[index]){
    if(str[index] >= '0' && str[index] <= '9'){
      // 收集操作数
      currentNum = currentNum * 10 + Number(str[index++])
    }
    if(['+', '-', '*', '/'].includes(str[index])){
      // 遇到操作符了，入栈
      stackPush(stack, currentNum)
      currentNum = 0
      stackPush(stack, str[index++])
    }
    if('(' === str[index]){
      // 遇到左括号了，递归
      [currentNum, index] = recursion(str, index + 1)
    }
  }
  return [getRes(stack, currentNum), index + 1]
}

var calculate = function(s) {
  return recursion(s.replace(/\s+/g, ""), 0)[0]
};
```

再回头分析一下，这种递归的思路可以运用到任何括号题当中去，因为他们的本质都是递归



#### 题目二

> https://leetcode-cn.com/problems/container-with-most-water/



分析：思路来自 数组三连问

双指针，高度小的可以进行结算，然后向中间靠近

蓄水量是以小高度进行计算的（木桶效应）

现在固定小高度这一端，另一端再往中间靠，已经不可能出现比当前值更大的蓄水量了（高不变或者变小，底变小，面积必然变小），所以固定的这一端已经没有继续当做边界的必要了，可以向中间移动

假设小高度这一端在更远处有更优解呢？那这个解也是没有意义的

因为如果更远处有更优解，那另一端的高度必然大于等于这个小高度，那么，固定另一端的进行求解的值必然比这个 更优解 大（因为我们的移动原理）

```javascript
var maxArea = function(height) {
  let left = 0,
      right = height.length - 1,
      max = 0
  while(left < right){
    max = Math.max(max, (right - left) * Math.min(height[left], height[right]))
    if(height[left] < height[right]){
      left++
    }else if(height[left] > height[right]){
      right--
    }else{
      left++
      right--
    }
  }
  return max
};
```



#### 题目五

给定一个字符二维数组 matrix，在给定一个字符串 word

可以从任何一个位置出发，向四个方向移动，能不能找到 word？

```javascript
matrix = [['a', 'b', 'z'],
          ['c', 'd', 'o'],
          ['f', 'e', 'o']]
```

设定一：可以走重复路的情况下，能不能找到

比如 word = "zoooz" 可以，z -> o -> o -> o -> z，因为可以重复走

设定二：不可以重复走

比如 word = "zoooz" 不可以



```javascript
// 可以重复
function findWord(matrix, word, row, col, index){
  if(index === word.length){
    return true
  }
  if(row < 0 ||
    row >= matrix.length ||
    col < 0 ||
    col >= matrix[0].length ||
    matrix[row][col] !== word[index]){
    return false
  }
  let left = findWord(matrix, word, row, col - 1, index + 1),
      up = findWord(matrix, word, row - 1, col, index + 1),
      right = findWord(matrix, word, row, col + 1, index + 1),
      down = findWord(matrix, word, row + 1, col, index + 1)
  return left || up|| right || down
}
```





```javascript
// 不可以重复
function findWord(matrix, word, row, col, index){
  if(index === word.length){
    return true
  }
  if(row < 0 ||
    row >= matrix.length ||
    col < 0 ||
    col >= matrix[0].length ||
    matrix[row][col] !== word[index]){
    return false
  }
  let copy = matrix[i][j]
  matrix[i][j] = 0
  let left = findWord(matrix, word, row, col - 1, index + 1),
      up = findWord(matrix, word, row - 1, col, index + 1),
      right = findWord(matrix, word, row, col + 1, index + 1),
      down = findWord(matrix, word, row + 1, col, index + 1)
  matrix[i][j] = copy
  return left || up || right || down
}
```





#### 题目六

给定一个矩阵 matrix，值可正可负可为零

蛇可以空降到最左列的任何一个位置，初始增长值是 0

蛇每一步可以选择右上、右、右下三个方向前进

沿途的数字累加起来，作为增长值；

但是蛇一旦增长值为负数，就会死亡

蛇有一种能力，可以使用一次；把某个格子里的数字变成相反数

蛇可以走到任何格子的时候停止

返回蛇能获得的最大增长值



分析：很经典的暴力递归转动态规划（能不能转不知道，可以去尝试）

如果我们设计一个动态规划：`process(matrix, x, y, power，prefixSum)`

-  `x，y` 表示蛇移动到的位置；
- `power` 表示能力是否还可以用；
- `prefixSum` 表示蛇从初始点到 (x, y) 已经积攒的增长值

这个暴力递归的初始调用是蛇移动的起点

如果我们这样设计暴力递归，即便最后可以转动态规划，dp 表也是四维的，这很明显不符合这道题的难度，所以这个方向不对

如果我们能把 `prefixSum` 从参数中移除，`power` 只有两个值，这样就可以分化为两张二维表了，这样看来才是可行的方向

那么如何把 增长值 从参数中移除呢？

增长值是随着蛇移动变化的，这样的话，如果我们的暴力递归的初始调用是从结果开始，那 增长值就可以作为暴力递归的返回值传递下来，这样就降低了动态规划表的维度

`process(matrix, x, y, power)`

接着考虑，这个递归的调用是从后往前的，但是这样的话，含义上来讲，`power` 调用的权利是后者给前者的，这不符合逻辑

但是 `power` 和 `prefixSum` 一样，也是动态变化的，那处理方法也一样，把它添加到返回值中去

至此，我们就设计出了有可能可以改成动态规划的暴力递归

`process(matrix, x, y)`

返回值包含两部分，一个是未使用过能力的，一个是使用过能力的

```javascript
function process(matrix, row, col){
  if(col === 0){
    if(matrix[row][col] < 0){
      return [-Infinity, -matrix[row][col]]
    }else{
      return [matrix[row][col], matrix[row][col]]
    }
  }
  // 不是起始列
  let [preNoUse, preUse] = process(matrix, row, col - 1)
  if(row > 0){
    let leftUp = process(matrix, row - 1, col - 1)
    preNoUse = Math.max(preNoUse, leftUp[0])
    preUse = Math.max(preUse, leftUp[1])
  }
  if(row < matrix.length - 1){
    let leftDown = process(matrix, row + 1, col - 1)
    preNoUse = Math.max(preNoUse, leftDown[0])
    preUse = Math.max(preUse, leftDown[1])
  }
  let res = [-Infinity, -Infinity]
  let noUse = matrix[row][col] + preNoUse,
      use = Math.max(-matrix[row][col] + preNoUse, matrix[row][col] + preUse)
  if(noUse >= 0){
    res[0] = noUse
  }
  if(use >= 0){
    res[1] = use
  }
  return res
}

function snack(matrix){
  if(!matrix || matrix.length === 0 || matrix[0].length === 0){
    return 0
  }
  let row = matrix.length,
      col = matrix[0].length,
      res = 0
  for(let i=0; i<row; i++){
    for(let j=0; j<col; j++){
      res = Math.max(res, ...process(matrix, i, j))
    }
  }
  return res
}
```

