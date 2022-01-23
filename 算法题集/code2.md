#### 题目一

给定数组 hard 和 money，长度都为 N

hard[i] 表示 i 号工作的难度，money[i] 表示 i 号工作的收入

给定数组 ability，长度为 M，ability[i] 表示 i h号人员的能力

每号工作都可以提供无限的岗位，难度和收入相对于所有人相同

但是人的能力必须大于等于这份工作的难度才能上岗

返回一个长度为 M 的数组 ans，ans[i] 表示 i 号人员能获得的最好收入



分析：最朴素的做法就是，按照 money降序 给 hard 数组和 money 数组排序，然后每个人遍历，第一份能干的工作就是最高收入，时间复杂度 O(N * M)



第二种思路：

对于一个人是否能干一份工作的衡量标准就是 能力是否大于等于难度，所以，我们可以对数据进行一些清洗

1. 当难度相同的时候，我没有必要去做酬劳更低的工作，所以这样的数据删除掉
2. 当难度上升的时候，我也没有必要去做酬劳更低的工作，所以这样的数据也删除掉

然后以难度为标准，给酬劳排序；现在难度上升，酬劳一定上升，所以就可以用二分查找来寻找小于等于能力的难度的最大酬劳工作了（有序表的应用）

时间复杂度 O(M * log(N))

```javascript
function getPays(hard, money, ability){
  let jobs = money.map((value, index) => [value, hard[index]]),
      set = new Set()
  jobs.sort((a, b) => (a[1] - b[1]) || (b[0] - a[0]))
  set.add(jobs[0][1])
  for(let i=1; i<jobs.length; i++){
    if(set.has(jobs[i][1]) || jobs[i][0] <= jobs[i - 1][0]){
      jobs.splice(i--, 1)
    }else{
      set.add(jobs[i][1])
    }
  }
  set = null
  
  let pays = [], len = ability.length
  for(let i=0; i<len; i++){
    let abl = ability[i],
        left = 0,
        right = jobs.length - 1,
        pay = 0
    while(left <= right){
      let mid = left + ((right - left) >> 1)
      if(jobs[mid][1] > abl){
        right = mid - 1
      }else if(jobs[mid][1] <= abl){
        pay = jobs[mid][0]
        left = mid + 1
      }
    }
    pays.push(pay)
  }
  return pays
}
```



#### 题目二

时间限制： 3000MS 内存限制： 589824KB

贩卖机只支持硬币支付，且收退都只支持 10,50,100三种面额

一次购买只能出一瓶可乐，且投钱和找零都遵循优先使用大钱的原则

需要购买的可乐数量是 m （最大的数量级为 10^18）

其中手头有的 10 元 a 张；50 元 b 张；100 元 c 张

可乐的价格是 x （x 是 10 的倍数）

请计算出需要投入硬币的次数？



 分析：这道题看完之后就知道不能递归模拟这个过程了，因为 m 的最大数量级是 10^18，远超 10^8，所以想其他的办法吧

并且，没办法动态规划，因为买的过程不能决策，规定投钱和找零都是大钱优先了，所以参数定下来之后，整个过程的细节其实就都已经定下来了

别的办法就只能想 钱 和 单价之间怎么操作了，面值很少，3种，这个应该是可以进行模拟的，大钱优先，那我们可以先耗尽尽可能大的面值，直到这种面值不能再单独用来买可乐，注意

1. 如果可乐的单价比某一面值大，那只用这种面值购买可能会出现余数，这时候就要余数就变成了历史遗留问题，因为大数优先
2. 当我按照大数优先的规则使用到某一面值为主要钱的时候，比这个面值大于等于的面值钱，不可能会被找回，因为我买的时候就不会付超过当前面值 1 倍的额外钱数
3. 历史遗留问题可能会跨过某一面值，将这一面值的钱和数量也化为历史遗留问题

这样的话，就确定下来模拟流程了

1. 面值从大到小开始支付，当前面值的第一瓶可乐配合历史遗留问题进行购买
   1. 当前面值能和历史遗留凑出一瓶可乐，历史遗留重复为 0，还需要购买的可乐数量 - 1；然后把找的钱加入到对应面值的数量当中
   2. 凑不出一瓶可乐，当前面值和数量加入到历史遗留
2. 开始计算当前面值能购买几瓶可乐
   1. 当前面值几张才能购买一瓶可乐
   2. 只用当前面值能购买几瓶可乐（这个要和还需购买的可乐数量取最小）；更新还需购买的可乐数量
   3. 一和二就能算出只用当前面值需要投入的硬币次数了，加入到总次数当中；
   4. 一和二还能还能算出当前面值有几张成为了历史遗留，加入到历史遗留中
   5. 计算找零，加入到对应的面值数量当中
