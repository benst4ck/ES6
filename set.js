// Set数据结构类似于数组 但是其成员值都是唯一的 没有重复的值

const s = new Set();
[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));  // 调用set的add方法向set中添加成员 不会添加重复的值

s;
// Set(4) {2, 3, 5, 4}

for (let i of s) {  // 遍历set
  console.log(i);
}
// 2
// 3
// 5
// 4

const set = new Set([2, 3, 1, 4, 4, 3]);  // 构造函数Set()接受一个具有iterable接口的数据结构作为参数
// Set结构的键名就是键值 两者是同一个值
set;
// Set(4) {2, 3, 1, 4}
set.size;
// 4

[...set]  // 解构set
// [2, 3, 1, 4]

// 去除数组的重复元素
[...new Set(array)]

var set = new Set();

set.add(NaN)
// Set(1) {NaN}
set.add(3)
// Set(2) {NaN, 3}
set.add("3")
// Set(3) {NaN, 3, "3"}

set.add(NaN)  // 添加失败 这表明 在Set内部 两个NaN是相等
// Set(3) {NaN, 3, "3"}

// 两个空对象总是不相等的
set.add({})
// Set(4) {NaN, 3, "3", {…}}
set.add({})
// Set(5) {NaN, 3, "3", {…}, {…}}

set.has(NaN)  // 返回true时 表示NaN是set的成员
// true
set.has({})
// false
set.has("3")
// true
set.delete("3")  // 返回true时 表示成功删除成员
// true
set.has("3")
// false

set
// Set(4) {NaN, 3, {…}, {…}}

set.clear()  // 清空set
set;
Set(0) {}

var items = new Set([1, 2, 3, 4, 5]);
var array = Array.from(items);  // Array.from方法可以将Set结构转为数组

array;
// [1, 2, 3, 4, 5]

// 数组去重的另一种方法
function dedupe(array) {
  return Array.from(new Set(array));
}

dedupe([1, 1, 2, 3]) 
// [1, 2, 3]

var set = new Set([1, 4, 9]);
// Set的forEach方法的参数就是一个处理函数 该函数的参数与数组的forEach一致 依次为键值 键名 集合本身(这里省略掉了第三个参数)
set.forEach((value, key) => console.log(key + ' : ' + value))
// 1 : 1
// 4 : 4
// 9 : 9

// 数组的map和filter方法也可以间接用于Set
var set = new Set([1, 2, 3]);
set = new Set([...set].map(x => x * 2));
set;
// Set(3) {2, 4, 6}

var set = new Set([1, 2, 3, 4, 5]);
set = new Set([...set].filter(x => (x % 2) == 0));
set;
// Set(2) {2, 4}

var a = new Set([1, 2, 3]);
var b = new Set([4, 3, 2]);

new Set([...a, ...b]);  // 并集
// Set(4) {1, 2, 3, 4}

new Set([...a].filter(x => b.has(x)));  // 交集
// Set(2) {2, 3}

new Set([...a].filter(x => !b.has(x)));  // a相对于b的差集
// Set(1) {1}