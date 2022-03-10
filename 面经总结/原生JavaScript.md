#### Array 的方法

------

| 改变原数组                                                   | 不改变原数组                                                 | 功能性方法                                                   |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| forEach()，对所有元素执行回调函数（适用于不改变原数组，利用原数组做事情） | map()，对所有元素执行回调函数，并把每次的返回值组成新数组返回（适用于以原数组为原型，生成一个新的数组） | keys()，返回一个包含数组中每个索引键的**Array Iterator**对象 |
| sort()，原地排序                                             | slice()，由 `begin` 和 `end` 决定的原数组的**浅拷贝**（包括 `begin`，不包括`end`） | values()，返回一个新的 **`Array Iterator`** 对象，该对象包含数组每个索引的值 |
| fill()，用固定值填充数组                                     | concat()，用于数组拼接                                       | entries()，返回一个新的**Array Iterator**对象，该对象包含数组中每个索引的键/值对 |
| splice()，通过删除或替换现有元素或者原地添加新的元素来修改数组,**以数组形式返回被修改的内容** | filter()，过滤符合要求的元素组成新数组返回                   | every()，所有元素是否符合要求则返回 `true`，否则返回 `false` |
| reverse()，逆序                                              | from()，对一个类数组或可迭代对象创建一个新的，浅拷贝的数组实例 | some()，有一个符合要求立即返回 `true`，否则返回 `false`      |
|                                                              | flat()，给数组降维，返回新数组                               | find()，寻找第一个满足要求的元素，找到即停止遍历             |
|                                                              | join()，将一个数组（或一个类数组）的所有元素连接成一个字符串并返回这个字符串 | findIndex()，寻找第一个满足要求的元素的索引，找到即停止遍历  |
|                                                              |                                                              | includes()，用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回true，否则返回false |
|                                                              |                                                              | indexOf()，返回在数组中可以找到一个给定元素的第一个索引，如果不存在，则返回-1 |
|                                                              |                                                              | lastIndexOf()，返回在数组中可以找到一个给定元素的倒数第一个索引，如果不存在，则返回-1 |
|                                                              |                                                              | isArray()，判断参数是不是一个 Array                          |
|                                                              |                                                              | reduce()，对数组中的每个元素执行一个由您提供的**reducer**函数(升序执行)，将其结果汇总为单个返回值 |
|                                                              |                                                              | reduceRight()，reduce()从右到左执行版本                      |



#### ES6新特性有哪些

------

- 数据类型
  - `Symbol`
  - `BigInt`（ES6+ 不是 ES6）
  - `Map`
  - `WeakMap`
  - `Set`
  - `WeakSet`
- 作用域
  - 块级作用域
  - let
  - const
- 扩展运算符
- 解构赋值
- 模板字符串
- 函数
  - 箭头函数
    - 没有 this
    - 没有 arguments
    - 不能作为 构造函数
  - 尾调用优化
  - 剩余参数
  - 参数默认值
- 类
  - `class`
  - `extends`
  - `super`
- `Promise`
- `async` 函数
- 迭代器
- 生成器
- 内置对象（新增、加强）
  - `Proxy` 新增
  - `Reflect` 新增
  - `Object.is()`
  - `Object.assign()`
  - `Object.getOwnPropertyDescriptors()`
  - `Object.getPropertyOf()`
  - `Object.setPropertyOf()`
  - `Object.keys()/values()/entries()`
  - `Oject.fromEntries()`
  - `Array.from()`
  - `Array.of()`
  - `A.p.fill()`
  - `A.p.find()`
  - `A.p.includes()`
  - `A.p.at()`
  - `A.p.at()`
- 模块
  - `import`
  - `export`



#### 缓存

------

