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