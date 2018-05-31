function log(x, y) {
  y = y || 'World';
  console.log(x, y);
}
// 当调用log函数时 如果没有给形参y传递值 或者传递的值的布尔值为false 那么就会使用默认值world
log('Hello')
// Hello World

log('Hello', 'China')
// Hello China

log('Hello', '')
// Hello World

// ES6允许为函数的参数设置默认值 即直接写在参数定义的后面

function log(x, y = 'World') {
  console.log(x, y);
}

log('Hello', '')
// Hello 

function foo(x = 5) {  // 函数的参数是默认声明的 不能用let或const再次声明
  let x = 1;  // error
  const x = 2;  // error
}

// 解构赋值与函数参数的默认值
function m1({x = 0, y = 0} = {}) {
  return [x, y];
}

function m2({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}

m1()
// [0, 0]
m2()
// [0, 0]
m1({x: 5, y: 7})
// [5, 7]
m2({x: 5, y: 7})
// [5, 7]
m1({x: 3})
// [3, 0]
m2({x: 3})
// [3, undefined]
m1({})
// [0, 0]
m2({})
// [undefined, undefined]

// 通常情况下 定义了默认值的参数应该是函数的尾参数 如果不是尾参数 这时候只能在调用函数时通过undefined占位来忽略有默认值的参数
function f(x, y = 5, z) {
  return [x, y, z];
}

f()
// [undefined, 5, undefined]
f(1)
// [1, 5, undefined]
f(1, undefined, 2)
// [1, 5, 2]
f(1, , 2)
// 报错

// 函数的length属性将返回函数参数的个数 如果参数设置了默认值 这时候函数的length属性将忽略设置默认值的参数及其后面的参数
// 函数的length属性不计算rest参数
(function f(a, b, c, d, e, f) {}).length
// 6

function foo(a, b, c, d = 5, e, f) {}
foo.length;
// 3

var x = 1;
// 一旦设置了参数的默认值 函数进行声明初始化时 参数会形成一个单独的作用域
// 调用函数f时 参数形成一个单独的作用域 实参5传递给形参x 这时候默认值变量x会从这个参数作用域中去获取x的值 而不是到全局作用域去获取
function f(x, y = x) {
  console.log(y);
}

f(5)
// 5

function throwIfMissing() {
  throw new Error('Missing parameter');
}
// 如果调用函数foo时没有传递参数 就会调用throwIfMissing函数
function foo(mustBeProvided = throwIfMissing()) {
  return mustBeProvided;
}

foo()
// Uncaught Error: Missing parameter

// rest参数(...变量名)用于获取多余的函数参数 调用函数时传递的实参首先赋值给对应的形参 如果实参有多余 则保存到rest数组参数中
// rest参数只能是函数的最后一个参数
function add(...values) {
  let sum = 0;

  for (var val of values) {
    sum += val;
  }

  return sum;
}

add(4,1,6)
// 11
add(4,1,6,8)
// 19

function add(a, ...values) {
  let sum = 0;

  for (var val of values) {
    sum += val;
  }

  return sum;
}

add(4,1,6,8)
// 15

// 使用rest参数代替arguments类数组对象通常会更方便 因为rest参数就是一个数组 可以直接使用数组的方法