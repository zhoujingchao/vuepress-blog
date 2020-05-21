# 深入理解promise
## 前言

探索 Promise 设计原理，帮助我们深入理解及使用。

```javascript
// example 1：这是一种最普遍的获取用户信息的请求逻辑
function getUserInfo() {
  return new Promise(function(resolve) {
    // 异步请求
    http.get(url, function(res) {
      resolve(res)
    })
  })
}

getUserInfo().then(function(res) {
  // handle
})
```

`getUserInfo`方法返回一个`promise`，可以通过它的`then`方法注册在`promise`异步操作成功时执行的回调。这种执行方式，使得异步调用变得顺手.

## 原理分析

那么类似这种功能的`Promise`是怎么实现的呢？首先看一下最基础的雏形方法吧。

### 极简的promise雏形

```javascript
function Promise(fn) {
  var value = null,
    callbacks = []; // 存放回调注册的函数

  this.then = function(onFulfilled) {
    callbacks.push(onFulfilled)
  }

  function resolve(value) {
    callbacks.forEach(function(callback) {
      callback(value)
    })
  }

  fn(resolve)
}
```

上面的代码逻辑大致这样:

  1. 调用`then`方法，将想要在`Promise`异步操作成功时执行回调放入`callbacks`队列，可以理解为注册回调函数，延伸下去向观察者模式思考。
  1. 创建`Promise`实例时传入的函数会被赋予一个函数类型的参数，即`resolve`，他接受一个参数value，代表异步操作返回的结果，当异步操作执行成功 后，会调用`resolve`方法，这时候其实真正执行的操作是将`callbacks`队列中的回调一一执行。

结合中`example 1`的代码来看，首先`new Promise`时，传给`promise`的函数发送异步请求，接着调用`promise`对象的`then`属性，注册请求成功的回调函数，然后当异步请求发送成功时，调用`resolve(res)`方法, 该方法执行`then`方法注册的回调数组。

那么问题来了有同学会问，`then`方法应该能够链式调用，但是上面的最基础简单的版本显然无法支持链式调用啊。so想让`then`方法支持链式调用，接着往下看

```javascript
this.then = function(onFulfilled) {
  callbacks.push(onFulfilled)
  return this
}
```

只要这样就可以实现链式调用了

```javascript
// example 2
getUserInfo().then(function(res) {
  // handle
}).then(function(res) {
  // handle
})
```

### 加入延时机制

细心的同学应该发现，上述代码还存在一个问题：如果在`then`方法注册回调之前，`resolve`函数就执行了，怎么办？比如`promise`内部的函数是同步函数：

```javascript
// example 3
function getUserId() {
  return new Promise(function(resolve) {
    resolve('gg')
  })
}
getUserInfo().then(function(res) {
  // handle
})
```

这显然是不允许的，Promises/A+规范**明确要求回调需要通过异步方式**执行，用以保证一致可靠的执行顺序。因此我们要加入一些处理，保证在`resolve`执行之前，`then`方法已经注册完所有的回调。我们可以这样改造下`resolve`函数:

```javascript
function resolve(value) {
  setTimeout(function() {
    callbacks.forEach(function(callback) {
      callback(value)
    });
  }, 0)
}
```

上面的代码的思路大家都明白，就是通过`setTimeout`机制，将`resolve`中执行回调的逻辑放置到JS任务队列末尾，以保证在`resolve`执行时，`then`方法的回调函数已经注册完成.
那么问题又来了某些同学又发现一个问题，可以细想一下：如果`Promise`异步操作已经成功，这时，在异步操作成功之前注册的回调都会执行，但是在`Promise`异步操作成功这之后调用的then注册的回调就再也不会执行了，这显然不是我们想要的。

### 加入状态

恩，为了解决上一节抛出的问题，我们必须加入状态机制，也就是大家熟知的`pending`、`fulfilled`、`rejected`。

Promises/A+规范中的2.1Promise States中明确规定了，`pending`可以转化为`fulfilled`或`rejected`并且只能转化一次，也就是说如果`pending`转化到`fulfilled`状态，那么就不能再转化到`rejected`。并且`fulfilled`和`rejected`状态只能由`pending`转化而来，两者之间不能互相转换。
改进后的代码如下：