|              | cookie                                                       | localStorage                                  | sessionStorage                        | indexDB                                  |
| ------------ | ------------------------------------------------------------ | --------------------------------------------- | :------------------------------------ | ---------------------------------------- |
| 生命周期     | 一般由服务器生成，可设置失效时间。如果在浏览器端生成 Cookie，默 认是关闭浏览器后失效（document.cookie） | 除非被清理，否则一直存在(window.localStorage) | 页面关闭就清理(window.sessionStorage) | 除非被清理，否则一直存在(window.indexDB) |
| 存储大小     | 4K                                                           | 5M                                            | 5M                                    | 无限                                     |
| 与服务端通信 | 每次都会携带在 header 中，对于请求性能影响                   | 不参与                                        | 不参与                                | 不参与                                   |
| 适用数据     | 请求所必须的数据（越少越好）                                 | 不常更新的数据                                | 常更新的数据                          | 大量数据                                 |

| Cookie的属性 | 作用                                                         |
| ------------ | ------------------------------------------------------------ |
| value        | 如果⽤于保存⽤户登录态，应该将该值加密，不能使⽤明⽂的⽤户标识 |
| http-only    | 不能通过 JS 访问 Cookie，减少 XSS 攻击                       |
| secure       | 只能在协议为 HTTPS 的请求中携带                              |
| same-site    | 规定浏览器不能在跨域请求中携带 Cookie，减少 CSRF 攻击        |



##### Service Worker

> https://juejin.cn/post/6844904052166230030#heading-8

可以通过 `navigator.serviceWorker` 获取

> Service workers 本质上充当Web应⽤程序与浏览器之间的代理服务器，也可以在⽹络可⽤时作为浏览器和⽹络间的代理。它们旨在（除其他之外）使得能够创建有效的 离线体验，拦截⽹络请求并基于⽹络是否可⽤以及更新的资源是否驻留在服务器上来 采取适当的动作。他们还允许访问推送通知和后台同步API。

⽬前该技术通常⽤来做缓存⽂件，提⾼⾸屏速度，可以试着来实现这个功能

```javascript
// index.js
if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register("sw.js")
    .then(function (registration) {
      console.log("service worker 注册成功");
    })
    .catch(function (err) {
      console.log("servcie worker 注册失败");
    });
}
// sw.js
// 监听 `install` 事件，回调中缓存所需⽂件
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("my-cache").then(function (cache) {
      return cache.addAll(["./index.html", "./index.js"]);
    })
  );
});
// 拦截所有请求事件
// 如果缓存中已经有请求的数据就直接⽤缓存，否则去请求数据
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then(function (response) {
      if (response) {
        return response;
      }
      console.log("fetch source");
    })
  );
});
```



#### 0.1 + 0.2 === 0.3 吗？为什么

------

不等，因为在进制转换和中会发生精度丢失。

JavaScript 中用二进制的 64 位来存储一个 number 类型的数据，0.1 和 0.2，相加的时候，会先进行二进制的转换，因为二者转换成二进制之后都是无限循环，JS 的引擎会对其进行截断，这就会造成精度丢失，二者相加之后就不是 0.3 了



#### JS数据类型

------

基本类型：undefined，null，string，number，boolean，symbol，bigInt

引用类型：object，对象子类型（array，function等）



#### JS整数是怎么表示的

------

通过 Number 类型来表示，遵循 IEEE 754 双精度浮点数标准，使用 64 位存储一个数字，能够安全存储 `-(2^53 - 1)` 到 `2^53 - 1 ` 之间的数值（包含边界值）

安全存储是指能够准确区分两个不相同的值



#### number 类型的存储空间是多大？如果后台发送了一个超出限制的数字怎么办？

------

Number 类型可以安全存储的最大值就是 `2^53 - 1 `，如果超出这个值就不能正常显示，会被截断导致错误显示

接收到一个超出这个限制的数字有两种解决方案：

1. 存储为字符串
2. 存储为 BigInt 类型



#### 浅拷贝有什么方法

------

```javascript
// 对象
let a = {age: 1};
Object.assign({}, a);
{...a};

// 数组
let x = [1,2,3];
Array.from(x);
// 还有 concat, slice, map, filter 这些不改变原数组的方法都可以
Object.assign([], x);
[...x];

```



