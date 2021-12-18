function test() {
  console.log(1)
  setTimeout(function () { 	// timer1
    console.log(2)
  }, 1000)
}

test();

setTimeout(function () { 		// timer2
  console.log(3)
})

new Promise(function (resolve) {
  console.log(4)
  setTimeout(function () { 	// timer3
    console.log(5)
  }, 100)
  resolve()
}).then(function () {
  setTimeout(function () { 	// timer4
    console.log(6)
  }, 0)
  console.log(7)
})

console.log(8)

/*
  JS是顺序从上而下执行
  执行到test()，test方法为同步，直接执行，console.log(1)打印1
  test方法中setTimeout为异步宏任务，回调我们把它记做timer1放入宏任务队列
  接着执行，test方法下面有一个setTimeout为异步宏任务，回调我们把它记做timer2放入宏任务队列
  接着执行promise，new Promise是同步任务，直接执行，打印4
  new Promise里面的setTimeout是异步宏任务，回调我们记做timer3放到宏任务队列
  Promise.then是微任务，放到微任务队列
  console.log(8)是同步任务，直接执行，打印8
  主线程任务执行完毕，检查微任务队列中有Promise.then
  开始执行微任务，发现有setTimeout是异步宏任务，记做timer4放到宏任务队列
  微任务队列中的console.log(7)是同步任务，直接执行，打印7
  微任务执行完毕，第一次循环结束

  检查宏任务队列，里面有timer1、timer2、timer3、timer4，四个定时器宏任务，按照定时器延迟时间得到可以执行的顺序，
  即Event Queue：timer2、timer4、timer3、timer1，依次拿出放入执行栈末尾执行
  (插播一条：浏览器 event loop 的 Macrotask queue，就是宏任务队列在每次循环中只会读取一个任务)
  
  执行timer2，console.log(3)为同步任务，直接执行，打印3
  检查没有微任务，第二次Event Loop结束
  执行timer4，console.log(6)为同步任务，直接执行，打印6
  检查没有微任务，第三次Event Loop结束
  执行timer3，console.log(5)同步任务，直接执行，打印5
  检查没有微任务，第四次Event Loop结束
  执行timer1，console.log(2)同步任务，直接执行，打印2
  检查没有微任务，也没有宏任务，第五次Event Loop结束
  结果：1，4，8，7，3，6，5，2
*/

// 自测题
alert(1)
setTimeout(alert, 0, 8);
new Promise((resolve, reject) => {alert(2);resolve()}).then( function(){
 new Promise((resolve, reject) => {setTimeout((func)=> {alert(5);func()}, 0, resolve)}).then( function(){
    setTimeout(alert, 0, 11);
    alert(10);
 } );
 setTimeout(alert, 0, 9);
 alert(6)
} );
new Promise((resolve, reject) => {alert(3);resolve()}).then( function(){
 alert(7);
} );
alert(4);