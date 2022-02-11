#### 股票问题一

> https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/

分析：买卖股票有潜在的先后顺序：买必须在卖之前

如果我们要求最大的利润，那负数肯定不在考虑范围内，最差也是 0

利润想要大，买卖的差值就得大

比如要在 i 时刻卖出，那买入的价格肯定是 prices[i] 及其之前价格的最小值

那么我们只需要维护两个变量，min 和 max

- min 来存储 prices[i] 及其之前价格的最小值
- max 来存储到目前为止最大的利润

```javascript
var maxProfit = function(prices) {
  let max = 0,
      min = prices[0]
  for(let i=1; i<prices.length; i++){
    min = Math.min(min, prices[i])
    max = Math.max(max, prices[i] - min)
  }
  return max
};
```



#### 股票问题二

> https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-ii/

这个题让我们可以多次进行交易，但是每一时刻手里只能有一支股票

那我们就每个时刻都交易

如果上一时刻买入，当前时刻卖出可以赚钱，那就这样；否则就不进行交易

为什么这样？

假设 [1,2,3,4,5]，就是价格时间表

很明显，0时刻买入，4时刻卖出收益最大，因为股票一直在涨，收益为 4

但是

```javascript
prices[4] = prices[0] === prices[1] - prices[0] + prices[2] - prices[1] + prices[3] - prices[2] + prices[4] - prices[3]
```

二者难道不相等吗？

再比如 [1,2,10,4,5]

很明显 3 时刻跌了，那我们就 3 时刻就不交易了，这样即便没收益也比亏了强

```javascript
var maxProfit = function(prices) {
  let sumPrices = 0
  for(let i = 1; i<prices.length; i++){
    sumPrices += prices[i] - prices[i - 1] > 0 ? prices[i] - prices[i - 1] : 0
  }
  return sumPrices
};
```



#### 股票问题四

> https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iv/

分析：

给定参数后，可能的最多交易次数就是 `prices.length >> 1`，因为每一次涨都意味着之前有一次跌，二者一一对应，所以涨的次数最多，跌的次数也最多

那就可以得出结论：当 `k >= prices.length >> 1` 的时候，就可以看做交易次数限额为无限次，那就可以当做 **问题二** 来做

否则，就得正常做了

定义动态规划表 dp

`dp[i][j]` 意味着 从 0~i 上至多完成 j 次交易，所能获得的最大利润

- 当 j === 0 的时候，也就是至多 0 次交易，那毫无疑问，利润肯定是 0
- 当 i === 0 的时候，就是在 0~0 上，完成 0/1/2/3... 次交易，利润也都是 0
- 现在讨论 `dp[i][j]` 有几种情况
  - 如果 prices[i] 不参与交易，`dp[i][j]` 就和 `dp[i - 1][j]` 相等
  - 如果 prices[i] 参与交易
    - i~i 上交易一次，`dp[i][j]` = `dp[i - 1][j - 1]` + prices[i] - prices[i]
    - i - 1~i 上交易一次，`dp[i][j]` = `dp[i - 2][j - 1]` + prices[i] - prices[i - 1]
    - ...
    - 0~i 上交易一次，`dp[i][j]` = `dp[0][j - 1]` + prices[i] - prices[0]
  - 以上这些情况中，取最大值，赋给 `dp[i][j]`

内部有循环，看看能否降低时间复杂度

分析可知，`dp[i][j]` 只和 `dp[i - 1][j]` 以及左侧一列的数据有关

那我们的填充顺序就得是从上到下，从左到右

现在假设一个实际过程，我们要求 `dp[5][6]`

那和他有关的循环过程就是

```javascript
dp[5][5] + prices[5] - prices[5]
dp[4][5] + prices[5] - prices[4]
dp[3][5] + prices[5] - prices[3]
dp[2][5] + prices[5] - prices[2]
dp[1][5] + prices[5] - prices[1]
dp[0][5] + prices[5] - prices[0]
```

再看看 `dp[4][6]` 的循环过程

```javascript
dp[4][5] + prices[4] - prices[4]
dp[3][5] + prices[4] - prices[3]
dp[2][5] + prices[4] - prices[2]
dp[1][5] + prices[4] - prices[1]
dp[0][5] + prices[4] - prices[0]
```

对比二者

```javascript
dp[5][5] + prices[5] - prices[5]
dp[4][5] + prices[5] - prices[4]	dp[4][5] + prices[4] - prices[4]
dp[3][5] + prices[5] - prices[3]	dp[3][5] + prices[4] - prices[3]
dp[2][5] + prices[5] - prices[2]	dp[2][5] + prices[4] - prices[2]
dp[1][5] + prices[5] - prices[1]	dp[1][5] + prices[4] - prices[1]
dp[0][5] + prices[5] - prices[0]	dp[0][5] + prices[4] - prices[0]
```

