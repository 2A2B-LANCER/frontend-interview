### 柯里化（currying）

> 柯里化就是将具有多个arity的函数转化为具有较少的arity的函数。——[kbrainwave](https://medium.com/@kbrainwave)
> 备注：术语 `arity`（元数）：指的是函数的参数个数

**柯里化的目的：降低通用性，提高适用性**

```javascript
// 按照 lodash 的 curry 实现一个柯里化函数
function curry(fn, length){
  length = length || fn.length;

  return function curried(...args){
    if(args.includes('_')){
      // 有占位符的情况
      return function(...args2){
        let argLen = args.length;
        for(let i=0; i<argLen; i++){
          if(args[i] === '_' && args2.length > 0){
            args[i] = args2.pop();
          }
        }
        return curried.call(this, ...args, ...args2)
      }
    }else{
      // 无占位符
      if(args.length >= length){
        return fn.apply(this, args)
      }else{
        return function(...args2){
          return curried.call(this, ...args, ...args2)
        }
      }
    }
  }
}
```



### 偏函数

> 在计算机科学中，部分应用（或偏函数应用）是指将多个参数固定到一个函数，产生另一个具有较小元数的函数的过程。

感觉和 柯里化 很像

区别就是：

1. 柯里化是将一个多参数函数转换成多个单参数函数，也就是将一个 n 元函数转换成 n 个一元函数；
2. 局部应用则是固定一个函数的一个或者多个参数，也就是将一个 n 元函数转换成一个 n - x 元函数；

```javascript
// 按照 lodash 的 partial 实现一个偏函数生成函数
function partial(fn, ...args){
  return function (...args2){
    let clone = Array.from(args)
    if(clone.includes('_')){
      let argLen = clone.length
      for(let i = 0; i < argLen; i++){
        if(clone[i] === '_'){
          clone[i] = args2.shift(args)
        }
      }
    }
    return fn.call(this, ...clone, ...args2)
  }
}
```

