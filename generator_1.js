// Generator函数内部通常会封装多个状态 同时yield表达式只能用在Generator函数里面 
function* helloWorldGenerator() {  // function关键字和函数名之间有一个星号
	// 这里封装了三个状态 通过yield定义不同的内部状态
  yield 'hello';
  yield 'world';  // yield表达式应该放在return语句前
  return 'ending';
}

var hw = helloWorldGenerator();  // 调用Generator函数会返回一个遍历器对象(一个指向内部状态的指针对象) 通过这个遍历器对象可以依次遍历Generator函数内部的每一个状态
hw;
// helloWorldGenerator {<suspended>}

// 调用遍历器对象的next()方法 从函数头部开始执行 遇到yield表达式时 执行完该yield表达式后暂停往下执行 指针指向该处
// 当再次调用next()方法时 从刚才暂停的地方(指针指向的地方)恢复运行 直到遇到下一个yield表达式或return语句
// Generator函数是分段执行的 yield表达式是暂停执行的标记 而通过遍历器对象的next()方法可以恢复执行

hw.next()
// {value: "hello", done: false}
// value属性表示当前yield表达式的值 done属性的属性值为false表示遍历还没有结束
hw.next()
// {value: "world", done: false}
hw.next()
// {value: "ending", done: true}

hw.next()  // 这时候状态值已经遍历完 返回状态值undefined
// {value: undefined, done: true}

// 相比return而言 yield使得Generator函数能够多次返回值 并且带有记忆功能 

function* f() {
  for(var i = 0; true; i++) {
    var reset = yield i;
    if(reset) { i = -1; }
  }
}

var g = f();

g.next()
// {value: 0, done: false}
g.next()
// {value: 1, done: false}
g.next()
// {value: 2, done: false}

// yield表达式本身没有返回值 或者说总是返回undefined next方法可以带一个参数 该参数就会被当作上一个yield表达式的返回值
// 也就是说在返回 i值为2的状态后 执行了 i = -1; 接着执行了 i++; 所以这里调用next方法时返回i值为0的状态 
g.next(true)
// {value: 0, done: false}
g.next()
// {value: 1, done: false}

// Generator函数从暂停状态到恢复运行 它的上下文状态(context)是不变的
// 通过next方法的参数 就有办法在Generator函数开始运行之后 继续向函数体内部注入值
// 也就是说 可以在Generator函数运行的不同阶段 从外部向内部注入不同的值 从而调整函数行为


function* foo(x) {
  var y = 2 * (yield (x + 1));  // yield后面的表达式 不会立即求值 只会在next方法将指针移到这一句时 才会求值
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);  
// foo函数中的x值为5 第一次调用next方法时 返回第一个yield后面的表达式 同时yield表达式的返回值为undefined 因为调用next方法时没有传递参数
// 这时候y值为NaN 因此在第二次调用next方法时 返回的状态值也会是NaN 而z的值为undefined
// 第三次调用next方法时 执行return语句 返回值为NaN 同时状态已经遍历完

a.next()
// {value: 6, done: false}
a.next()
// {value: NaN, done: false}
a.next()
// {value: NaN, done: true}
a.next()
// {value: undefined, done: true}

var b = foo(5);
b.next()
// {value: 6, done: false}

// 这里使得上一次调用next方法时的整个yield语句yield (x + 1)的返回值为12 所以y值此时为24 这里第二次调用next方法时 yield第二个状态值8
b.next(12)  
// {value: 8, done: false}

// 这里使得上一次调用next方法时的整个yield语句yield (y / 3)的返回值为11 所以z值此时为11 这里第三次调用next方法 返回return后面的表达式的值 第三个状态值为5+24+11=40
b.next(11)
// {value: 40, done: true}

// 第一个next方法用来启动遍历器对象 所以不用带有参数

function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}
// for-of循环可以自动遍历调用Generator函数时生成的Iterator对象 且此时不再需要调用next方法
for (let v of foo()) {
	// 一旦next方法的返回对象的done属性为true for-of循环就会中止 且不包含该返回对象
  console.log(v);  // return语句返回的6 不包括在for-of循环之中
}
// 1
// 2
// 3
// 4
// 5

// 利用Generator函数和for-of循环 实现斐波那契数列
function* fibonacci() {
  let [prev, curr] = [0, 1];
  for (;;) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

for (let n of fibonacci()) {
  if (n > 200) break;
  console.log(n);
}
// 1
// 1
// 2
// 3
// 5
// 8
// 13
// 21
// 34
// 55
// 89
// 144

function* f(obj) {  // 调用f返回一个遍历器对象 该对象包含了多个状态 每个状态分别对应原生JS对象obj中的各个项
  let propKeys = Reflect.ownKeys(obj);

  for (let propKey of propKeys) {
    yield [propKey, obj[propKey]];
  }
}

// 原生的JS对象不具备Iterator接口 无法用for-of遍历 通过Generator函数f为它加上遍历器接口 就可以用for...of遍历了
let person = { first: 'Jane', last: 'Doe' };

for (let [key, value] of f(person)) {
  console.log(`${key}: ${value}`);
}
// first: Jane
// last: Doe

// 加上遍历器接口的另一种写法是 将Generator函数加到对象的Symbol.iterator属性上面
function* g() {
  let propKeys = Object.keys(this);

  for (let propKey of propKeys) {
    yield [propKey, this[propKey]];
  }
}

let person = { first: 'Jane', last: 'Doe' };

person[Symbol.iterator] = g;

for (let [key, value] of person) {
  console.log(`${key}: ${value}`);
}
// first: Jane
// last: Doe

function* numbers () {
  yield 1;
  yield 2;
  return 3;
  yield 4;
}

// for-of循环 扩展运算符(...) 解构赋值和Array.from方法内部调用的都是遍历器接口 它们都可以将Generator函数返回的Iterator对象作为参数
[...numbers()]
// [1, 2]

Array.from(numbers())
// [1, 2]

let [x, y] = numbers();
x;
// 1
y;
// 2

for (let n of numbers()) {
  console.log(n)
}

// 1
// 2
