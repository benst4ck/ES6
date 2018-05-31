// 箭头函数
var f = v => v;

// 等同于
var f = function (v) {
  return v;
};

// 如果箭头函数不需要参数或需要多个参数 就使用一个圆括号代表参数部分
var f = () => 5;
// 等同于
var f = function () { return 5 };

var sum = (num1, num2) => num1 + num2;
// 等同于
var sum = function(num1, num2) {
  return num1 + num2;
};

// 如果箭头函数的代码块部分多于一条语句 就要使用大括号将它们括起来 并且使用return语句返回
var sum = (num1, num2) => { 
	console.log(num1*num2);
	return num1 + num2; 
}

sum(2,6)
// 12
// 8

// 由于大括号被解释为代码块 所以如果箭头函数直接返回一个对象 必须在对象外面加上括号 否则会报错
var getTempItem = id => ({ id: id, name: "Temp" });
getTempItem(3);
// {id: 3, name: "Temp"}

// 箭头函数的一个用处是简化回调函数
var materials = [
  'Hydrogen',
  'Helium',
  'Lithium',
  'Beryllium'
];

materials.map(function(material) {
  return material.length;
});
// [8, 6, 7, 9]

// 更简短的函数
materials.map((material) => {
  return material.length;
});
// [8, 6, 7, 9]

materials.map(material => material.length);
// [8, 6, 7, 9]

[5,2,4,8,6,1,3,7].sort(function (a, b) {
  return b - a;
});
// [8, 7, 6, 5, 4, 3, 2, 1]

[5,2,4,8,6,1,3,7].sort((a, b) => a - b)
// [1, 2, 3, 4, 5, 6, 7, 8]

// 箭头函数结合rest参数
const headAndTail = (head, ...tail) => [head, tail];
headAndTail(1, 2, 3, 4)
// [1, [2, 3, 4]]

var age = 0  // 全局变量
function Person() {
  this.age = 0;
  // setInterval函数每过1000ms就会调用一次回调函数
  setInterval(function growUp() {
    this.age++;   // 每个新定义的普通函数都有自己的this值 这里的this和外层构造函数中的this值指向是不同的 这里的this指向的是全局变量
  }, 1000);
}

var p = new Person();  // 这时候构造函数中的this就指向这里的实例p
// p.age的值始终是0
p
// Person {age: 0}
p
// Person {age: 0}

age  // 查看全局变量age
// 48
age
// 56
age
// 70

// 通过将this值分配给封闭的变量 可以解决this问题
function Person() {
  var that = this;
  that.age = 0;
  setInterval(function growUp() {
    that.age++;
  }, 1000);
}

var p = new Person();
p;
// Person { age: 1 }
p;
// Person { age: 3 }
p;
// Person { age: 8 }
p;
// Person { age: 14 }

function Person(){
  this.age = 0;
  setInterval(() => {  // 箭头函数不会创建自己的this 它的this值就是外层代码的this值
    this.age++;  // 这里的this就是外层构造函数的this
  }, 1000);
}

var p1 = new Person();

p1;
// Person { age: 4 }
p1;
// Person { age: 9 }

function foo() {
  setTimeout(() => {
  	// 箭头函数内部的变量arguments 其实是函数foo的arguments变量
    console.log('args:', arguments);
  }, 100);
}

foo(2, 4, 6, 8)
//  [2, 4, 6, 8, callee: ƒ, Symbol(Symbol.iterator): ƒ]