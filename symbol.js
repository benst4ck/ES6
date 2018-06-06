// ES5的对象的属性名都是字符串 这样很容易导致属性名的冲突
// ES6引入了一种新的数据类型Symbol来表示独一无二的值 也是JS的第七种数据类型

var s1 = Symbol('foo');  // Symbol函数可以接受一个字符串作为参数 参数的作用在于区分不同的Symbol实例
var s2 = Symbol('bar');

s1;
// Symbol(foo)
typeof s2;
// "symbol"

var obj = {
  toString() {
    return 'abc';
  }
};
var sym = Symbol(obj);  // 如果Symbol的参数是一个对象 就会调用该对象的toString方法 将其转为字符串 然后才生成一个Symbol值

sym;
// Symbol(abc)

// Symbol函数的参数只是表示对当前Symbol值的描述 因此相同参数的Symbol函数的返回值是不相等的
var s1 = Symbol('foo');
var s2 = Symbol('foo');
s1 === s2
// false
s1 == s2
// false

var sym = Symbol('My symbol');
// Symbol值不能与其他类型的值进行运算
`your symbol is ${sym}`
// TypeError: Cannot convert a Symbol value to a string

// 但是Symbol值可以显式转为字符串
String(sym)
// "Symbol(My symbol)"
sym.toString()
// "Symbol(My symbol)"

// Symbol值可以转化为布尔值 但是不能转为数值
Boolean(sym)
// true

var mySymbol = Symbol();
var a = {};

a[mySymbol] = 'Hello!';  // 以Symbol值作为属性名 给对象添加一个属性

a;
// {Symbol(): "Hello!"}

var b = {
	mySymbol: 'string got',  // 字符串类型的属性名
	[mySymbol]: 'symbol got'  // Symbol类型的属性名 Symbol值必须放在方括号之中
}

b;
// {mySymbol: "string got", Symbol(): "symbol got"}

b.mySymbol  // 点运算符后面总是字符串 所以访问到的是字符串类型的属性 而不是Symbol类型的属性
// "string got"
b['mySymbol']
// "string got"

b[mySymbol]
// "symbol got"

// Symbol值定义对象方法
var obj = {
  [sym](arg) { ... }
};


function getArea(shape, options) {
  let area = 0;
  switch (shape) {
    case 'Triangle':  // 魔术字符串 就是在代码之中多次出现 与代码形成强耦合的某一个具体的字符串或者数值 不利于维护和修改 应该写为一个变量
      area = .5 * options.width * options.height;
      break;
    /* ... more code ... */
  }

  return area;
}

getArea('Triangle', { width: 100, height: 100 });  // 魔术字符串


const shapeType = {
  triangle: 'Triangle'
};

function getArea(shape, options) {
  let area = 0;
  switch (shape) {
    case shapeType.triangle:
      area = .5 * options.width * options.height;
      break;
  }
  return area;
}

getArea(shapeType.triangle, { width: 100, height: 100 });

// shapeType.triangle具体等于哪个值并不重要 只要确保不会跟其他shapeType属性的值冲突即可 因此这里就很适合改用Symbol值
const shapeType = {
  triangle: Symbol()
};


var obj = {};
var a = Symbol('a');
var c = Symbol('c');

obj[a] = 'Hello';
obj.b = 'foo';
obj[c] = 'World';


var objectSymbols = Object.getOwnPropertySymbols(obj);  // 获取指定对象的所有Symbol属性名 以Symbol值作为名称的属性 不会被常规方法遍历得到
objectSymbols;
// [Symbol(a), Symbol(c)]

Reflect.ownKeys(obj)
// ["b", Symbol(a), Symbol(c)]

// Symbol.for方法接受一个字符串作为参数 然后搜索有没有以该参数创建的Symbol值 如果有就返回这个Symbol值 否则就新建并返回一个以该字符串为参数创建的Symbol值
var s1 = Symbol.for('foo');
var s2 = Symbol.for('foo');

s1 === s2;
// true

// Symbol.for()与Symbol()这两种写法 都会生成新的Symbol
// 它们的区别是 前者会被登记在全局环境中供搜索 后者不会 
// Symbol.for()不会每次调用就返回一个新的Symbol类型的值 而是会先检查给定的key是否已经存在 如果不存在才会新建一个值
// 比如 如果你调用Symbol.for("cat") 10次 每次都会返回同一个Symbol值 但是调用Symbol("cat") 10次 会返回10个不同的Symbol值

Symbol.keyFor(s1)  // Symbol.keyFor方法返回一个已登记的Symbol类型值的key
// "foo"