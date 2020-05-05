# 设计模式-构造函数

##  基本用法

js没有类的概念，通常认为构造函数是用来实现实例的，通过 new 关键字来调用构造函数创建一个新对象。构造函数内部的 this 引用的是新创建的对象。

```js
function Player(name, age) {
  this.name = name
  this.age = age
  this.output = function () {
    return this.name + ' is ' + this.age + ' years old'
  }
}

var Irving = new Player('Irving', 18)
var Kobe = new Player('Kobe', 18)

console.log(Irving.output())
console.log(Kobe.output())
```

这是个灰常简单的构造函数，所以问题一下就暴漏了。首先继承就麻烦了，其次 output() 每次创建对象的时候都重新定义了，如果有大批量实例的话，内存开销就很大，所以最好的方法是让 Player 实例共享这个 output() 方法

## 构造函数与原型

```js
function Player(name, age) {
  // 强制使用new
  if (!(this instanceof Player)) {
    return new Player(name, age)
  }
  this.name = name
  this.age = age
}

Player.prototype.output = function () {
    return this.name + ' is ' + this.age + ' years old'
  }

var Irving = new Player('Irving', 18)
var Kobe = new Player('Kobe', 18)

console.log(Irving.output())
console.log(Kobe.output())
```

## ES6

```js
// 类的声明
class Player {
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  output() {
    return this.name + ' is ' + this.age + ' years old'
  }
}

// 类实例化
let Irving = new Player('Irving', 18)
Irving.output()
```