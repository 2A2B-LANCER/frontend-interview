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

1:00

#### 题目六

定义 step sum：比如 680，680 + 68 + 6 = 754，680 的 step sum 就是 754

给定一个整数 num，判断它是不是某个数的step sum？



分析：如果明确规定 num 是正数，则有

- 一个数增大，这个数的步骤和必然增大
- 一个数必然比这个数的步骤和小

所以这个数的范围就是 0 ~ step num，但是怎么缩小这个范围呢？

二分法



