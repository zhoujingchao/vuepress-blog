# 模拟实现call, apply, bind

## 它们是干嘛的？
这三兄弟都是为了改变函数运行时上下文(this指向)而存在的。

那么到底是个怎么回事呢，我们直接看下面得例子，来体验下：

```js
const name = 'Kobe', age = 18;
const player = {
  name: 'Irving',
  age: this.age,
  func: function() {
    console.log(`${this.name} is ${this.age} years old`)
  }
}
function getName() {
  console.log(this.name)
}

player.age // this 指向 player -> 18
player.func() // this 指向 player -> Irving is 18 years old
getName() // this 指向 window -> Kobe
```

下面我们来看看三兄弟的用法

```js
const name = 'Kobe', age = 18;
const player = {
  name: 'Irving',
  age: this.age || 16,
  func: function() {
    console.log(`${this.name} is ${this.age} years old`)
  }
}
const otherPlayer = {
  name: 'Wade',
  age: 17
}

player.func.call(otherPlayer) // Wade is 17 years old
player.func.apply(otherPlayer) // Wade is 17 years old
player.func.bind(otherPlayer)() // Wade is 17 years old
```

这里我们可以看出，一个参数的情况下，`call`和`apply`返回了相同的结果，bind呢则是返回了一个新的函数，你要执行它在返回结果。

接着看下多个参数的情况：

```js
const name = 'Kobe', age = 18;
const player = {
  name: 'Irving',
  age: this.age || 16,
  func: function(from, team) {
    console.log(`${this.name} is ${this.age} years old, from ${from}, play in the ${team}`)
  }
}
const otherPlayer = {
  name: 'Wade',
  age: 17
}

player.func.call(otherPlayer, 'Chicago', 'Heat') // Wade is 17 years old, from Chicago, play in the Heat
player.func.apply(otherPlayer, ['Chicago', 'Heat']) // Wade is 17 years old, from Chicago, play in the Heat
player.func.bind(otherPlayer, 'Chicago', 'Heat')() // Wade is 17 years old, from Chicago, play in the Heat
player.func.bind(otherPlayer, ['Chicago', 'Heat'])() // Wade is 17 years old, from Chicago,Heat, play in undefined
```

我们又发现 `call` 是一个一个参数来接收的，`apply` 则是接受了一个列表，`bind` 则是除了返回函数以外，其他参数和 `call` 一样。所以看自己的应用场景来取择即可，你想要着重展现参数的意义就可以选 `call`，当然参数不仅仅是例子上的 `string` 类型，其他均可以。

看到这里是不是对这三兄弟是咋玩的有了一定的了解啦，接下去我们就去自己模拟实现它们，从而对他们加深理解。

## 模拟实现
### call

```js
Function.prototype._call = function(context = window) {
  // 假如没传上下文 context 默认取 window
  if (this === Function.prototype) return; // 用于防止 Function.prototype._call() 直接调用

  // 新建一个不会重名的属性，防止重写
  const attr = Symbol()
  context[attr] = this
  // 把类数组变为数组，过滤 window 参数
  const args = [...arguments].slice(1)
  const result = context[attr](args)
  delete context[attr] 
  return result
}
```

### apply

```js
Function.prototype._apply = function(context = window) {
  if (this === Function.prototype) return;
  const attr = Symbol()
  context[attr] = this
  // 取出参数列表
  const args = [...arguments][1]
  let result;
  if (!args) {
    result = context[attr]()
  } else {
    result = context[attr](...args)
  }
  delete context[attr] 
  return result
}
```

### bind

```js
Function.prototype._bind = function(context = window) {
  const self = this
  const args = [...arguments].slice(1)
  return function() {
    const newArg = [...arguments]
    return self.apply(context, args.concat(newArg))
  }
}
```

这下是不是完全理解这三兄弟了呢，他们就是为了改变函数运行时上下文而来的，根据实际情况来选择使用即可。
