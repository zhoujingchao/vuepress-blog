# 数组扁平化
## 扁平化是什么？

**数组的扁平化，就是将一个嵌套多层的 array 转换为只有一层的 array**

举个 🌰 ：有个 `flatten` 函数做扁平化

```js
var arr = [1, [2, [3, 4], 5]];
console.log(flatten(arr)) // [1, 2, 3, 4, 5]
```

## 递归

我们最开始能想到的莫过于循环数组元素，如果还是数组，就递归调用该方法：

```js
var arr = [1, [2, [3, 4], 5]];

function flatten(arr) {
  var result = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flatten(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}
```

## reduce

既然是对数组做处理，最终返回值，可以考虑用 reduce 来简化代码：

```js
function flatten(arr) {
  return arr.reduce((prev, curr) => {
    return prev.concat(Array.isArray(curr) ? flatten(curr) : curr);
  }, [])
}
```

## ES6扩展运算符

用于取出参数对象的所有可遍历属性，拷贝到当前对象中

```js
var arr = [1, [2, [3, 4], 5]];
console.log([].concat(...arr)); // [1, 2, [3, 4], 5]
```

这种方法只可以扁平一层，所以要进行扩展

```js
var arr = [1, [2, [3, 4], 5]];
function flatten(arr) {
  while (arr.some((item) => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}
console.log(flatten(arr)); // [1, 2, 3, 4, 5]
```

## toString

如果数组元素都是数字的话可以尝试：

```js
 [1, [2, [3, 4], 5]].toString() // "1,2,3,4,5"

 var arr = [1, [2, [3, 4], 5]];
 function flatten(arr) {
   return arr.toString().split(',').map(item => +item);
 }
 console.log(flatten(arr)); // [1, 2, 3, 4, 5]
```