#### 怎么遍历对象

------

|                | for...in... | Object.keys | Object.entries | Object.getOwnPropertyNames | Object.getOwnPropertySymbols | Reflect.ownKeys |
| :------------- | :---------: | :---------: | :------------: | :------------------------: | :--------------------------: | :-------------: |
| 枚举属性       |     有      |     有      |       有       |             有             |              无              |       有        |
| 非枚举属性     |     无      |     无      |       无       |             有             |              无              |       有        |
| 原型属性       |     有      |     无      |       无       |             无             |              无              |       无        |
| 是否包含Symbol |     无      |     无      |       无       |             无             |              有              |       有        |



#### 怎么判断数据类型

------

1. typeof
2. instanceof
3. Object.prototype.toStirng.call()
4. isArray
5. isNaN



#### 手撕深拷贝

------

一般的深拷贝可以用 JSON.parse(JSON.stringify()) 来解决

但是有局限性：

1. 无法识别 undefined
2. 无法识别 Symbol
3. 不能序列化函数
4. 循环引用会报错

```javascript
// 完全版本，解决了：循环引用， 非JSON安全的数据类型，原型继承问题
function deepCopy(obj, cache = new WeakMap()) {
  const objType = Object.prototype.toString.call(obj).slice(8, -1)
  const basicTypes = ['Undefined', 'Null', 'Boolean', 'String', 'Number', 'BigInt', 'Symbol', 'Function']
  if(basicTypes.includes(objType)){
    // 基本类型
    return obj;
  }
  const newObjypes = ['Map', 'Set', 'WeakMap', 'WeakSet', 'Date', 'RegExp']
  
  if(newObjypes.includes(objType)){
    // 非JSON安全的内置对象
    return new value.constructor(value)
  }
  if(cache.has(obj)){
    // 循环引用
    return cache.get(obj)
  }
  let copyObj = objType === 'Array' ? [] : {}
  // 原型继承
  Object.setPrototypeOf(copyObj, Object.getPrototypeOf(obj))
  cache.set(obj, copyObj)
  for(let key of Reflect.ownKeys(obj)){
    let value = obj[key]
    copyObj[key] = deepCopy(value, cache)
  }
  return copyObj
}
```





#### 手撕 JSON.stringify

------

```javascript
function stringify(obj, cacheCurr = new WeakSet()){
  const types = ['RegExp', 'Set', 'Map', 'WeakMap', 'WeakSet'];
  if(cacheCurr.has(obj) || obj === undefined || ['symbol', 'function', 'bigint'].includes(typeof obj)){
    return
  }
  if(obj === null){
    return 'null'
  }
  if(['string', 'boolean', 'number'].includes(typeof obj)){
    return `"${String(obj)}"`
  }
  // 获取当前对象类型
  let objDataType = Object.prototype.toString.call(obj).slice(8, -1);
  if(objDataType === 'Date'){
    return `"${obj.toISOString()}"`
  }
  if(types.includes(objDataType)){
    return '{}'
  }
  cacheCurr.add(obj)
  let str = '{'
  for(let [key, value] of Object.entries(obj)){
    let stringVal = stringify(value, cacheCurr)
    if(stringVal){
      str += `"${key}":${stringVal},`
    }
  }
  if(str.endsWith(',')){
    str = str.slice(0, -1)
  }
  str += '}'
  return str
}
```



#### 模拟实现 flat

****

```javascript
function myFlat(arr, depth = Infinity) {
  if(depth === 0){
    return arr
  }
  let res = []
  arr.forEach(x => {
    if(Array.isArray(x)){
      res.push(...myFlat(x, depth - 1))
    }else{
      res.push(x)
    }
  })
  return res
}
```



#### setTimeout 模拟 setIntreval

```javascript
function mySetInterval(cb, delay, ...args) {
  let timer = null
  let myInterval = function() {
    timer = setTimeout(() => {
      cb.apply(null, args)
      myInterval()
    }, delay)
  }
  myInterval()
  return {
    id: timer,
    clear(){
      clearTimeout(timer)
    }
  }
}
```