```javascript
function Promise(fn) {
  var state = 'pendding',
  value = null,
  callbacks = [];

  this.then = function(onFulfilled) {
    if (state === 'pendding') {
      callbacks.push(onFulfilled)
      return this
    }
    onFulfilled(value)
    return
  }

  function resolve(newValue) {
    value = newValue, state = 'fulfilled';
    setTimeout(function() {
      callbacks.forEach(function(callback) {
        callback(value)
      })
    }, 0)
  }

  fn(resolve)
}
```

上面的代码的思路是这样的：`resolve`执行时，会将状态设置为`fulfilled`，在此之后调用`then`添加的新回调，都会立即执行。
这里没有任何地方将`state`设为`rejected`，为了让大家聚焦在核心代码上，这个问题后面会有一小节专门加入。

### 链式Promise

那么这里问题又来了某些同学还会问，如果用户在`then`函数里面注册的仍然是一个`Promise`，该如何解决？比如下面的`example 4`：

```javascript
getUserInfo()
  .then(getUserDad)
  .then(function(res) {
    // handle
  })

function getUserDad(userInfoObj) {
  return new Promise(function(resolve) {
    http.get(url + userInfoObj.id, function(res) {
      resolve(res)
    })
  })
}
```

这种场景相信用过`promise`的人都知道会有很多，那么类似这种就是所谓的链式`Promise`。

链式`Promise`是指在当前`promise`达到`fulfilled`状态后，即开始进行下一个`promise`（后邻promise）。那么我们如何衔接当前promise和后邻promise呢？接着我那会下看：
只要在`then`方法里面`return`一个`promise`就好啦。Promises/A+规范中的2.2.7就是这么说哒😊

下面来看看这段暗藏玄机的`then`方法和`resolve`方法改造代码

```javascript
function Promise(fn) {
  var state = 'pendding',
  value = null,
  callbacks = [];

  this.then = function(onFulfilled) {
    return new Promise(function(resolve) {
      handle({
        onFulfilled: onFulfilled || null,
        resolve: resolve
      })
    })
  }

  function handle(callback) {
    if (state === 'pendding') {
      callbacks.push(callback)
      return this
    }

    // nothing in then
    if(!callback.onFulfilled) {
      callback.resolve(value)
      return
    }

    var ret = callback.onFulfilled(value)
    callback.resolve(ret)
  }

  function resolve(newValue) {
    if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
      var then = newValue.then
      if (typeof then === 'function') {
        then.call(newValue, resolve)
        return
      }
    }
    value = newValue, state = 'fulfilled';
    setTimeout(function() {
      callbacks.forEach(function(callback) {
        handle(callback)
      })
    }, 0)
  }

  fn(resolve)
}
```

下面结合`example 4`的代码，分析下上面的代码逻辑：

  1. `example 4`的`then`方法中，创建并返回了新的Promise实例，这是串行`Promise`的基础，并且支持链式调用。
  1. `handle`方法是`promise`内部的方法。`then`方法传入的形参`onFulfilled`以及创建新`Promise`实例时传入的`resolve`均被`push`到当前`promise`的`callbacks`队列中，这是衔接当前promise和后邻promise的关键所在（这里一定要好好的分析下handle的作用）。
  1. `getUserInfo`生成的`promise`异步操作成功，执行其内部方法`resolve`，传入的参数正是异步操作的结果即用户信息的对象userInfoObj
  1. 调用`handle`方法处理`callbacks`队列中的回调：`getUserDad`方法，生成新的`promise`（getUserDad promise）
  1. 执行之前由`getUserInfo promise`的`then`方法生成的新`promise`(称为bridge promise)的`resolve`方法，传入参数为`getUserDad promise`。这种情况下，会将该`resolve`方法传入`getUserDad promise`的`then`方法中，并直接返回。
  1. `getUserDad promise`异步操作成功时，执行其`callbacks`中的回调：`getUserInfo bridge promise`中的`resolve`方法
  1. 最后执行`getUserDad bridge promise`的后邻`promise`的`callbacks`中的回调。

