# 模块化的理解

## 什么是模块化
- 就是复杂的程序，按照一定的规则（规范）封装成一系列的块（文件），并组合在一起。
- 每个块内部数据和实现都是私有的，向外暴漏接口和方法与外部其他模块通信。

## 模块化的发展过程

### 全局function模式
```js
function Event() {
  // ...
}
```
- 方式：将不同的功能封装成不同的全局函数。
- 问题：污染全局命名空间, 容易引起命名冲突或数据不安全，而且模块成员之间看不出直接关系。

### namespace模式
```js
let Event = {
  list: [],
  listen() {},
  trigger() {},
  remove() {}
}
```
- 作用: 减少了全局变量，解决命名冲突。
- 问题: 数据不安全(暴露所有模块成员，内部状态可以被外部改写)。

### IIFE模式
```html
<script type="text/javascript" src="event.js"></script>
<script type="text/javascript">
  Event.listen('changeNum', num => num++)
  Event.trigger('changeNum', 1)
  Event.remove('changeNum')
  console.log(Event.list) // undefined 不能访问模块内部数据
</script>
```

```js
// event.js文件
(function(window) {
  let list = []
  // 监听函数
  function listen() {
    console.log(`listen() ${list}`)
  }
  // 触发函数
  function trigger() {
    console.log(`trigger() ${list}`)
  }
  // 移除监听函数
  function remove() {
    console.log('remove()')
  }
  //暴露行为
  window.Event = { listen, trigger, remove }
})(window)
```

### IIFE模式增强

```js
(function(window, $) {
  let list = []
  // 监听函数
  function listen() {
    console.log(`listen() ${list}`)
  }
  // 触发函数
  function trigger() {
    console.log(`trigger() ${list}`)
  }
  // 移除监听函数
  function remove() {
    console.log('remove()')
  }
  // 其他函数
  function other() {
    // jQuery handle
  }
  //暴露行为
  window.Event = { listen, trigger, remove }
})(window, jQuery)
```

```html
<!-- 引入的js必须有一定顺序 -->
<script type="text/javascript" src="jquery-1.10.1.js"></script>
<script type="text/javascript" src="event.js"></script>
<script type="text/javascript">
  Event.listen('changeNum', num => num++)
  Event.trigger('changeNum', 1)
  Event.remove('changeNum')
  console.log(Event.list) // undefined 不能访问模块内部数据
</script>
```

## 模块化的好处

- 避免命名冲突(减少命名空间污染)
- 更好的分离, 按需加载
- 更高复用性
- 高可维护性

## 存在的问题

- 请求过多：依赖多个模块，那样就会发送多个请求，导致请求过多。
- 依赖模糊：我们不知道他们的具体依赖关系是什么，也就是说很容易因为不了解他们之间的依赖关系导致加载先后顺序出错。
- 难以维护：以上两种原因就导致了很难维护，很可能出现牵一发而动全身的情况导致项目出现严重的问题。

为了解决这些问题，所以就有了下面这些优秀的`Commonjs`，`AMD`，`CMD`，`ES6`规范。

## 模块化规范

### Commonjs

#### 概述
最典型的就是我们的 nodejs 应用由模块组成，采用 CommonJS 模块规范，每个文件就是一个模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。在服务器端，模块的加载是运行时同步加载的；在浏览器端，模块需要提前编译打包处理。

#### 特点
- 所有代码都运行在模块作用域，不会污染全局作用域。
- 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。
- 模块加载的顺序，按照其在代码中出现的顺序。

#### 基本语法
1. 暴露模块：`module.exports = value`或`exports.xxx = value`。
2. 引入模块：`require(xxx)`,如果是第三方模块，xxx为模块名；如果是自定义模块，xxx为模块文件路径

#### 模块的加载机制
CommonJS模块的加载机制是，`输入的是被输出的值的拷贝`。也就是说，`一旦输出一个原始类型的值，模块内部的变化就影响不到这个值`。除非写成一个函数，才能得到变动后的值。

### AMD

#### 概述 & 特点
`CommonJS规范加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作`。AMD规范则是`非同步加载模块，允许指定回调函数`。由于Node.js主要用于服务器编程，模块文件一般都已经存在于本地硬盘，所以加载起来比较快，不用考虑非同步加载的方式，所以CommonJS规范比较适用。但是，如果是浏览器环境，要从服务器端加载模块，这时就必须采用非同步模式，因此浏览器端一般采用AMD规范。此外AMD规范比CommonJS规范在浏览器端实现要来着早。

#### 基本语法
```js
// 定义没有依赖的模块
define(function(){
   return module1
})
// 定义有依赖的模块
define(['module1', 'module2'], function(m1, m2){
   return module3
})
// 引入使用模块
require(['module1', 'module2'], function(m1, m2){
   // 使用 module1/module2 处理
})
```

### CMD
#### 概述 & 特点
`CMD规范专门用于浏览器端，模块的加载是异步的，模块使用时才会加载执行`。CMD规范整合了CommonJS和AMD规范的特点。在 Sea.js 中，所有 JavaScript 模块都遵循CMD模块定义规范。

#### 基本语法
```js
// 定义没有依赖的模块
define(function(require, exports, module){
  exports.xxx = value
  module.exports = value
})
// 定义有依赖的模块
define(function(require, exports, module){
  // 引入依赖模块(同步)
  var module2 = require('./module2')
  // 引入依赖模块(异步)
    require.async('./module3', function (m3) {})
  // 暴露模块
  exports.xxx = value
})
// 引入使用模块
define(function (require) {
  var m1 = require('./module1')
  var m4 = require('./module4')
  m1.show()
  m4.show()
})
```

### ES6模块化
#### 概述 & 特点
ES6 模块的设计思想是`尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量`。`CommonJS 和 AMD 模块，都只能在运行时确定这些东西`。比如，CommonJS 模块就是对象，输入时必须查找对象属性。

#### 基本语法
export命令用于规定模块的对外接口，import命令用于输入其他模块提供的功能。
```js
// 定义模块 math.js
var basicNum = 0;
var add = function (a, b) {
    return a + b
};
export { basicNum, add }

// 引用模块
import { basicNum, add } from './math'
function test(ele) {
  add(99 + basicNum)
}
```

### ES6与Commonjs的差异

- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

上面 commonjs 的加载机制中有提到一旦输出一个原始类型的值，模块内部的变化就影响不到这个值。但对于 es6 来说，它是动态引用的，并且不会缓存值，模块里面的变量绑定其所在的模块，它的值是会变化的。

## 原文链接

> https://juejin.im/post/5c17ad756fb9a049ff4e0a62
