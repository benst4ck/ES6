// ES6允许直接写入变量和函数 作为对象的属性和方法
var foo = 'bar';
var baz = {foo};  // 等同于 var baz = {foo: foo} 这时候 属性名为变量名 属性值为变量的值
baz;
// {foo: "bar"}

function f(x, y) {
  return {x, y};
}
// 等同于
function f(x, y) {
  return {x: x, y: y};
}

f(2, 6);
// {x: 2, y: 6}

// 不仅属性可以简写 方法也可以简写
var o = {
  method() {
    return "Hello world!";
  }
};
// 等同于
var o = {
  method: function() {
    return "Hello world!";
  }
};

// CommonJS 模块输出一组变量
let ms = {};
function getItem (key) {
  return key in ms ? ms[key] : null;
}
function setItem (key, value) {
  ms[key] = value;
}
function clear () {
  ms = {};
}

module.exports = { getItem, setItem, clear };
// 等同于
module.exports = {
  getItem: getItem,
  setItem: setItem,
  clear: clear
};

// 存取器属性
const cart = {
  _wheels: 4,

  get wheels() {
    return this._wheels;
  },

  set wheels(value) {
    if (value < this._wheels) {
      throw new Error('数值偏小');
    }
    this._wheels = value;
  }
}

cart
// {_wheels: 4}

cart.wheels  // 获取属性 这时候this值指向cart对象
// 4
cart.wheels = 3  // 设置属性
// Uncaught Error: 数值偏小

cart.wheels = 7
// 7
cart.wheels
// 7

var propKey = 'foo';
// ES6允许把表达式放在方括号内 作为属性名
var obj = {
  [propKey]: true,
  ['b' + 'ar']: 123
};

obj;
// {foo: true, bar: 123}
obj[propKey]
// true
obj.foo
// true
obj.bar
// 123

Object.is('foo', 'foo')
// true
Object.is({}, {})  // 这两个空对象在内存中的地址不同 和严格相等运算符(===)的运行结果一致
// false

// Object.is()与严格相等运算符的不同之处
Object.is(NaN, NaN)
// true
NaN===NaN
// false

// Object.assign()方法用于对象的合并 将源对象(source)自身的所有可枚举属性 复制到目标对象(target)
var target = { a: 1 };
var source1 = { a: 4, b: 2 };
var source2 = { c: 3 };

// Object.assign()方法的第一个参数是目标对象 后面的参数都是源对象
// 当有同名属性时 参数位置靠后的对象的属性覆盖靠前的
Object.assign(target, source1, source2);

target;
// {a: 4, b: 2, c: 3}

var obj1 = {a: {b: 1}};
var obj2 = Object.assign({}, obj1);  // 浅拷贝 如果源对象某个属性的值是对象 那么目标对象拷贝得到的是这个对象的引用

obj1===obj2
// false

obj1.a
// {b: 1}
obj2
// {a: {b: 1}}

obj1.a.b = 5

obj1.a
// {b: 5}
obj2.a
// {b: 5}

// Object.assign()方法会忽略enumerable为false的属性 只拷贝源对象自身的可枚举的属性到目标对象

var z = { a: 3, b: 4 };  
var n = { ...z };  // 通过解构实现深复制

z
// {a: 3, b: 4}
n
// {a: 3, b: 4}
z === n
// false
z.a = 9
// 9
z
// {a: 9, b: 4}
n
// {a: 3, b: 4}

Object.getOwnPropertyDescriptor(Object.prototype, 'toString').enumerable
// false
Object.getOwnPropertyDescriptor([], 'length').enumerable
// false

// for-in循环 只遍历对象自身的和继承的可枚举的属性 
// toString和length属性的enumerable属性的值都是false 因此for-in循环不会遍历到这两个继承自原型的属性

// Object.keys()返回对象自身的所有可枚举的属性的键名
// 大多数时候 关心的是对象自身的属性 所以尽量不要用for-in循环 而用Object.keys()代替

// Reflect.ownKeys(obj)返回一个数组 包含对象自身的所有键名 不管键名是Symbol或字符串 也不管是否可枚举
Reflect.ownKeys({ [Symbol()]:0, b:0, 10:0, 2:0, a:0 })
// ["2", "10", "b", "a", Symbol()]

var proto = { z: 40, y: 20 };
var obj = { x: 10 };
Object.setPrototypeOf(obj, proto);  // 设置对象obj的prototype对象为proto 这时候obj会继承proto的属性

obj.x
// 10
obj.y
// 20
obj.z
// 40

Object.getPrototypeOf(obj)  // 获取对象obj的原型
// {z: 40, y: 20}
Object.getPrototypeOf(obj) === proto
// true

var proto = {
  foo: 'hello'
};

var obj = {
  foo: 'world',
  find() {  // 目前只有对象方法的简写法可以让JS引擎确认定义的是对象的方法
    return super.foo;  // 关键字super 指向当前对象的原型对象 super关键字表示原型对象时 只能用在对象的方法之中
    									 // 等同于Object.getPrototypeOf(this).foo 
  }
};

Object.setPrototypeOf(obj, proto);
obj.find()
// "hello"


var proto = {
  x: 'hello',
  foo() {
    console.log(this.x);
  }
};

var obj = {
  x: 'world',
  foo() {
    super.foo();  // 等同于Object.getPrototypeOf(this).foo.call(this)  以对象obj为上下文调用对象proto中的foo方法
  }
}

Object.setPrototypeOf(obj, proto);
obj.foo()
// world

var {keys, values, entries} = Object;
var obj = { a: 1, b: 2, c: 3 };
for (let key of keys(obj)) {
  console.log(key);
}
// a
// b
// c

for (let value of values(obj)) {
  console.log(value);
}
// 1
// 2
// 3

for (let [key, value] of entries(obj)) {
  console.log([key, value]);
}
// ["a", 1]
// ["b", 2]
// ["c", 3]

// 如果Object.values方法的参数是一个字符串 会返回各个字符组成的一个数组

Object.values('foo')
// ["f", "o", "o"]

// 对象的解构赋值用于从一个对象取值
var { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
x
// 1
y
// 2
z
// {a: 3, b: 4}