var promise = new Promise(function (resolve){
    console.log("inner promise");
    resolve(42);  // 这里是异步调用 如果这里是同步调用 那么会等待then()方法中 onFulfilled 的执行完毕再往下执行
});
promise.then(function(value){
    console.log(value);
});
console.log("outer promise");

// inner promise
// outer promise
// 42

// 由于JS代码会按照文件的从上到下的顺序执行
// 由输出结果可看出 then方法中指定的方法调用是异步进行的

// 根据下面这段代码执行时DOM是否已经加载完毕来决定对回调函数进行同步调用还是异步调用
// 这段代码在源文件中出现的位置不同 在控制台上打印的log消息顺序也会不同
function onReady(fn) {
  var readyState = document.readyState;  // 当该属性值发生变化时 document对象上的readystatechange事件将被触发
  if (readyState === 'interactive' || readyState === 'complete') {
  	// 'loading' document仍在加载
  	// 'interactive' 文档已经完成加载 文档已被解析 但是诸如图像 样式表和框架之类的子资源仍在加载
  	// 'complete' 文档和所有子资源已完成加载 这时候load事件即将被触发
    fn();  // DOM已加载完 用同步调用
  } else {
    // 当初始的HTML文档被完全加载和解析完成之后 DOMContentLoaded事件被触发 而无需等待样式表 图像和子框架的完成加载 另一个不同的事件load应该仅用于检测一个完全加载的页面
    window.addEventListener('DOMContentLoaded', fn);  // DOM未加载完 用异步调用
  }
}
onReady(function () {
  console.log('DOM fully loaded and parsed');
});
console.log('==Starting==');

// 不论DOM是否加载完 fn都使用异步执行
function onReady(fn) {
  var readyState = document.readyState;
  if (readyState === 'interactive' || readyState === 'complete') {
    setTimeout(fn, 0);  // 将fn无延迟的插入任务队列尾 相当于是异步执行
                        // console.log('==Starting==') 在任务队列中的位置应该在fn之前
  } else {
    window.addEventListener('DOMContentLoaded', fn);  // 异步执行
  }
}
onReady(function () {
  console.log('DOM fully loaded and parsed');
});
console.log('==Starting==');
/*
	==Starting==
	DOM fully loaded and parsed
*/

// 通过promise实现
// 由于Promise保证了每次调用都是以异步方式进行的 所以我们在实际编码中不需要调用setTimeout来自己实现异步调用
function onReadyPromise() {
  return new Promise(function (resolve, reject) {
    var readyState = document.readyState;
    if (readyState === 'interactive' || readyState === 'complete') {
      resolve();
    } else {
      window.addEventListener('DOMContentLoaded', resolve);
    }
  });
}
onReadyPromise().then(function () {
  console.log('DOM fully loaded and parsed');
});
console.log('==Starting==');


function taskA() {
  console.log("Task A");
}
function taskB() {
  console.log("Task B");
}
function onRejected(error) {
  console.log(error);
}
function finalTask() {
  console.log("Final Task");
}

var promise = Promise.resolve();
promise
  .then(taskA)  // 首先执行taskA resolve就执行taskB reject就执行onRejected
  .then(taskB)  // 执行taskB resolve就执行finalTask reject就执行onRejected
  .catch(onRejected)  // 如果调用了onRejected没有抛出错误 就会调用finalTask
  .then(finalTask);
// Task A
// Task B
// Final Task

function taskA() {
  console.log("Task A");
  throw new Error("throw Error @ Task A")
}
function taskB() {
  console.log("Task B");  // 不会被调用
}
function onRejected(error) {
  console.log(error);  // "throw Error @ Task A"
}
function finalTask() {
  console.log("Final Task");
}

var promise = Promise.resolve();
promise
  .then(taskA)
  .then(taskB)
  .catch(onRejected)
  .then(finalTask);

// Task A
// Error: throw Error @ Task A
// Final Task


function double(value) {
  return value * 2;
}
function increment(value) {
  return value + 1;
}
function output(value) {
  console.log(value);// => (1 + 1) * 2
}

var promise = Promise.resolve(1);  // 调用increment 并传入参数1
// 在回调函数中需要将值传递到下一个回调函数时 通过回调函数中的return语句实现
promise
  .then(increment)    // 调用increment 如果resolve 就调用double 并且将increment中return的值作为参数传递给double
  .then(double)
  .then(output)
  .catch(function(error){
      console.error(error);
  });
console.log('hi!')

// then和catch方法都会创建并返回一个新的Promise对象

// 有时候要在多个promise对象都变为FulFilled状态的时候才要进行某种处理
function getURL(URL) {
  return new Promise(function (resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', URL, true);
    req.onload = function () {
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
var request = {
  comment: function getComment() {
    return getURL('https://azu.github.io/promises-book/json/comment.json').then(JSON.parse);  // req.responseText的内容传递到JSON.parse函数
  },
  people: function getPeople() {
    return getURL('https://azu.github.io/promises-book/json/people.json').then(JSON.parse);
  }
};

// main函数返回一个promise对象
function main() {
  function recordValue(results, value) {
    results.push(value);
    return results;
  }
  // bind方法返回一个由recordValue函数改造而来的新函数 这个新函数的this指向null 参数results为一个空数组 因此只需要向pushValue函数提供一个参数value
  var pushValue = recordValue.bind(null, []);

  // 通过comment方法中的return语句 将其结果传递到pushValue函数中的value参数 
  return request.comment().then(pushValue).then(request.people).then(pushValue);
}


main().then(function (value) {  // 当request对象中的两个方法对应的Promise对象都变为FulFilled状态的时候才执行这里的回调
  console.log(value);
}).catch(function(error){
  console.error(error);
});
