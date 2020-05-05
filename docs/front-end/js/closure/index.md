# 一道经典的闭包面试题
## 闭包是什么？

> 能够访问另一个函数作用域的变量的函数。

通俗一点就是闭包就是一个函数，这个函数能够访问其他函数的作用域中的变量。

## 作用

闭包常常用来「间接访问一个变量」。

举个🌰：我现在有一个全局变量，我希望这个变量不能让别人「直接访问」，因此我们要使用局部变量，暴漏一个访问器（函数），让别人「间接访问」。

## 题目
```javascript
for (var i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(new Date, i);
  }, 1000);
}

console.log(new Date, i);
```

输出？

```javascript
Wed Jan 24 2018 10:13:53 GMT+0800 (CST) 5
Wed Jan 24 2018 10:13:54 GMT+0800 (CST) 5
Wed Jan 24 2018 10:13:54 GMT+0800 (CST) 5
Wed Jan 24 2018 10:13:54 GMT+0800 (CST) 5
Wed Jan 24 2018 10:13:54 GMT+0800 (CST) 5
Wed Jan 24 2018 10:13:54 GMT+0800 (CST) 5
```

循环执行过程中，几乎同时设置了5个定时器，这些定时器一般情况下都会在1秒之后触发，而循环完的输出是立即执行的。所以先输出了5，1秒之后输出5个5。
这里考查了js异步代码，变量作用域，定时器工作机制的理解。

如果期望代码输出：5 -> 0,1,2,3,4，该怎么改造？熟悉闭包的同学很快能给出下面的解决方案：

```javascript
for (var i = 0; i < 5; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(new Date, j);
    }, 1000);
  })(i);
}

console.log(new Date, i);
```

这里利用了立即执行函数的表达式来解决闭包，当然还可以利用js中基本类型的参数是`按值传递`的特征来改造：

```javascript
var output = function (i) {
  setTimeout(function() {
    console.log(new Date, i);
  }, 1000);
};

for (var i = 0; i < 5; i++) {
  output(i);
}

console.log(new Date, i);
```

接着还可以衍生出ES6的考察：

```javascript
for (let i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(new Date, i);
  }, 1000);
}

console.log(new Date, i);
```

这里只有个非常细微的变动，即使用 ES6 [块级作用域](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) 中的 `let` 替代了 `var`，但是代码在实际运行时第二段 `console.log(new Date, i)` 会报错，因为最后那个输出使用的 `i` 在其所在的作用域中并不存在，`i` 只存在于循环内部。

下面再进行扩展要求循环和两处 `console` 不变，要求代码执行时立即输出0，之后每隔1秒依次输出1，2，3，4，循环结束后，大概在第5秒输出5

```javascript
var tasks = [];

for (var i = 0; i < 5; i++) {
  ((j) => {
    tasks.push(new Promise((resolve) => {
      setTimeout(() => {
        console.log(new Date, j);
        resolve();
      }, 1000 * j);
    }));
  })(i);
}

Promise.all(tasks).then(() => {
  setTimeout(() => {
    console.log(new Date, i);
  }, 1000);
});
```

既然到 `Promise` 了，那我们是不是应该用下 `ES7` 中的 `async await` 特性来实现一下下呢。

```javascript
const asyncFn = (time) => new Promise((resolve) => {
  setTimeout(resolve, time);
}); // 这个分号必须写，不然下面的立即表达式会融合到setTimeout函数中，如果使用大括号return new promise使之闭合，就不会有这个问题了

(async () => {
  for (var i = 0; i < 5; i++) {
    await asyncFn(1000);
    console.log(new Date, i);
  }

  await asyncFn(1000);
  console.log(new Date, i);
})();
```