3. 循环以上步骤面值种类次
4. 如果最后能够买完目标数量的可乐，返回投币次数，否则返回 -1

```javascript
function getRest(faceValue, nums, i, oneTimeRest, times){
  for(; i < 3; i++){
    nums[i] += Math.floor(oneTimeRest / faceValue[i]) * times
    oneTimeRest %= faceValue[i]
  }
}

function buyColas(a, b, c, x, m){
  let faceValue = [100, 50, 10],
      nums = [c, b, a],
      preRestMoney = 0,
      preRestNum = 0,
      times = 0
  for(let i=0; i<3; i++){
    // 先解决历史遗留问题，把更大的面值耗尽
    let preRestMoneyNeedCur = Math.ceil((x - preRestMoney) / faceValue[i])
    // 两种情况
    if(nums[i] >= preRestMoneyNeedCur){
      // 1. 当前面值的钱数，能和历史遗留凑出一瓶可乐
      getRest(faceValue, nums, i + 1, (preRestMoney + faceValue[i] * preRestMoneyNeedCur) - x, 1)
      preRestMoney = 0
      preRestNum = 0
      times += preRestNum + preRestMoneyNeedCur
      nums[i] -= preRestMoneyNeedCur
      m--
    }else{
      // 2. 凑不出一瓶
      preRestMoney += faceValue[i] * nums[i]
      preRestNum += nums[i]
      continue
    }
    let oneColaNeedCur = Math.ceil(x / faceValue[i]),
        colasOfCur = Math.min(m, Math.floor(nums[i] / oneColaNeedCur)),
        restOfOneCola = nums[i] * oneColaNeedCur - x
    
    getRest(faceValue, nums, i + 1, restOfOneCola, colasOfCur)
    times += oneColaNeedCur * colasOfCur
    m -= colasOfCur
    nums[i] -= oneColaNeedCur * colasOfCur
    preRestMoney = nums[i] * faceValue[i]
    preRestNum = nums[i]
  }
  return m === 0 ? times : -1
}
```



#### 题目三

已知一个消息流会不断的吐出整数 1 ~ N

但不一定按照顺序依次吐出

如果上次打印的序号为 i，那么当 i + 1 出现的时候

请打印 i + 1 及期之后接收过的并且连续的所有数

直到 1 ~ N 全部接收并打印完

请设计这种接收并打印的结构，并将接收打印操作的时间复杂度控制在 O(N)