#### 实现 sleep 函数

```javascript
function sleep(delay){
  return new Promise(function(resolve, reject){
    let start = new Date()
    setTimeout(function(){
      resolve(`${new Date()}, ${start}`)
    }, delay);
  })
}
```







#### 事件分派机制

------

##### 事件流

事件流包含三个阶段

1. 捕获阶段：事件对象从 window 向目标传播
2. 目标阶段：事件对象（event）到达事件对象的事件目标（event.target），如果事件类型表明事件没有冒泡（event.bubbles === false），就在该阶段完成后停止
3. 冒泡阶段：事件对象从 目标向 window 传播

| 方法/属性                        | 作用                                                         |
| -------------------------------- | ------------------------------------------------------------ |
| event.stopPropagation()          | 停止冒泡（不推荐使用）                                       |
| event.stopImmediatePropagation() | 该方法执行后，其后面的事件处理程序都会停止执行（不止停止冒泡） |
| event.target                     | 引发事件的层级最深的元素                                     |
| event.currentTarget (= this)     | 处理事件的当前元素（具有处理程序的元素）                     |
| event.eventPhase                 | 当前阶段（capturing=1，target=2，bubbling=3）                |



##### 事件如何实现

基于发布订阅模式

在浏览器加载的时候会读取事件相关的代码，但是只有实际等到具体的事件触发的时候才会执行

**对于目标事件来说，目标阶段和冒泡阶段无差别**

| 方法     | 形式                                                         | 执行阶段                                                     | 注意                                                         |
| -------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| HTML特性 | `<input type="button" onclick="countRabbits()"* value="Count rabbits!">` | 冒泡阶段                                                     | 该形式的方法需要有括号；优先执行（无关定义顺序）             |
| DOM属性  | `elem.onclick = function`                                    | 冒泡阶段                                                     | 该形式应该是函数声明，不应该有括号；实际上与HTML 特性相同；所以该形式的定义会覆盖前者；可以通过 `elem.onclick = null` 移除 |
| DOM2     | `element.addEventListener(event, handler[, options]);`       | useCapture = true（捕获阶段）；useCapture = false（冒泡阶段） | useCapture可以改变该形式定义事件的执行阶段                   |

完整的事件发生顺序是这样的：

- 事件从文档根节点向下移动到 `event.target`，并在途中调用分配了 `addEventListener(..., true)` 的处理程序（`true` 是 `{capture: true}` 的一个简写形式）。
- 然后，在目标元素自身上调用处理程序。
- 然后，事件从 `event.target` 冒泡到根，调用使用 `on<event>`、HTML 特性（attribute）和没有第三个参数的，或者第三个参数为 `false/{capture:false}` 的 `addEventListener` 分配的处理程序。



##### 事件委托

> 如果我们有许多以类似方式处理的元素，那么就不必为每个元素分配一个处理程序 —— 而是将单个处理程序放在它们的共同祖先上

简单来说就是把 事件处理程序添加到容器上（共同祖先，比如 `document`）,然后通过 `event.target` （比如使用 data 属性）来区分不同的特定元素，执行不同的具体行为

```html
Counter: <input type="button" value="1" data-counter>
One more counter: <input type="button" value="2" data-counter>

<script>
  document.addEventListener('click', function(event) {

    if (event.target.dataset.counter != undefined) { // 如果这个特性存在...
      event.target.value++;
    }

  });
</script>
```



##### 默认行为

- 浏览器的默认行为有很多，当我们希望按照需求定制一些自己的行为的时候，`event.preventDefault()` 就派上用场了，它可以阻止默认行为的执行（或者 `return false` 不过这样只能阻止 HTML 特性的事件）
- `addEventListener` 的 `passive: true` 选项会明确告诉浏览器：处理程序不会取消默认事件
- 如果默认行为被阻止，`event.defaultPrevented` 的值会变成 `true`，否则为 `false`。



