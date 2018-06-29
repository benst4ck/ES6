// Promise是比回调函数和事件更强大的一种异步编程解决方案
// Promise对象代表一个异步操作 有三种状态 pending(进行中) fulfilled(已成功) 和 rejected(已失败)
/* 
	Promise对象的状态改变 只有两种可能 
		从pending变为fulfilled 
		从pending变为rejected 
	一旦状态改变 就不会再改变了 这时候称为resolved(已定型) 通常resolved指的就是fulfilled状态
	Promise对象可以将异步操作以同步操作的流程表达出来 避免了层层嵌套的回调函数
*/

const promise = new Promise(function(resolve, reject) {
  // 异步操作

  if (/* 异步操作成功 */){  // 这里将需要的值或出现的错误传递到then方法中指定的回调函数的参数
    resolve(value);
  } else {
    reject(error);
  }
});

// Promise构造函数接受一个函数作为参数 这个函数的两个参数分别是resolve和reject 它们是两个函数 由JS引擎自动提供
// 异步操作成功时调用resolve函数 它的作用是 将Promise对象的状态从pending变为resolved 并将异步操作的结果作为参数传递出去
// 异步操作失败时调用reject函数 它的作用是 将Promise对象的状态从pending变为rejected 并将异步操作报出的错误作为参数传递出去

// Promise实例生成后 可以通过then方法分别指定由pending状态变为resolved状态或rejected状态的回调函数
// 这里两个函数都接受Promise对象传出的值作为参数 两个参数都是可选的
promise.then(function(value) {
  // success
}, function(error) {
  // failure
});

function timeout(ms) {
  return new Promise((resolve, reject) => {  // 该函数返回一个Promise对象
    setTimeout(resolve, ms, 'done');  // 在设置的时间ms后立即调用resolve函数 并将字符串'done'传递给resolve函数作为参数
  });
}
// 在setTimeout中调用resolve函数后 该Promise对象进入resolved状态 通过then方法设置的resolved状态对应的回调函数将被调用
// 调用resolve函数时传递的参数'done'将被传递给then方法设置的resolved状态对应的回调函数的参数value
// 过了指定的时间(ms参数)以后 Promise实例的状态变为resolved 这时候就会触发then方法绑定的回调函数
timeout(3000).then((value) => {
  console.log(value);
});

// Promise新建后立即执行 所以首先输出的是'Promise' 然后 then方法指定的回调函数将在当前脚本所有同步任务执行完才会执行 所以'resolved'最后输出
var promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});

// 如果改变已经发生了 再对Promise对象添加回调函数 回调函数还是会被执行 这与事件监听不同
promise.then(function() { 
  console.log('resolved');
});
for (var i = 0; i <=10; i++) {
	console.log("hi")
}
console.log("hello");

// Promise
// hi (输出11次)
// hello
// resolved

// getJSON函数中封装了XMLHttpRequest对象 用于发出一个针对JSON数据的HTTP请求 并且返回一个Promise对象
var getJSON = function(url) {
  var promise = new Promise(function(resolve, reject){  // Promise创建后立即执行
    const handler = function() {
      if (this.readyState !== 4) {
        return;
      }
      if (this.status === 200) {
        resolve(this.response.items.length);  // 传递给then方法中的length
      } else {
        reject(new Error(this.statusText));  // 传递给then方法中的error
      }
    };
    var client = new XMLHttpRequest();
    client.open("GET", url);
    client.onreadystatechange = handler;  // handler中的this指向client
    client.responseType = "json";
    client.setRequestHeader("Accept", "application/json");
    client.send();

  });

  return promise;
};
var url = "https://api.github.com/search/repositories?q=language:javascript&sort=stars&order=desc&page=1&per_page=10"
getJSON(url).then(function(length) {
  console.log('Contents: ' + length);
}, function(error) {
  console.error('出错了', error);
});

// 调用resolve或reject后 如果后面还有代码 后面的代码是会继续执行的
// 一般来说 调用resolve或reject以后 Promise的使命就完成了 后继操作应该放到then方法里面 而不应该直接写在resolve或reject的后面
// 所以 最好在resolve或reject函数前面加上return语句 这样就不会有意外

new Promise((resolve, reject) => {
  return resolve(1);
  // 后面的语句不会执行
  console.log(2);
})

// 在只想对异常进行处理时可以采用 
promise.then(undefined, onRejected)
promise.catch(onRejected) // 不过这种情况下 应该是个更好的选择  catch方法只是 promise.then(undefined, onRejected) 的别名而已

promise.then(onFulfilled, onRejected)  // 两个参数均为可选参数
// 相当于
promise.then(onFulfilled).catch(onRejected)

var promise = new Promise(function(resolve){
  resolve(42);  // 调用then方法设置的回调函数 并将值42传递给回调函数
});
promise.then(function(value){   // 通过then方法注册promise对象执行成功时的回调函数
  console.log(value);
}).catch(function(error){     // 通过catch方法注册promise对象执行失败时的回调函数
  console.error(error);
});
// 42

function asyncFunction() {    // 该函数返回一个promise对象
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve('Async Hello world');
    }, 3000);
  });
}

asyncFunction().then(function (value) {
    console.log(value);    // => 'Async Hello world'
}).catch(function (error) {
    console.log(error);
});

function getURL(URL) {
  return new Promise(function (resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', URL, true);  // 第三个参数的默认值就是true 可以省略
    req.onload = function () {  // 当请求成功完成时触发onload事件
      if (req.status === 200) {
        resolve(req.responseText);
      } else {
        reject(new Error(req.statusText));
      }
    };
    req.onerror = function () {
      reject(new Error(req.statusText));
    };
    req.send();
  });
}
// 运行示例
var URL = "https://httpbin.org/get";
getURL(URL).then(function onFulfilled(value){
  console.log(value);
}).catch(function onRejected(error){
  console.error(error);
});

// 静态方法 Promise.resolve(value) 可以认为是 new Promise() 方法的快捷方式
// 同时它会让这个promise对象立即进入确定(即resolved)状态 并将42传递给后面then里所指定的onFulfilled函数
Promise.resolve(42);

// 相当于
new Promise(function(resolve){
    resolve(42);
});

// 由于 Promise.resolve(value) 的返回值是一个promise对象 所以对其返回值可以直接调用then()方法 形成链式调用
Promise.resolve(42).then(function(value){
    console.log(value);
});
// Promise.reject(error)是和Promise.resolve(value)类似的静态方法 也是new Promise()方法的快捷方式
Promise.reject(new Error("BOOM!")).catch(function(error){
    console.error(error);
});