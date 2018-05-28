console.log(2,3,4)
// 2 3 4

console.log(1, ...[2, 3, 4], 5)  // 扩展运算符(...)好比rest参数的逆运算 将一个数组转为用逗号分隔的参数序列
// 1 2 3 4 5

function add(x, y) {
  return x + y;
}

var data = [12, 5]

add(...data);
// 17

// 如果扩展运算符后面是一个空数组 则不产生任何效果
[...[], 1]
// [1]

var x = -1;
[
  ...(x > 0 ? ['a'] : []),
  'b',
];
// ["b"]

x = 2;
[
  ...(x > 0 ? ['a'] : []),
  'b',
];
// ["a", "b"]

// 由于扩展运算符可以展开数组 所以不再需要apply方法将数组转为函数的参数了

// ES5 的写法
function f(x, y, z) {
  // ...
}
var args = [0, 1, 2];
f.apply(null, args);

// ES6的写法
function f(x, y, z) {
  // ...
}
let args = [0, 1, 2];
f(...args);

// 将一个数组添加到另一个数组的尾部
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
// push方法的参数不能是数组 所以只好通过apply方法变通使用push方法
Array.prototype.push.apply(arr1, arr2);
arr1;
// [0, 1, 2, 3, 4, 5]

var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
// 有了扩展运算符 就可以直接将数组传入push方法
arr1.push(...arr2);
arr1;
// [0, 1, 2, 3, 4, 5]


var arr1 = [0, 1, 2];
var arr2 = arr1;  // 这时候只是复制了指向底层数据结构的指针 也就是说现在变量arr1和arr2都指向 [0, 1, 2] 

arr2;
// [0, 1, 2]
arr2[0] = 1;
arr1;
// [1, 1, 2]
arr2;
// [1, 1, 2]

var arr1 = [0, 1, 2];
var arr2 = arr1.concat();  // ES5复制一个数组
arr2;
// [0, 1, 2]
arr2[0] = 1;
// 1
arr2;
// [1, 1, 2]
arr1;
// [0, 1, 2]

// 扩展运算符提供了复制数组的简便写法

var a1 = [1, 2];
// 下面两种写法 a2都是a1的克隆
var a2 = [...a1];
var [...a2] = a1;

// ES5 合并数组
var arr1 = ['a', 'b'];
var arr2 = ['c'];
var arr3 = ['d', 'e'];

arr2.concat(arr3,arr1);
// ["c", "d", "e", "a", "b"]

// 通过扩展运算符合并数组
[...arr1, ...arr2, ...arr3]
// ["a", "b", "c", "d", "e"]

const [first, ...rest] = [1, 2, 3, 4, 5];  // 如果将扩展运算符用于数组赋值 只能放在参数的最后一位 否则会报错
first;
// 1
rest;
// [2, 3, 4, 5]

const [first, ...rest] = [];
first;
// undefined
rest;
// []

// 扩展运算符还可以将字符串转为真正的数组
[...'hello']
// ["h", "e", "l", "l", "o"]

// 任何实现了Iterator接口的对象(arguments对象 NodeList对象) 都可以用扩展运算符转为真正的数组
// querySelectorAll方法返回的是一个nodeList对象 它不是数组 而是一个类似数组的对象 这时扩展运算符可以将其转为真正的数组 原因就在于NodeList对象实现了Iterator接口
let nodeList = document.querySelectorAll('div'); 
let array = [...nodeList];

let arrayLike = {  // 对于这种没有部署Iterator接口的类数组的对象 扩展运算符就无法将其转为真正的数组 同时会报错
  '0': 'a',
  '1': 'b',
  '2': 'c',
  length: 3
};
// 将没有实现Iterator接口的类数组的对象转换为真正的数组的方法
// ES5的写法
var arr1 = [].slice.call(arrayLike);

// ES6的写法
let arr2 = Array.from(arrayLike);  // 实际应用中 常见的类数组的对象是DOM操作返回的NodeList集合 以及函数内部的arguments对象 Array.from都可以将它们转为真正的数组

arr1;
// ["a", "b", "c"]
arr2;
// ["a", "b", "c"]

const toArray = (() =>
  Array.from ? Array.from : obj => [].slice.call(obj)
)();

Array.from('hello')
// ["h", "e", "l", "l", "o"]

var arr1 = [0, 1, 2];
var arr2 = Array.from(arr1);  // 如果参数是一个真正的数组 Array.from会返回一个一模一样的新数组
arr2;
// [0, 1, 2]