### 失败处理

在异步操作失败时，标记其状态为`rejected`，并执行注册的失败回调:

```javascript
// example 5
function getUserInfo() {
  return new Promise(function(resolve, reject) {
    http.get(url, function(err, res) {
      if (err) {
        reject(err)
      }
      resolve(res)
    })
  })
}

getUserInfo().then(function(res) {
  // handle res
}, function(err) {
  console.log(err)
})
```

有了之前处理`fulfilled`状态的经验，支持错误处理变得很容易,只需要在注册回调、处理状态变更上都要加入新的逻辑：

```javascript
function Promise(fn) {
  var state = 'pendding',
  value = null,
  callbacks = [];

  this.then = function(onFulfilled, onRejected) {
    return new Promise(function(resolve, reject) {
      handle({
        onFulfilled: onFulfilled || null,
        resolve: resolve,
        onRejected: onRejected || null,
        reject: reject
      })
    })
  }

  function handle(callback) {
    if (state === 'pendding') {
      callbacks.push(callback)
      return this
    }

    var ret,
      cb = state === 'fulfilled' ? callback.onFulfilled : callback.onRejected;

    if (cb === null) {
      cb = state === 'fulfilled' ? callback.resolve : callback.reject
      cb(value)
      return
    }
    ret = cb(value)
    callback.resolve(ret)
  }

  function resolve(newValue) {
    if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
      var then = newValue.then
      if (typeof then === 'function') {
        then.call(newValue, resolve, reject)
        return
      }
    }
    value = newValue, state = 'fulfilled';
    execute()
  }

  function reject(reason) {
    value = reason, state = 'rejected';
    execute()
  }

  execute() {
    setTimeout(function() {
      callbacks.forEach(function(callback) {
        handle(callback)
      })
    }, 0)
  }

  fn(resolve, reject)
}
```

上面的代码增加了新的`reject`方法，供异步操作失败时调用，同时抽出了`resolve`和`reject`共用的部分，形成`execute`方法。

错误冒泡是上述代码已经支持，且非常实用的一个特性。在`handle`中发现没有指定异步操作失败的回调时，会直接将`bridge promise`(then函数返回的promise，后同)设为`rejected`状态，如此达成执行后续失败回调的效果。这有利于简化串行`Promise`的失败处理成本，因为一组异步操作往往会对应一个实际功能，失败处理方法通常是一致的：

```javascript
getUserInfo()
  .then(getUserDad)
  .then(function(res) {
    // handle res
  } function(err) {
    // there is something wrong in getUserInfo or getUserDad
    console.log(err)
  })
```

### 异常处理

细心的同学又会想到：如果在执行成功回调、失败回调时代码出错怎么办？对于这类异常，可以使用`try-catch`捕获错误，并将`bridge promise`设为`rejected`状态。`handle`方法改造如下：

```javascript
function handle(callback) {
  if (state === 'pendding') {
    callbacks.push(callback)
    return this
  }

  var ret,
    cb = state === 'fulfilled' ? callback.onFulfilled : callback.onRejected;

  if (cb === null) {
    cb = state === 'fulfilled' ? callback.resolve : callback.reject
    cb(value)
    return
  }

  try {
    ret = cb(value)
    callback.resolve(ret)
  } catch(e) {
    callback.reject(e)
  }
}
```

如果在异步操作中，多次执行`resolve`或者`reject`会重复处理后续回调，可以通过内置一个标志位解决。

## 总结

这里一定要注意的点是：`promise`里面的`then`函数仅仅是注册了后续需要执行的代码，真正的执行是在`resolve`方法里面执行的，理清了这层，再来分析源码会省力的多。

现在回顾下`Promise`的实现过程，其主要使用了设计模式中的观察者模式：

  1. 通过`Promise.prototype.then`和`Promise.prototype.catch`方法将观察者方法注册到被观察者`Promise`对象中，同时返回一个新的Promise对象，以便可以链式调用。
  1. 被观察者管理内部`pending`、`fulfilled`和`rejected`的状态转变，同时通过构造函数中传递的`resolve`和`reject`方法以主动触发状态转变和通知观察者。