#### new 发生了什么

------

- 创造一个全新的对象

- 这个对象会被执行 [[Prototype]] 连接，将这个新对象的 [[Prototype]] 链接到这个构造函数.prototype 所指向的对象
- 这个新对象会绑定到函数调用的 this
- 如果函数没有返回其他对象，那么 new 表达式中的函数调用会自动返回这个新对象

#### new 一个构造函数，如果函数返回 `return {}` 、 `return null` ， `return 1` ， `return true` 会发生什么情况？

------

如果函数返回一个对象（引用类型），那么new 这个函数调用返回这个函数的返回对象，否则返回 new 创建的新对象



#### Symbol 的作用

------

1. 防止属性命名冲突
2. 一定程度上的私有属性（for..in... 和 Object.keys()不能获取到 Symbol 的属性名）



#### 闭包是什么

------

产生条件：

1. 函数嵌套函数
2. 内部函数引用外部函数的变量
3. 内部函数返回导致在外部函数的外部执行

由于以上三点，导致外部函数虽然执行完毕，但是该函数的执行上下文并没有从内存中释放（V8优化之后，只有被引用的变量不会被释放），这些变量就是闭包

作用域：是一套用来规范引擎查找变量的行为准则，作用域是在编译阶段确定的，JS中只有全局作用域和函数作用域

作用域链：因为函数是嵌套执行的，每个函数又都有自己的作用域，所以就自然形成了作用域链，用以保证当前执行的作用域对符合访问权限的变量和函数的有序访问

闭包产生的本质：当前作用域中存在指向父级作用域的引用



#### 变量声明的优先级

****

函数提升 > 参数声明 > 变量提升



#### NaN 是什么，用 typeof 会输出什么

------

非数字，typeof 会返回 'number'，Infinity 也会返回 'number'



#### JS 隐式转换，显式转换

------

一般非基础类型进行转换会先调用 valueOf，如果无法返回基本类型值，就会调用 toString

##### 字符串和数字

- `+` 操作符，如果有一个为字符串，那么都转化到字符串然后执行字符串拼接
- `-` 操作符，转换为数字，相减 (-a, a * 1 a/1) 都能进行隐式强制类型转换

```javascript
[] + {}
> '[object Object]'
{} + []
> 0
```

##### 布尔值到数字

- 1 + true = 2
- 1 + false = 1

##### 转换为布尔值

- for 的第二个
- while 的条件
- if 的条件
- 三元表达式
- || && 的左操作数

##### Symbol

- 不能被转换为数字（强转会报错）
- 能被转换为布尔值（都是 true）
- 可以被转换成字符串 "Symbol(...)"

##### 宽松相等和严格相等

宽松相等允许进行强转，严格相等不允许

字符串与数字：转换为数字然后比较

其他类型与布尔类型：先把布尔类型转换为数字，然后继续进行比较

