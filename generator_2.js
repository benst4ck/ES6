function* foo() {
  yield 'a';
  yield 'b';
}

function* bar() {
  yield 'x';

  // yield*表达式 用来在一个Generator函数里面执行另一个Generator函数
  // foo()返回一个遍历器对象 yield*后跟一个遍历器对象 会返回这个遍历器对象中的状态值
  yield* foo();  // 如果用的是 yield foo() 那么for-of循环遍历时 将返回的是一个遍历器对象
  yield 'y';
}

for (let v of bar()){
  console.log(v);
}

// x
// a
// b
// y

function* gen(){
  yield* ["a", "b", "c"];
}

var g = gen() 

g.next()
// {value: "a", done: false}
g.next()
// {value: "b", done: false}
g.next()
// {value: "c", done: false}
g.next()
// {value: undefined, done: true}

var read = (function* () {
  yield 'hello';
  yield* 'hello';
})();

read.next().value
// "hello"
read.next().value
// "h"
read.next().value
// "e"
read.next().value
// "l"

// 任何数据结构只要有Iterator接口 就可以被yield*遍历
// 数组和字符串都具备Iterator接口 对象(Object)则不具备Iterator接口

// 两个状态无限循环 Generator是实现状态机的最佳结构
var clock = function* () {
  while (true) {
    console.log('Tick!');
    yield;
    console.log('Tock!');
    yield;
  }
};


function addOne(x,y){
	console.log(x+1,y+1);
}

function squareAsynchronously(x,y){
	return [x*x,y*y]
}

function sum(x,y){
	console.log(x+y);
}

// Generator函数的一个重要实际意义就是用来处理异步操作 改写回调函数
// 可以把异步操作写在yield表达式里面 等到调用next方法时再往后执行
function* gen(x,y) {
	addOne(x,y);
	yield squareAsynchronously(x,y);
	sum(x,y);
}

var g = gen(2,4);
// 第一次调用遍历器的next方法时 addOne()和squareAsynchronously()被执行
g.next().value
// 3 5
// [4, 16]
g.next()
// 6
// {value: undefined, done: true}

// 利用Generator函数 可以在任意对象上部署Iterator接口
function* iterEntries(obj) {
  let keys = Object.keys(obj);
  for (let i=0; i < keys.length; i++) {
    let key = keys[i];
    yield [key, obj[key]];
  }
}

// myObj是一个普通对象 通过iterEntries函数 就有了Iterator接口 也就是说 可以在任意对象上部署next方法
let myObj = { foo: 3, bar: 7 };  // foo和bar在这里都是字符串

for (let [key, value] of iterEntries(myObj)) {
  console.log(key, value);
}
// foo 3
// bar 7

// JS是单线程的 所以异步编程对于JS来说非常重要
// 回调函数
fs.readFile('/etc/passwd', 'utf-8', function (err, data) {
  if (err) throw err;
  console.log(data);
});
// 这里的第三个参数就是回调函数 等到操作系统返回了/etc/passwd这个文件以后 回调函数才会执行 去处理这个文件
// 而在完成读取这个文件前的这段等待时间里 JS会去执行其他的任务
// 在Node中约定 回调函数的第一个参数必须是错误对象err 如果没有出现错误那么err的值为null
// 这样约定的原因在于 读取文件完成后 任务所在的上下文环境就结束了 在这后面抛出的错误 原来的上下文环境已经无法去捕捉 只能传入回调函数中进行处理
// 回调函数本身没有什么问题 但是当多个回调函数出现嵌套时 代码就会乱成一团 Promise对象就是为了解决这个问题而提出的 将回调函数的嵌套改成链式调用
// Promise的最大问题是代码冗余 原来的任务被Promise包装了后 不管什么操作 一眼看去都是一堆then 原来的语义变得很不清楚

// 协程(coroutine) 大致运行流程 协程A开始运行 运行一段后进入暂停 执行权移交给协程B 一段时间后协程B交还执行权 协程A恢复执行
// 这里的协程A就是一个异步任务 因为他分为了多段执行
// yield命令表示执行到此处 执行权将交给其他协程 也就是说 yield命令是异步两个阶段的分界线
// 协程遇到yield命令就暂停 等到执行权返回 再从暂停的地方继续往后执行 它的最大优点 就是代码的写法非常像同步操作
