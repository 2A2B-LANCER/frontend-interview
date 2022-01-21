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

贩卖机只支持硬币支付，且收退都只支持 10,50,100三种面额

一次购买只能出一瓶可乐，且投钱和找零都遵循优先使用大钱的原则

需要购买的可乐数量是 m

其中手头有的 10 元 a 张；50 元 b 张；100 元 c 张

可乐的价格是 x （x 是 10 的倍数）

请计算出需要投入硬币的次数？

1:23:34



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



#### 数据结构设计

现有哈希表，put() 和 get() 时间复杂度都是 O(1)，请新增一个方法，setAll(value)，作用是把所有的值都置为 value，并维持时间复杂度仍为 O(1)



分析：想要时间复杂度维持在 O(1)，那直接改哈希表的数据是行不通的，那就只能 “卡BUG” 了

封装一个类，其内部有一个哈希表，它来维持 put() 和 get() 方法的时间复杂度，但是我们插入数据的时候，值要封装为数据和插入时间戳的组合类型；

然后维护几个内部变量：

1. all：存储最近一次 setAll() 执行的时候传入的参数 value
2. setAllTime：存储最近一次 setAll() 执行的时间戳

当执行 get() 方法的时候，我们要比较 哈希表内取出来的时间戳和 setAllTime，谁更近用谁，这样就实现了时间复杂度仍为 O(1)