对象与非对象：执行对象的 ToPrimitive(对象）然后继续进行比较



##### 假值列表

- undefined
- null
- false
- +0 -0 NaN
- ""



#### setTimeout(fn, 0) 多久才执行？

------

延时设置为零的含义是将当前异步任务放置到宏任务队列的开头，当下一轮宏任务开始的时候就是该任务执行，这个时间跨度是由任务执行耗时决定的，最快也要 4ms，因为 H5 规定 setTimeout 的延时不得小于 4ms



#### 如何判断空对象？

------

```javascript
Object.keys(obj).length === 0
```



#### 外部JS文件先加载还是 onload 先执行，为什么？

------

- 总体顺序，按照文档结构，自上而下的加载
- 直接引入的 JS 文件会阻塞 DOM 树 和 CSSOM 树的构建
- DOM 树构建完成之后，触发事件 `DOMContentLoaded`
- `async` 和 `defer` 引入的 JS 文件都会异步下载，不阻塞文档的解析
  - `async` 完全异步，**下载完之后直接在后台执行**
  - `defer` 异步下载，DOM 树构建完成之后，`DOMContentLoaded` 事件之前执行（**`DOMContentLoaded` 事件 必须等待 defer 资源执行结束才会触发**），同为 defer 脚本，按先后顺序执行
- 动态脚本，JS 中创建的脚本，**默认 async 加载执行，添加到文档后，立即开始**

| 事件             | 机制                                               |
| ---------------- | -------------------------------------------------- |
| DOMContentLoaded | DOM 树构建完成，defer 脚本执行完毕，才会触发       |
| onload           | 外部资源加载完成，样式应用，图片大小已知，开始执行 |



#### 函数中的arguments是数组吗？类数组转数组的方法了解一下？

------

不是，属于 类数组

1. [...arguments]
2. Array.from
3. Array.prototype.slice.apply(arguments)



#### 箭头函数和普通函数有什么区别

****

1. 箭头函数没有自己的 this，会通过查找作用域链引用最近一层非箭头函数的 this
2. 箭头函数没有自己的 arguments 对象（可以使用命名参数或者 rest 参数）
3. 不能通过 new 关键字 调用，原因是 JS 的函数有两个内部方法 [[Call]]（直接调用时执行）和 [[Construct]] （new 调用时执行），箭头函数没有后者
4. 没有 new.target
5. 没有原型
6. 没有 super



#### class 关键字， static 关键字

****

class 关键字是 ES6 实现类的一个语法糖

static 关键字是把属性或方法直接添加到函数对象上，而不是原型上



#### 实现 数组扁平化函数

****

```javascript
Array.prototype.myFlat = function(depth){
  if(Object.prototype.toString.call(this) !== '[object Array]'){
    throw new TypeError('非数组对象不能降维！')
  }
  if(depth < 1){
    return this
  }
  let res = []
  this.forEach((item) => {
    if(Object.prototype.toString.call(item) === '[object Array]'){
      res.push(...item.myFlat(depth - 1))
    }else{
      res.push(item)
    }
  })
  return res
}
```



#### `instanceof`

****

```javascript
// es5
[] instanceof Array
// es6
Array[Symbol.hasInstance]([])

function myInstanceof(obj, constructor){
  if(obj === null || !['function', 'object'].includes(typeof obj)){
    return false
  }
  while (obj && Object.getPrototypeOf(obj) !== constructor.prototype){
    obj = Object.getPrototypeOf(obj)
  }
  return obj === null ? false : true;
}

```



#### 计算 `localStorage` 的大小

****

```javascript
function computedLocalStorageLength(){
  let str = ""
  while (str.length < 10240){
    str += "01234567"
  }
  const TENKB = str
  localStorage.clear();
  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      try {
        localStorage.setItem('temp', str)
      }catch(e){
        clearInterval(timer)
        localStorage.removeItem('temp')
        resolve(`localStorage 的最大容量：${str.length / 1024 - 10} KB`)
      }
      str += TENKB
    }, 0)
  })
}
computedLocalStorageLength().then(val => console.log(val))
```



#### encodeURI 和 encodeURIComponent

都是对字符串进行编码，但是范围不同

简单来说，后者会使得 URL 不可用，因为 `/` 也在其编码范围内。

所以根据使用场景分别使用二者：

- 如果编码整个 `URL`，使用 `encodeURI`
- 如果要编码 `URL` 的参数，使用 `encodeURIComponent`



#### `XHR`

****

XHR 对象提供了原生的浏览器向服务器发送异步请求的接口，是之前实现 AJAX 的标准做法

```javascript
// 一般使用 xhr 进行异步请求的做法
let xhr = new XMLHttpRequest();
xhr.addEventListener('readystatechange', function(){
  if(xhr.readyState === 4){
    // 请求完成，已接收所有响应
    if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304){
      // 请求正常响应，正确处理数据
      // xhr.response 响应体
    }else{
      console.log('出错了！')
    }
  }
})

xhr.open('请求方法', '请求 URL', '是否异步');
xhr.send('请求体放在这')
```



| xhr.readyState 值 | 对应的状态                                 |
| ----------------- | ------------------------------------------ |
| 0                 | 未初始化，还没调用 `xhr.open()`            |
| 1                 | 调用了 `xhr.open()`，还没调用 `xhr.send()` |
| 2                 | 已调用 `xhr.send()`，未接收到响应          |
| 3                 | 接收到部分相应                             |
| 4                 | 接收到全部响应                             |

| 常用的属性、方法       | 作用                                            |
| ---------------------- | ----------------------------------------------- |
| xhr.onreadystatechage  | xhr.readyState 变化的事件监听                   |
| xhr.response           | 响应体                                          |
| xhr.status             | 响应状态码                                      |
| xhr.timeout            | 请求超时的时限                                  |
| xhr.abort()            | 中止请求                                        |
| xhr.open()             | 初始化请求                                      |
| xhr.setRequestHeader() | 设置请求头，必须在 open() 之后，send() 之前设置 |
| xhr.send()             | 发送请求                                        |

- FormData 对象

  用于构造表单格式的数据，然后通过 xhr 发送

- URLSearchParams 对象

  处理 URL 的查询字符串的对象

  **注意，该对象构造函数不会解析完整 URL，但是第一个字符是 ？会删除，所以请传入 URL 的参数部分**

##### 跨域请求

请求头会携带 `Origin`，包含发送请求的页面的源

限制：

- 不能使用 `setRequestHeader` 设置 **自定义** 头部
- 不能发送和接收 `cookie`
- `getAllResponseHeaders` 方法始终返回空字符串

##### 预检请求

即 `OPTIONS` 请求

要求带有以下头部：

- `Origin`，发送请求的页面的源
- `Access-Control-Request-Method`，请求希望使用的方法
- `Access-Control-Request-Headers`，要使用的自定义头部列表（逗号分隔）

##### 凭据请求

默认情况下，跨域请求不提供凭据（`cookie`，`HTTP`认证，客户端`SSL`证书）

如果 `withCredentials` 属性设置为 `true`，则表明请求会携带凭据，服务器允许就在响应头带上 `Access-Control-Allow-Credentials: true`；否则就是服务器不允许携带凭据



#### Fetch

新版本的异步请求封装对象，比 XHR 更强大，可以在 主页面执行线程、模块、工作者线程中使用它

```javascript
fetch(url, [options])
```

基本形式如上，会返回一个 `Promise`

options：

- `method`，HTTP 请求方法

- `body`，请求体

  必须是 `Blob`、`BufferSource`、`FormData`、`URLSearchParams`、`ReadableStream`、`String` 的实例

- `cache`，HTTP 缓存策略

  - default
    - 缓存未过期，直接返回缓存
    - 缓存过期，采用协商缓存策略
    - 没有缓存，直接请求，缓存下来
  - no-store，**禁止查看缓存，且不能把响应放入缓存**
  - reload，**禁止查看缓存，但是响应会更新缓存**
  - no-cache，协商缓存
  - force-cache，**不管过没过期都使用缓存的资源**
  - only-if-cached
    - 只在 `same-origin` 时使用缓存
    - 不管过没过期都返回，不发请求
    - 没有缓存就返回 `504（网关超时）`

- `credentials`，跨域请求是否携带 `cookie`

  - `omit`，不发
  - `same-origin`，同源发
  - `include`，同源、跨域都发

- `headers`，请求头设置，一般使用 `Headers` 对象

- `keepalive`，浏览器允许请求存在时间超出页面生命周期。默认为`false`

##### 中断请求

通过 `AbortController` 对象实例设置中断请求信号，这会导致 被中断的 `fetch` 返回一个 `onrejected` 状态的 Promise

```javascript
let abortController = new AbortController();
fetch('dia.zip', { signal: abortController.signal })
.catch(() => console.log('aborted!'));
// 10毫秒后中断请求
setTimeout(() => abortController.abort(), 10);
```