发现：

1. 后求的比先求的多了自己这一行
2. 中间加的不一样，都是本行
3. 其他的都是相同的

很明显是可以简化掉循环过程的

只需要在从上到下的过程中记录 `dp[?][j] - prices[?]` 的最大值，到 i 行再和 `dp[i][j] - prices[i]` 比较

最后的时候，再加上 prices[i] 就好了

这样，时间复杂度就从 O(N^3) 降低到了 O(N^2)

```javascript
var maxProfit = function(k, prices) {
  if(k >= prices.length >> 1){
    let sum = 0
    for(let i = 1; i < prices.length; i++){
      sum += Math.max(prices[i] - prices[i - 1], 0)
    }
    return sum
  }else{
    let dp = new Array(prices.length).fill(0).map(() => new Array(k + 1).fill(0))
    for(let col = 1; col <= k; col++){
      let max = 0 - prices[0]
      for(let row = 1; row < prices.length; row++){
        max = Math.max(max, dp[row][col - 1] - prices[row])
        dp[row][col] = Math.max(dp[row - 1][col], max + prices[row])
      }
    }
    return dp[prices.length - 1][k]
  }
};
```



#### 股票问题五-含冷冻期

> https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/

有了冷冻期，交易之后的第二天不能进行交易

那我们就定义两张 dp 表：

- buy[i]：i 时刻手里有股票，能获得的最大收益
- sell[i]：i 时刻手里没有股票，能获得的最大收益

最大收益肯定是 最后手里没有股票，即 sell[prices.length - 1]

1. 当 prices.length < 2，只有一条记录，收益肯定是 0
2. 当 prices.length >= 2
   1. buy[1]：1 时刻手里有股票，可能是 0 时刻的，可能是 1 时刻的，肯定买便宜的；因为现在还没有卖出过，所以收益是 0，再买入，收益就是 股票价格的相反数了
   2. sell[1]：1 时刻手里没有股票，可能没有买，也可能买了然后卖了
      1. 没有买，收益 0
      2. 0 买 0 卖，收益 0
      3. 1 买 1 卖，收益 0
      4. 0 买 1 卖，收益 prices[1] - prices[0]
      5. 选其中的最大值
   3. 然后就是普遍过程 buy[i] 和 sell[i]
      1. buy[i]：手里有股票，如果这张股票是之前买入的，那么 buy[i] === buy[i - 1]；如果这张股票就是 prices[i]，因为有冷冻期，所以是 i - 2时刻手里没有股票的利润，那么 buy[i] = sell[i - 2] - prices[i]
      2. sell[i]：手里没有股票，如果手里的股票是之前卖出的，那么 sell[i] === sell[i - 1]；如果是现在卖出的，那 [i - 1] 时刻手里肯定有股票，sell[i] = buy[i - 1] + prices[i]



```javascript
var maxProfit = function(prices) {
  if(prices.length < 2){
    return 0
  }
  let buy = new Array(prices.length).fill(0),
      sell = new Array(prices.length).fill(0)
  buy[1] = Math.max(-prices[0], -prices[1])
  sell[1] = Math.max(0, prices[1] - prices[0])
  for(let i=2; i<prices.length; i++){
    buy[i] = Math.max(buy[i - 1], sell[i - 2] - prices[i])
    sell[i] = Math.max(sell[i - 1], buy[i - 1] + prices[i])
  }
  return sell[prices.length - 1]
};
```



```javascript
// 空间优化
var maxProfit = function(prices) {
  if(prices.length < 2){
    return 0
  }
  let buy = Math.max(-prices[0], -prices[1]),
      sell = [0, Math.max(0, prices[1] - prices[0])]
  for(let i=2; i<prices.length; i++){
    let lastBuy = buy,
        lastSell = sell.slice()
    buy = Math.max(lastBuy, lastSell[0] - prices[i])
    sell = [lastSell[1], Math.max(lastSell[1], buy + prices[i])]
  }
  return sell[1]
};
```



#### 股票问题六-含手续费

> https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/

```javascript
// 和 五 一样
var maxProfit = function(prices, fee) {
  if(prices.length < 2){
    return 0
  }
  let buy = Math.max(-prices[0], -prices[1]),
      sell = Math.max(0, prices[1] - prices[0] - fee)
  for(let i=2; i<prices.length; i++){
    let lastBuy = buy,
        lastSell = sell
    buy = Math.max(lastBuy, lastSell - prices[i])
    sell = Math.max(lastSell, lastBuy + prices[i] - fee)
  }
  return sell
};
```

