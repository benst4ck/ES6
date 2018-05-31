// 数组解构赋值
// 数组的元素是按次序排列的 变量的取值由它的位置决定
let [a,b,c] = [3, 5, 7];  // 解构时 如果等号右边不是可遍历的结构 那么将会报错
a;
// 3
b;
// 5
c;
// 7

let [foo, [[bar], baz]] = [1, [[2], 3]];
foo;
// 1
bar;
// 2
baz;
// 3

let [ , , third] = ["foo", "bar", "baz"];
third;
// "baz"

let [head, ...tail] = [1, 2, 3, 4];
head;
// 1
tail;
// [2, 3, 4]

let [x, y, ...z] = ['a'];
x;
// "a"
y;  // y的值解构不成功 值为undefined
// undefined
z;
// []


let [a, [b], d] = [1, [2, 3], 4];
a;
// 1
b;
// 2
d;
// 4

// 解构赋值允许指定默认值
// 但只有当一个数组成员严格等于undefined时 默认值才会生效
let [m, n = 'b'] = ['a'];
m;
// "a"
n;
// "b"

let [m, n = 'b'] = ['a', undefined];
m;
// "a"
n;
// "b"

let [m = 'a', n = 'b'] = [false, null];  // false和null并不严格等于(===)undefined 所以指定的默认值并不启用
m;
// false
n;
// null

// 默认值可以引用解构赋值的其他变量 但该变量必须已经声明
let [x = 1, y = x] = [2]; 
x;
// 2
y;
// 2

function f() {
  console.log('aaa');
}
// 如果默认值是一个表达式 那么这个表达式是惰性求值的
// 因为x能取到值 所以函数f根本不会执行
let [x = f()] = [1];


// 对象解构赋值
// 对象的属性没有次序 变量必须与属性同名 才能取到正确的对应值
let { foo, bar, baz } = { bar: "hi", foo: 61 }  
// 相当于 let { foo: foo, bar: bar, baz: baz } = { bar: "hi", foo: 61 }
// 在 { foo: foo } 中 第一个foo为属性名 第二个foo为变量 通过第一个foo到等号右边的对象中去匹配对应的属性名 匹配到的属性的属性值赋值给第二个foo
foo;
// 61
bar;
// "hi"
baz;  // 如果解构失败 变量的值等于undefined
// undefined

// 对象的解构赋值的内部机制 是先找到同名属性foo 然后再赋给对应的变量baz 真正被赋值的是baz 而不是foo
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
foo;
// ReferenceError: foo is not defined
baz;
// "aaa"

let obj = {};
let arr = [];
({ foo: obj.prop, bar: arr[0] } = { foo: 123, bar: true })  // 这里最外层的圆括号省掉也没有报错

obj;
// {prop: 123}
arr;
// [true]

// 指定默认值
var {x, y = 5, z = 2} = {x: 1, z: 10};
x;
// 1
y;
// 5
z;
// 10

var {x: y = 3} = {x: 5};
x;
// ReferenceError: x is not defined
y;
// 5

// 默认值生效的条件是 对象的属性值严格等于undefined
var {x = 3} = {x: undefined};
x;
// 3
var {x = 3} = {x: null};
x;
// null


// 将Math对象的round和sqrt方法 赋值到对应的变量上 这样使用起来更方便
let {round, sqrt} = Math;
round(2.47)
2
round(11.69)
12
sqrt(16)
4

let arr = [9,6,3];
let {0 : first, [arr.length - 1] : last} = arr;

first;
// 9
last;
// 3

// 字符串也可以解构赋值
const [a1,b1,c1,d1,e1] = 'hello';
a1
// "h"
b1
// "e"
c1
// "l"
d1
// "l"
e1
// "o"
let {length : len} = 'hello';
len
// 5

// 函数参数的解构赋值

// 函数add的参数表面上是一个数组 但在传入参数的那一刻 数组参数就被解构成变量x和y 对于函数内部的代码来说 它们能感受到的参数就是x和y
function add([x, y]){
  return x + y;
}

add([1, 2]);
// 3

[[1, 2], [3, 4], [5, 6]].map(([a, b]) => a + b);
// [3, 7, 11]

function move({x = 0, y = 0} = {}) {
  return [x, y];
}

move({x: 3, y: 8}); 
// [3, 8]
move({x: 3}); 
// [3, 0]
move({}); 
// [0, 0]
move(); 
// [0, 0]

[1, undefined, 3].map((x = 'yes') => x);  // undefined 会触发函数参数的默认值
// [1, "yes", 3]

// 通过解构赋值来交换变量的值
let x = 1;
let y = 2;
[x, y] = [y, x];

x;
// 2
y;
// 1

// 函数只能返回一个值 如果要返回多个值 只能将它们放在数组或对象里返回 有了解构赋值 取出这些值就非常方便
function example() {
  return [1, 2, 3];
}
let [a1, b1, c1] = example();

a1;
// 1
b1;
// 2
c1;
// 3

function example() {
  return {
    foo: 14,
    bar: 21
  };
}
let { foo, bar } = example();
foo;
// 14
bar;
// 21

// 加载模块时 往往需要指定加载模块中的哪些方法 解构赋值使得加载项非常清晰
const { SourceMapConsumer, SourceNode } = require("source-map");
