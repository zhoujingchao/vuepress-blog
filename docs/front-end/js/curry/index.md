# 函数柯里化

## 柯里化是什么？
首先介绍下什么是函数柯里化。《Javascript忍者秘籍》中，对于函数柯里化的定义如下：

>在一个函数中首先填充几个参数(然后再返回一个新函数)的技术称为柯里化(Currying)。

## 场景

实现一个加法函数：

```js
add(1)(2)(3,4)(5,6,7)() // 28
```

首先可以看到这个函数只有当参数为空时，才执行之前所有数值的加法，并且这样的嵌套可以无限进行。那么，返回值在参数不为空的时候必定返回一个函数，该函数还保存了之前的参数，这就需要闭包。

实现原理：

1. 闭包保存args变量，存储之前的参数
2. 新建_add函数，无参数的时候执行算法，否则存储参数到args，然后返回函数自身

```js
function add() {
  // 利用闭包，不断保存arguments
  let args = [].slice.call(arguments);
  let _add = function () {
    // 参数为空执行加法
    if (arguments.length === 0) {
      return args.reduce((a, b) => {
        return a + b;
      })
    } else {
      // 保存参数到args，返回一个函数
      [].push.apply(args, arguments);
      return _add
    }
  }
  return _add
}
```

## 特点

柯里化特点很明显需要一个闭包保存参数，一个函数来进行递归，这种模式是可以通过一个包装函数，对一些基本的函数进行包装之后具有curry的特性。

```js
// 通用的函数柯里化构造方法
function curry(func) {
  // 第一个参数是要被柯里化的函数，需要拿掉
  let args = [].slice.call(arguments, 1);
  // 新建_func函数作为返回
  let _func = function () {
    if (arguments.length === 0) {
      return func.apply(this, args);
    } else {
      [].push.apply(args, arguments);
      return _func;
    }
  }
  return _func;
}

function add() {
  return [].reduce.call(arguments, (a, b) => {
    return a + b;
  });
}

curry(add)(1)(2,3)()
```

## 柯里化的好处

1. 延迟计算
2. 参数复用，当在多次调用同一个函数，并且传递的参数绝大多数是相同的，那么该函数可能是一个很好的柯里化选择
3. 动态创建函数

## 扩展思考

假如我们想实现`add(1)(2)()(3,4)()(5,6,7)()`这样的调用，要求返回的函数的长度是所缺参数的个数，该怎么扩展？

```js
function curry(fn, parma) {
  // 在没有默认值时，fn.length指的是形参的个数，如果有参数有默认值，那么就取第一个具有默认值之前的参数的个数。
  // ((a, b, c) => {}).length       3
  // ((a, b, c = 2) => {}).length   2
  // ((a, b = 2, c) => {}).length   1
  // ((a = 2, b, c) => {}).length   0
  // ((...arguments) => {}).length  0
  const len = fn.length
  const arg = param || []
  return function() {
    const args = arg.concat([...arguments])
    if (args.length < len) {
      return curry(fn, args)
    } else {
      return fn(...args)
    }
  }
}

// 因此你必须对此函数的参数要有明确的判断，不然就会执行报错
function sum(a, b, c) {
  console.log(a + b + c)
}
```
