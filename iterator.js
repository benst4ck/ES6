// JS表示数据集合的数据结构有4种 Array Object Map和Set
// 遍历器(Iterator)是一种接口 为各种不同的数据结构提供统一的访问机制
// 任何数据结构只要部署了Iterator接口 就可以完成遍历操作 即依次处理该数据结构的所有成员

// 一个数据结构只要部署了Symbol.iterator属性 就被视为具有Iterator接口 就可以用for...of循环遍历它的成员 也就是说for...of循环内部调用的是数据结构的Symbol.iterator方法

// Iterator的遍历过程

	// 首先 创建一个指针对象 指向当前数据结构的起始位置 遍历器对象本质上来说就是一个指针对象
	// 第一次调用指针对象的next方法 可以将指针指向数据结构的第一个成员 第二次调用时 则指向数据结构的第二个成员
	// 不断调用指针对象的next方法 直到它指向数据结构的结束位置
	// 每一次调用next方法 都会返回数据结构中指针所指成员的当前信息(一个包含value和done属性的对象 value表示当前成员的值 done表示遍历是否结束)

function makeIterator(array) {
  var nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length ?
        {value: array[nextIndex++], done: false} :  // 先返回array[nextIndex] 再执行nextIndex++
        {value: undefined, done: true};
    }
  };
}

// makeIterator是一个遍历器生成函数 作用就是返回一个遍历器对象 对数组['a', 'b']执行这个函数 就会返回该数组的遍历器对象it(即指针对象)

var it = makeIterator(['a', 'b']);

it.next()  // 指针对象的next方法 用来移动指针
// {value: "a", done: false}

it.next()
// {value: "b", done: false}

it.next()  // 已遍历完 没有必要再调用next方法
// {value: undefined, done: true}

// 由于Iterator只是把接口规格加到数据结构之上 所以遍历器与它所遍历的数据结构实际上是分开的 完全可以写出没有对应数据结构的遍历器对象 或者说用遍历器对象模拟出数据结构
function idMaker() {
  var index = 0;

  return {
    next: function() {
      return {value: index++, done: false};
    }
  };
}
var it = idMaker();

it.next().value
// 0
it.next().value
// 1
it.next().value
// 2

// 一种数据结构只要部署了Iterator接口 我们就称这种数据结构是"可遍历的(iterable)" 就可以用for...of循环遍历

// ES6规定 默认的Iterator接口部署在数据结构的Symbol.iterator属性 或者说 一个数据结构只要具有Symbol.iterator属性 就可以认为是"可遍历的" 
// Symbol.iterator属性本身是一个函数 就是当前数据结构默认的遍历器生成函数 执行这个函数 就会返回一个遍历器

// 原生具备Iterator接口的数据结构: Array Map Set String 函数的arguments对象 DOM的NodeList对象
var s = 'hello'
var iter = s[Symbol.iterator]();

iter.next()
// {value: "h", done: false}
iter.next()
// {value: "e", done: false}
iter.next()
// {value: "l", done: false}
iter.next()
// {value: "l", done: false}
iter.next()
// {value: "o", done: false}
iter.next()
// {value: undefined, done: true}

// 对于原生部署Iterator接口的数据结构 不用自己写遍历器生成函数 for...of循环会自动遍历它们 
// 除此之外 其他数据结构(主要是对象Object)的Iterator接口 都需要自己在Symbol.iterator属性上面部署 这样才会被for...of循环遍历
// 对象(Object)之所以没有默认部署Iterator接口 是因为对象的哪个属性先遍历 哪个属性后遍历是不确定的 需要开发者手动指定
// 严格地说 对象部署遍历器接口并不是很必要 因为这时对象实际上被当作Map结构使用

// 类数组对象调用数组的Symbol.iterator方法 但普通对象部署数组的Symbol.iterator方法 并无效果
var iterable = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator]
};
for (let item of iterable) {
  console.log(item); // 'a', 'b', 'c'
}

// 对数组和Set结构进行解构赋值时 会默认调用Symbol.iterator方法
var set = new Set().add('a').add('b').add('c');
var [x,y] = set;
var [first, ...rest] = set;

set;
// Set(3) {"a", "b", "c"}
x;
// "a"
y;
// "b"
first;
// "a"
rest;
// ["b", "c"]
var [first, second, ...rest] = [2,4,6,8,10] 

first;
// 2
second;
// 4
rest;
// [6, 8, 10]

// 扩展运算符(...)也会调用默认的Iterator接口
var str = 'hello';
[...str]
// ["h", "e", "l", "l", "o"]
let arr = ['b', 'c'];
['a', ...arr, 'd']
// ["a", "b", "c", "d"]

// yield* 后面跟的是一个可遍历的结构 它会调用该结构的遍历器接口
let generator = function* () {
  yield 1;
  yield* [2,3,4];
  yield 5;
};

var iterator = generator();

iterator.next()
// {value: 1, done: false}
iterator.next()
// {value: 2, done: false}
iterator.next()
// {value: 3, done: false}
iterator.next()
// {value: 4, done: false}
iterator.next()
// {value: 5, done: false}
iterator.next()
// {value: undefined, done: true}


var arr = ['a', 'b', 'c', 'd'];
// JS原有的for...in循环只能获得对象的键名 不能直接获取键值 ES6提供for...of循环允许遍历获得键值
// for...in循环主要是为遍历对象而设计的，不适用于遍历数组
for (let x in arr) {
  console.log(x); // 0 1 2 3
}

for (let x of arr) {
  console.log(x); // a b c d
}

let arr = [3, 5, 7];
arr.foo = 'hello';

for (let i in arr) {
  console.log(i); // 0 1 2 foo
}
// 数组的遍历器接口只返回具有数字索引的属性的属性值
for (let i of arr) {
  console.log(i); // 3 5 7
}