分析：时间复杂度 O(N 杜绝了使用任何形式的数组的幻想

```javascript
function Node(info, next = null){
  this.info = info
  this.next = next
}

function MessageBox(){
  this.headMap = new Map()
  this.tailMap = new Map()
  this.headPoint = 1
}

MessageBox.prototype.receive = function(serialNumber, info){
  if(serialNumber < 1){
    return
  }
  let headMap = this.headMap,
      tailMap = this.tailMap,
      headPoint = this.headPoint,
      curNode = new Node(info)
  headMap.set(serialNumber, curNode)
  tailMap.set(serialNumber, curNode)

  if(tailMap.has(serialNumber - 1)){
    tailMap.get(serialNumber - 1).next = curNode
    tailMap.delete(serialNumber - 1)
    headMap.delete(serialNumber)
  }
  if(headMap.has(serialNumber + 1)){
    curNode.next = headMap.get(serialNumber + 1)
    headMap.delete(serialNumber + 1)
    tailMap.delete(serialNumber)
  }
  if(serialNumber === headPoint){
    this.print()
  }
}

MessageBox.prototype.print = function(){
  let headMap = this.headMap,
      tailMap = this.tailMap,
      node = headMap.get(this.headPoint),
      str = ''
  headMap.delete(this.headPoint)
  while(node){
    str += node.info + " "
    node = node.next
    this.headPoint++
  }
  tailMap.delete(this.headPoint - 1)
  console.log(str)
  return str
}

let box = new MessageBox();
console.log("这是2来到的时候");
box.receive(2,"B"); // - 2"
console.log("这是1来到的时候");
box.receive(1,"A"); // 1 2 -> print, trigger is 1
box.receive(4,"D"); // - 4
box.receive(5,"E"); // - 4 5
box.receive(7,"G"); // - 4 5 - 7
box.receive(8,"H"); // - 4 5 - 7 8
box.receive(6,"F"); // - 4 5 6 7 8
box.receive(3,"C"); // 3 4 5 6 7 8 -> print, trigger is 3
box.receive(9,"I"); // 9 -> print, trigger is 9
box.receive(10,"J"); // 10 -> print, trigger is 10
box.receive(12,"L"); // - 12
box.receive(13,"M"); // - 12 13
box.receive(11,"K"); // 11 12 13 -> print, trigger is 11
```



#### 题目四

现在有司机 N * 2 人，调度中心会把所有司机平分给 A、B两个区域

第 i 个司机去 A 可得收益为 `income[i][0]`

第 i 个司机去 B 可得收益为 `income[i][1]`

返回所有调度方案中能使所有司机总收入最高的方案，是多少钱



分析：很明显，从左到右的线性模型

```javascript
// 暴力递归
function getMaxIn(income, n, index, aRest){
  if(index === n << 1){
    return 0
  }
  let bRest = (n << 1) - index - aRest,
      m1 = 0,
      m2 = 0
  if(aRest > 0){
    m1 = income[index][0] + getMaxIn(income, n, index + 1, aRest - 1)
  }
  if(bRest > 0){
    m2 = income[index][1] + getMaxIn(income, n, index + 1, aRest)
  }
  return Math.max(m1, m2)
}

function maxIncome(income){
  if(income && income.length % 2 === 0){
    return getMaxIn(income, income.length >> 1, 0, income.length >> 1)
  }else{
    return 0
  }
}
```



```javascript
// 动态规划 + 原地更新
function maxIncome(income){
  if(!income || income.length % 2 !== 0){
    return 0
  }
  const len = income.length,
        dp = new Array((len >> 1) + 1).fill(0)
  for(let index = len - 1; index >= 0; index--){
    for(let aRest = (len >> 1); aRest >= 0; aRest--){
      let bRest = len - index - aRest,
          m1 = 0,
          m2 = 0
      if(aRest > 0){
        m1 = income[index][0] + dp[aRest - 1]
      }
      if(bRest > 0){
        m2 = income[index][1] + dp[aRest]
      }
      dp[aRest] = Math.max(m1, m2)
    } 
  }
  return dp[len >> 1]
}
```





#### 题目五

现有哈希表，put() 和 get() 时间复杂度都是 O(1)，请新增一个方法，setAll(value)，作用是把所有的值都置为 value，并维持时间复杂度仍为 O(1)



分析：想要时间复杂度维持在 O(1)，那直接改哈希表的数据是行不通的，那就只能 “卡BUG” 了

封装一个类，其内部有一个哈希表，它来维持 put() 和 get() 方法的时间复杂度，但是我们插入数据的时候，值要封装为数据和插入时间戳的组合类型；

然后维护几个内部变量：

1. all：存储最近一次 setAll() 执行的时候传入的参数 value
2. setAllTime：存储最近一次 setAll() 执行的时间戳

当执行 get() 方法的时候，我们要比较 哈希表内取出来的时间戳和 setAllTime，谁更近用谁，这样就实现了时间复杂度仍为 O(1)



#### 题目六

给定一个数组 arr，只能对 arr 中的一个子数组排序

但是想让 arr 整体升序

返回满足这一设定的子数组中，最短的长度



分析：

这其实是一种排序的思想

假如我们现在要让整体升序排列，

我们现在从左往右遍历，记录已遍历区域的最大值

当遍历到一个新的位置的时候，这个位置的值和记录最大值有两种关系：

1. 该值 < 记录最大值，这就意味值如果我们要升序排列 0 ~ 该位置的话，该位置的值必然要和最大值交换，因为该位置处于数组最右端
2. 该值 >= 记录最大值，没问题，如果我们要升序排列 0 ~ 该位置的话，该位置的值不用动，因为它身来就是数组最大值

当这样遍历一遍数组之后，最后一个需要交换的位置就是需要排列的最右端，再往右都是没问题的

同理，从右往左遍历，然后记录已遍历区域的最小值

当遍历到一个新的位置的时候，这个位置的值和记录最小值也有两种关系：

1. 该值 > 已记录最小值，不行，需要被排序
2. 该值 <= 已记录最小值，没问题

当这样遍历一遍数组之后，最后一个需要交换的位置就是需要排列的最左端，再往左都是没问题的

这样遍历两遍之后，需要排序的最小子数组就是两个标记点之间

 仔细想想，这其实是动态规划的思想

```javascript
function minLengthForSort(arr){
  let len = arr.length,
      max = arr[0],
      right = 0
  for(let i=1; i<len; i++){
    if(arr[i] < max){
      right = i
    }else{
      max = arr[i]
    }
  }
  let min = arr[len - 1],
      left = len - 1
  for(let i = len - 1; i>=0; i--){
    if(arr[i] > min){
      left = i
    }else{
      min = arr[i]
    }
  }
  return right - left + 1
}
```





