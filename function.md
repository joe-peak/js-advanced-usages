#### 用 JS 实现一个无限累加的函数 Add(充分利用JS闭包原理)
这个函数要达到的效果如下:
```js
Add(1); // 1
Add(1)(2);  // 3
Add(1)(2)(3)； // 6
Add(1)(2)(3)(4)； // 10
```
```js
const Add = a => {
  let total = a;
  function sum(b) {
    total += b;
    return sum;
  }
  sum.toString = () => total;
  return sum;
};
```
现在我们对上面的函数做进一步的改造，使其达到如下效果
```js
Add(1)(2)(3); // 6
Add(1, 2)(3); // 6
Add(1, 2, 3); // 6
Add(1, 2, 3)( 4, 5, 6); // 21
Add(1, 2)(3, 4)(5, 6); // 21
Add()(1, 2, 3, 4)(5, 6); // 21
Add()(1, 2)()( 3, 4)(5, 6); // 21
```
```js
const reduce = arguments => Array.from(arguments).reduce((accumulated, currentVal) => accumulated + currentVal);
function Add() {
  var a = 0;
  arguments.length && (a = reduce(arguments));
  function sum() {
    arguments.length && (a += reduce(arguments));
    return sum;
  }
  sum.toString = () => a;
  return sum;
}
```

### 数组扁平化
#### 递归实现
```js
const flattenArr = (arr = []) => {
  let flattenList = [];
  arr.forEach(item => {
    if (Array.isArray(item)) {
      flattenList = [...flattenList, ...flattenArr(item)]
    } else {
      flattenList.push(item);
    }
  });
  return flattenList;
};
```
或者结合reduce方法
```js
const flattenArr = (arr = []) => arr.reduce((accumulated, currentItem) => {
    return Array.isArray(currentItem) ? accumulated.concat(flattenArr(currentItem)) : accumulated.concat(currentItem);
  }, []);
```

#### 非递归实现
使用 stack 无限反嵌套多层嵌套数组
```js
const flattenArr = (arr = []) => {
  const res = [];
  const stack = [...arr];
  while(stack.length) {
    const next = stack.pop();
    if (Array.isArray(next)) {
      stack.push(...next);
    } else {
      res.push(next);
    }
  }
  return res.reverse();
}
```
利用数组的concat方法可以做一层扁平化操作的原理
```js
const flattenArr = (arr = []) => {
  let res = [...arr];
  while(res.some(item => Array.isArray(item))) {
    res = [].concat(...res);
  }
  return res;
}
```

借助toString方法(不适应于包含对象类型元素的数组)
```js
const flattenArr = (arr = []) => arr.toString().split(',').map(item => paseInt(item));
```

### 数组乱序
* sort基本乱序(实际上并不是完全随机的乱序)
```js
const shuffle = arr => arr.sort(() => 0.5 - Math.random());
```
* sort和 Math.random()结合
```js
const shuffle = arr => arr.map(val => ({ val, ram: Math.random() })).sort((a, b) => a.ram - b.ram).map(item => item.val);
```
* Fisher–Yates乱序算法
 >核心原理就: 数组从后往前遍历，将当前元素与当前位置之前的随机位置的元素进行交换
```js
const shuffle = arr => {
  let i = arr.length;
  while(i > 1) {
    let radomIndex = Math.floor(Math.random() * i--);
    [arr[radomIndex], arr[i]] = [arr[i], arr[radomIndex]];
    // const temp = arr[radomIndex];
    // arr[radomIndex] = arr[i];
    // arr[i] = temp;
  }
  return arr;
}
```
