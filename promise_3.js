// Promise.all接收一个由promise对象组成的数组作为参数 当这个数组里的所有promise对象全部变为resolve或reject状态的时候 它才会去调用接下来then()方法中定义的回调
function timerPromisefy(delay) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(delay);
        }, delay);
    });
}
var startDate = Date.now();

// 数组中的promise对象同时开始执行 每个promise的结果(resolve或reject时传递的参数值)和传递给Promise.all的promise数组的顺序是一致的
// Promise.all()返回一个promise对象 这个promise对象中有一个PromiseValue值 它是一个结果数组 在Promise.all调用then方法时 形参values将得到这个数组
Promise.all([
    timerPromisefy(64),    // 调用timerPromisefy函数并传入参数64 返回值为一个promise对象 这个promise对象并没有调用then方法
                           // 执行resolve(delay)时 delay参数被传递到Promise.all的结果数组中
    timerPromisefy(1),
    timerPromisefy(128),
    timerPromisefy(32)
]).then(function (values) {
    console.log(Date.now() - startDate + 'ms');  // 略大于128ms 由此说明数组中的Promise对象是同时执行的
    console.log(values);    // [64, 1, 128, 32]
});

// Promise.all的返回值
// Promise {<resolved>: Array(4)}
  // [[PromiseStatus]]:"resolved"
  // [[PromiseValue]]:Array(4) [64, 1, 128, 32]  then方法中函数的形参values将被赋予PromiseValue的值

// Promise.all().then()的返回值
// Promise {<pending>}
  // [[PromiseStatus]]:"resolved"
  // [[PromiseValue]]:undefined


// Promise.race 只要有一个promise对象进入FulFilled或者Rejected状态的话 就立即调用then()方法注册的回调函数
function timerPromisefy(delay) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(delay);
        }, delay);
    });
}
// 数组中任何一个promise对象变为resolve或reject的话就去调用then方法中的回调函数
Promise.race([
    timerPromisefy(100),     // 这时候确定状态的promise对象会调用resolve(1) 因此传递给value的值也是1 控制台上会打印出1来
    timerPromisefy(32),
    timerPromisefy(8),
    timerPromisefy(128)
]).then(function (value) {
    console.log(value);    // 8 输出结果说明数组中的这些Promise对象是同时一起执行的
});

var winnerPromise = new Promise(function (resolve) {
    setTimeout(function () {
        console.log('this is winner');
        resolve('this is winner!');
    }, 4);
});
var loserPromise = new Promise(function (resolve) {
    setTimeout(function () {
        console.log('this is loser');
        resolve('this is loser!');
    }, 1000);
});

Promise.race([winnerPromise, loserPromise]).then(function (value) {
    console.log(value);    // 'this is winner!'
});
// 运行结果
// this is winner
// this is winner!
// this is loser

// 从输出可以看出 winnter和loser两个Promise对象的setTimeout方法都会执行完毕 各自的console.log也会分别输出它们的信息
// 也就是说 Promise.race 在第一个promise对象变为Fulfilled之后 并不会取消其他promise对象的执行 只是当其他promise变为Fulfilled时 不再会去调用then方法注册的回调函数

// 对于promise.then(onFulfilled, onRejected) 在onFulfilled中发生异常的话 在onRejected中是捕获不到这个异常的
// 对于promise.then(onFulfilled).catch(onRejected) then中产生的异常能在catch中捕获
Promise.resolve()
  .then(function success (res) {
    throw new Error('error from success')
  }, function fail1 (e) {
    console.error('fail1: ', e)
  })
  .catch(function fail2 (e) {
    console.error('fail2: ', e)
  })
// fail2:  Error: error from success

Promise.resolve(1)
  .then((res) => { 
    console.log(res)  // 1
    return 2  // 通过return传递参数
  })
  .catch((err) => {
    return 3
  })
  .then((res) => {
    console.log(res)  // 2
  })


Promise.resolve(1)
  .then((res) => {
    console.log(res)  // 1
    throw new Error('error!!!')  // 出现错误 接下来调用catch方法 
    return 2
  })
  .catch((err) => {  // 这里返回一个promise对象 并且调用该promise对象的then方法注册一个回调 也就是说 会调用下一个then方法中注册的回调 并传入3作为参数
    return 3
  })
  .then((res) => {  // 这个回调始终会被执行
    console.log(res)  // 3
  })

var promise = new Promise((resolve, reject) => {  // Promise {<resolved>: 1}
  resolve(1)
})
// promise的then方法或者catch方法可以被调用多次 但这里Promise构造函数只执行一次
// promise状态一经改变 便会有一个状态和值 那么后续每次调用then方法或者 catch方法都会直接拿到该值
promise.then((res) => {
  console.log(res)
})
promise.then((res) => {
  console.log(res+1)
})

// .then或者.catch中return一个error对象并不会抛出错误 所以不会被后续的.catch 捕获
// 需要改成其中一种
    // return Promise.reject(new Error('error!!!'))
    // throw new Error('error!!!')
// 因为返回任意一个非promise的值都会被包裹成promise对象 即 return new Error('error!!!') 等价于 return Promise.resolve(new Error('error!!!'))
Promise.resolve()
  .then(() => {
    return new Error('error!!!')
  })
  .then((res) => {
    console.log('then: ', res)
  })
  .catch((err) => {
    console.log('catch: ', err)
  })
// then:  Error: error!!!