arr2[0]=1;
// 1
arr1;
// [0, 1, 2]
arr2;
// [1, 1, 2]

// 扩展运算符背后调用的是遍历器接口(Symbol.iterator) 如果一个对象没有部署这个接口 就无法转换
// Array.from方法还支持类似数组的对象 所谓类数组对象 本质特征就是必须有length属性
// 因此 任何有length属性的对象 都可以通过Array.from方法转为数组 而此时扩展运算符可能无法转换

Array.from({ length: 3 });
// [undefined, undefined, undefined]
Array.from({ length: 3, name: 'foo' });
// [undefined, undefined, undefined]
Array.from({ length: 3, 1: 'foo' });
// [undefined, "foo", undefined]

Array.from(arrayLike, x => x * x);
// 可接受第二个参数 等同于
Array.from(arrayLike).map(x => x * x);  // 如果map函数里面用到了this关键字 还可以传入Array.from的第三个参数 用来绑定this

Array.from({0:2,1:3,2:4}, (x) => x * x)
// []
Array.from({0:2,1:3,2:4,length:3}, (x) => x * x)
// [4, 9, 16]

// Array.from的第一个参数指定了第二个参数运行的次数 这种特性可以让该方法的用法变得非常灵活
Array.from({ length: 2 }, () => 'jack')
// ["jack", "jack"]

Array()
// []
Array(3)  // 参数个数只有一个时 实际上是指定数组的长度
// [empty × 3]
Array(2,4,6)  // 只有当参数个数不少于2个时 Array()才会返回由参数组成的新数组
// [2, 4, 6]

// Array.of总是返回参数值组成的数组 如果没有参数 就返回一个空数组
Array.of(8)
// [8]
Array.of(6, 14, 7)
// [6, 14, 7]

// find()方法的参数是一个回调函数 所有数组成员依次执行该回调函数 直到找出第一个返回值为true的成员 然后返回该成员 并不再往下继续查找 如果没有符合条件的成员 则返回undefined
[1, 4, -5, 10, -2].find((n) => n < 0);  
// -5

function cb(value, index, arr) {
	if(value>9) {
		console.log(`the index ${index} of [${arr}] is greater than 9`)
	}
  return value > 9;
}

[1, 5, 10, 15].find(cb);  // 返回元素
// the index 2 of [1,5,10,15] is greater than 9
// 10

[1, 5, 10, 15].findIndex(cb);  // 返回元素的索引
// the index 2 of [1,5,10,15] is greater than 9
// 2

function f(v){
  return v > this.age;
}
let person = {name: 'John', age: 20};
[10, 12, 26, 15].find(f, person);  // 第二个参数 用来绑定回调函数f的this对象
// 26

['a', 'b', 'c'].fill(7)
// [7, 7, 7]
new Array(3).fill(7)
// [7, 7, 7]
['a', 'b', 'c'].fill(7, 1, 2)  // fill方法还可以接受第二个和第三个参数 用于指定填充的起始位置和结束位置
// ["a", 7, "c"]

// 如果填充的类型为对象 那么被赋值的是同一个内存地址的对象 而不是深拷贝对象
var arr = new Array(3).fill({name: "Mike"});
arr;
// [{name: "Mike"}, {name: "Mike"}, {name: "Mike"}]
arr[1].name = "Ben";
arr;
// [{name: "Ben"}, {name: "Ben"}, {name: "Ben"}]

// for...of 遍历数组
for (let elem of ['a', 'b']) {
  console.log(elem);
}
// a
// b

for (let elem of ['a', 'b'].keys()) {
  console.log(elem);
}
// 0
// 1

for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem);
}
// 0 "a"
// 1 "b"

// 判断某个数组是否包含给定的值
[1, 2, 3].includes(2)
// true
[1, 2, 3].includes(4)
// false
[1, 2, NaN].includes(NaN)
// true

// 空位不是undefined 一个位置的值等于undefined 仍然是有值的 空位是没有任何值 in运算符可以说明这一点
0 in [undefined, undefined, undefined]  // 0号位置是有值的
// true
0 in [,,,]  // 0号位置没有值
// false

// ES6则是明确将空位转为undefined

Array.from(['a',,'b'])
// ["a", undefined, "b"]
[...['a',,'b']]
// ["a", undefined, "b"]

// 由于空位的处理规则非常不统一 所以建议避免出现空位