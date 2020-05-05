# nodejs的错误处理
> 原文链接：https://zhuanlan.zhihu.com/p/100244941

## captureStackTrace
Node.js 中，`Error.captureStackTrace()` 方法是 v8 引擎暴露出来的，处理错误堆栈信息的 API。
> Error.captureStackTrace(targetObject[, constructorOpt]) 在 targetObject 中添加一个 .stack 属性。对该属性进行访问时，将以字符串的形式返回 Error.captureStackTrace() 语句被调用时的代码位置信息(即：调用栈历史)。

```js
try {
  setTimeout(() => {
    throw new Error('some error')
  }, 1000)
} catch(e) {
  console.log('some error...')
}
```
错误并不能被捕获住。这个跟 `Node.js 的事件循环机制`有关，因为异步任务是通过事件队列来实现的，每次从事件队列中取出一个函数来执行时，实际上这个函数是在调用栈的最顶层执行的，如果它抛出了一个异常，也是无法沿着调用栈回溯到这个异步任务的创建者的。

## 常见异步场景
1. Node.js style callback
2. Promise
3. EventEmitter

`Promise`链上的错误都会在`catch`方法上捕获住。对于没有`catch`的`Promise`异常，会一直冒泡到顶层，在`process.unhandledRejection`事件上被捕获住。
实现`unhandledRejection`(V8 提供了接口（`SetPromiseRejectCallback`），当有未捕获的`Promise`错误时，会触发回调。Node.js 会在这个回调中记录下这些错误的`Promise`的信息；
Node.js 会在每次`Tick`执行完后检查是否有未捕获的错误`Promise`，如果有，则触发 `unhandledRejection`事件。)

还有一类是 `EventEmitter` 对象上的错误。它们会被分发到`error`事件上进行处理，比如`Stream`等。我们需要去为每一个流去监听`error`事件，否则会冒泡到`process.uncaughtException`事件上去。

异步场景中，还有个问题就是，会丢失异步回调前的错误堆栈。原因还是上文提到的 Node.js 事件循环机制。
然而在 Node.js 中，异步调用场景还挺多的，有什么办法可以将多个异步调用给串起来，获取到完整的调用链信息呢？答案是有的。Node.js `v8+` 上提供了 `async_hooks` 模块，用来完善异步场景的监控。
