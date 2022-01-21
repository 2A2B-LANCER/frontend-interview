#### Array 的方法

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
|                                                              |                                                              |                                                              |



#### ES6新特性有哪些

1. const/let
2. Obejct.defineProperty
3. 模板字符串
4. 箭头函数
5. 解构赋值
6. `...` 扩展、收集操作符
7. 函数的参数默认值
8. class 关键字
9. for...of、for...in
10. Promise
11. async/await
12. 等



#### 缓存

|              | cookie                                                       | localStorage                                  | sessionStorage                        | indexDB                                  |
| ------------ | ------------------------------------------------------------ | --------------------------------------------- | :------------------------------------ | ---------------------------------------- |
| 生命周期     | 一般由服务器生成，可设置失效时间。如果在浏览器端生成 Cookie，默 认是关闭浏览器后失效（document.cookie） | 除非被清理，否则一直存在(window.localStorage) | 页面关闭就清理(window.sessionStorage) | 除非被清理，否则一直存在(window.indexDB) |
| 存储大小     | 4M                                                           | 5M                                            | 5M                                    | 无限                                     |
| 与服务端通信 | 每次都会携带在 header 中，对于请求性能影响                   | 不参与                                        | 不参与                                | 不参与                                   |
| 适用数据     | 请求所必须的数据（越少越好）                                 | 不常更新的数据                                | 常更新的数据                          | 大量数据                                 |

| Cookie的属性 | 作用                                                         |
| ------------ | ------------------------------------------------------------ |
| value        | 如果⽤于保存⽤户登录态，应该将该值加密，不能使⽤明⽂的⽤户标识 |
| http-only    | 不能通过 JS 访问 Cookie，减少 XSS 攻击                       |
| secure       | 只能在协议为 HTTPS 的请求中携带                              |
| same-site    | 规定浏览器不能在跨域请求中携带 Cookie，减少 CSRF 攻击        |



##### Service Worker

可以通过 `navigator.serviceWorker` 获取

> Service workers 本质上充当Web应⽤程序与浏览器之间的代理服务器，也可以在⽹ 络可⽤时作为浏览器和⽹络间的代理。它们旨在（除其他之外）使得能够创建有效的 离线体验，拦截⽹络请求并基于⽹络是否可⽤以及更新的资源是否驻留在服务器上来 采取适当的动作。他们还允许访问推送通知和后台同步API。

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

不等，因为在进制转换和中会发生精度丢失。

JavaScript 中用二进制的 64 位来存储一个 number 类型的数据，0.1 和 0.2，相加的时候，会先进行二进制的转换，因为二者转换成二进制之后都是无限循环，JS 的引擎会对其进行截断，这就会造成精度丢失，二者相加之后就不是 0.3 了



#### JS数据类型

基本类型：undefined，null，string，number，boolean，symbol，bigInt

引用类型：object，对象子类型（array，function等）



#### JS整数是怎么表示的

通过 Number 类型来表示，遵循 IEEE 754 双精度浮点数标准，使用 64 位存储一个数字，能够安全存储 `-(2^53 - 1)` 到 `2^53 - 1 ` 之间的数值（包含边界值）

安全存储是指能够准确区分两个不相同的值



#### number 类型的存储空间是多大？如果后台发送了一个超出限制的数字怎么办？

Number 类型可以安全存储的最大值就是 `2^53 - 1 `，如果超出这个值就不能正常显示，会被截断导致错误显示

接收到一个超出这个限制的数字有两种解决方案：

1. 存储为字符串
2. 存储为 BigInt 类型



#### 浅拷贝有什么方法

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

|                | for...in... | Object.keys | Object.entries | Object.getOwnPropertyNames | Object.getOwnPropertySymbols | Reflect.ownKeys |
| :------------- | :---------: | :---------: | :------------: | :------------------------: | :--------------------------: | :-------------: |
| 枚举属性       |     有      |     有      |       有       |             有             |              无              |       有        |
| 非枚举属性     |     无      |     无      |       无       |             有             |              无              |       有        |
| 原型属性       |     有      |     无      |       无       |             无             |              无              |       无        |
| 是否包含Symbol |     无      |     无      |       无       |             无             |              有              |       有        |



#### 怎么判断数据类型

1. typeof
2. instanceof
3. Object.prototype.toStirng.call()
4. isArray
5. isNaN



#### 手撕深拷贝

一般的深拷贝可以用 JSON.parse(JSON.stringify()) 来解决

但是有局限性：

1. 无法识别 undefined
2. 无法识别 Symbol
3. 不能序列化函数
4. 循环引用会报错

```javascript
// 完全版本，解决了：循环引用， 非JSON安全的数据类型，原型继承问题
function deepClone(obj, cacheCurr = new WeakMap()) {
    if([undefined, null].includes(obj)){
        return obj
    }
    // 如果该对象已经创建好，则从缓存中获取直接返回
    if (cacheCurr.has(obj)) return cacheCurr.get(obj);
    // 通用的类型集合，方便后面统一处理:new obj.constructor(obj),所以该集合一定是要能够这样创建的才能放进来
    const types = ['RegExp', 'Date', 'Set', 'Map', 'WeakMap', 'WeakSet'];
    // 获取当前对象类型
    let objDataType = Object.prototype.toString.call(obj).slice(8, -1);
    // 对比当前类型是否在通用类型中，在则统一处理克隆。【较通用的处理方式】
    if(types.includes(objDataType)) return new obj.constructor(obj);
    // 创建克隆对象
    let cloneObj = objDataType === 'Array' ? [] : {};
    // 继承原型
    if(obj){
        Object.setPrototypeOf(cloneObj,Object.getPrototypeOf(obj));
    }
    // 普通引用类型及非引用类型克隆，Reflect.ownKeys能够获取自身所有属性【非枚举也可】
    for(let key of Reflect.ownKeys(obj)) {
        let value = obj[key];
        let valueType = Object.prototype.toString.call(value).slice(8, -1);
        // 引用类型处理
        if(valueType === 'Object' || valueType === 'Array' || types.includes(valueType)) {
            // 对引用类型进行递归进入当前级的下一级进行遍历
            cloneObj[key] = deepClone(value, cacheCurr);
            // 记录已创建引用
            cacheCurr.set(obj, cloneObj);
        } else { // 非引用类型处理
            cloneObj[key] = value;
        }
    }
    return cloneObj;
}
```





#### 手撕 JSON.stringify

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

