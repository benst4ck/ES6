// JS的Object数据结构 本质上键值对的集合 传统上只能用字符串当作键 这有很大的局限性
// 通俗的说 Object是字符串到值的对应 Map是值到值的对应 是一种更完善的hash结构

var map = new Map();
var obj = {p: 'Hello World'};

// 将对象obj设置为map的一个键 该键对应的值为 "content"
map.set(obj, 'content')
// Map(1) {{p: 'Hello World'} => "content"}

map.has(obj)  // 判断键obj是否存在于map
// true
map.get(obj)  // 获取键obj对应的值 找不到时返回 undefined
// "content"
map.delete(obj)  // 删除obj键
// true
map.has(obj)
// false

var map = new Map([  // 数组转化为Map
  [[6,7,8], 'Joe'],
  [110, 'Police']
]);

map;
// Map(2) {Array(3) => "Joe", 110 => "Police"}

map.has([6,7,8]);  // 只有对同一个对象的引用 Map结构才将其视为同一个键 虽然这里值相同 但是不是同一个对象
// false
map.has(110);
// true

// Map的键实际上是跟内存地址绑定的 只要内存地址不一样 就视为两个键

var map = new Map()
  .set(1, 'a')  // set方法返回的是当前的Map对象 因此可以采用链式写法
  .set(2, 'b')
  .set(3, 'c')
  .set(2, 'two');  // 对同一个键重复赋值时 后面设置的值将覆盖之前的

map;
// Map(3) {1 => "a", 2 => "two", 3 => "c"}

for (let key of map.keys()) {
  console.log(key);
}
// 1
// 2
// 3

for (let value of map.values()) {
  console.log(value);
}
// a
// two
// c

for (let item of map.entries()) {  // item是数组
  console.log(item[0], item[1]);
}
// 1 "a"
// 2 "two"
// 3 "c"

// Map结构的默认遍历器接口 就是entries方法
for (let [key, value] of map) {
  console.log(key, value);
}
// 1 "a"
// 2 "two"
// 3 "c"

// Map结构转为数组结构 这时候就能配合数组的map filter等方法一起使用
[...map.keys()]
// [1, 2, 3]
[...map.values()]
// ["a", "two", "c"]
[...map.entries()]
// [[1, "a"], [2, "two"], [3, "c"]]
[...map]
// [[1, "a"], [2, "two"], [3, "c"]]

map.forEach(function(value, key, map) {
  console.log("Key: %s, Value: %s", key, value);
});
// Key: 1, Value: a
// Key: 2, Value: two
// Key: 3, Value: c

// forEach方法还可以接受第二个参数 用来绑定到第一个函数参数中的this

map.clear()  // 清空map