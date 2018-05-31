// let
{
  let x = 10;  // let用于声明变量 但声明的变量只在let命令所在的代码块内有效
  var y = 1;
}

x;
// ReferenceError: x is not defined
y;
// 1

var arr = [];
for (var i = 0; i < 10; i++) {  // 这里通过var声明的变量i是一个全局变量 随着循环的执行 i的最终值为10 数组arr中的每一个函数被调用时 打印的都是这个全局变量i 
  arr[i] = function () {
    console.log(i);
  };
}

arr[0]();
// 10
arr[7]();
// 10

console.log(i)  // 变量i只用来控制循环 但是循环结束后 它并没有消失 泄露成了全局变量
// 10

var arr = [];
for (let i = 0; i < 10; i++) {  // 这里的变量i是通过let声明的 i只在对应的那一次循环中有效 这时候每次循环都有自己的变量i
  arr[i] = function () {
    console.log(i);
  };
}

arr[7]()
// 7
arr[9]()
// 9

// for循环还有一个特别之处 就是设置循环变量的那部分是一个父作用域 而循环体内部是一个单独的子作用域 如果变量在子作用域中不存在 则先到父作用域(声明循环变量的作用域)中查找
// 输出了3次abc 这表明函数内部的变量i与循环变量i不在同一个作用域 有各自单独的作用域
for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);
}
// abc
// abc
// abc

var i = 4
for (let i = 0; i < 3; i++) {
  console.log(i);
}
// 0
// 1
// 2

// var命令会发生变量提升现象 即变量可以在声明之前使用 但值为undefined 因为赋值还是在原来的位置
// let命令则不存在变量提升 也就是说 只有声明变量后才能够使用变量

// 存在全局变量tmp 但是块级作用域内let又声明了一个局部变量tmp 导致后者绑定这个块级作用域 所以在let声明变量前 形成一个暂时性死区(	TDZ) 对tmp赋值或访问会报错
var tmp = 123;
if (true) {
  // TDZ开始
  tmp = 'abc'; // ReferenceError
  console.log(tmp); // ReferenceError

  // 只要块级作用域内存在let命令 它所声明的变量就绑定这个区域 不再受外部的影响
  let tmp; // TDZ结束
  console.log(tmp); // undefined

  tmp = 123;
  console.log(tmp); // 123
}
// 暂时性死区的本质就是 只要一进入当前作用域 所要使用的变量就已经存在了 但是不可获取 只有等到声明变量的那一行代码出现 才可以获取和使用该变量

// let在相同作用域内重复声明同一个变量会报错
var i;
let i;  // SyntaxError: Identifier 'i' has already been declared

var y;  // 全局作用域声明变量y
function bar(x = y, y = 2) {  // 这里的参数相当于在函数作用域内通过let声明变量x和y 但是将y赋值给x前并没有声明变量y 这时候是变量y的一个暂时性死区 访问y变量 所以会报错
	let y;  // 这里出现报错说明参数变量是在函数作用域内声明的
  return [x, y];
}

bar();  // ReferenceError: y is not defined

function func(arg) {
  let arg;  // 报错
}

function func(arg) {
  {
    let arg;  // 不报错
  }
}

// ES5只有全局作用域和函数作用域 没有块级作用域 所以这就导致if代码块内部的变量tmp发生变量提升 这时console.log()在函数作用域内找到了变量tmp 就不会到全局作用域去查找
// 变量提升 导致内层的tmp变量覆盖了外层的tmp变量
var tmp = 'outer'

function f() {
  console.log(tmp);  // undefined
  if (false) {
    var tmp = 'inner';  // 将这里的var改为let就能够使得console.log()打印的是全局环境下声明的变量tmp
  }
}

f();

// let实际上为JS新增了块级作用域 并且外层作用域无法读取内层作用域的变量 但内侧作用域不存在时可以向外层作用域查找
function f() {  
  let n = 5;
  if (true) {
    let n = 10;
    if (true) {
    	console.log(n);  // 10
    }
  }
  console.log(n);  // 5
}

f();

// const声明一个只读的常量 一旦声明 常量的值就不能改变 所以声明时必须立即赋值
const PI = 3.14;
PI = 3.1415;
// TypeError: Assignment to constant variable.

// const命令声明的常量不会提升 同样存在暂时性死区 只能在声明的位置后面使用
// const的作用域与let命令相同 只在声明所在的块级作用域内有效
// const声明的常量 与let一样不可重复声明
var N = 18
const N = 18
// SyntaxError: Identifier 'N' has already been declared
