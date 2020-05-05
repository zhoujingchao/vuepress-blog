# 编写webpack的自定义插件

## 前言

在复杂的项目工程里，可能会遇到一些构建相关的特殊需求，虽然还没有遇到，但是不妨可以先了解下去，看看这插件的原理。

## 插件构成

- 一个 JavaScript 命名函数。
- 在插件函数的原型上定义一个 apply 方法。
- 指定一个绑定到 webpack 自身的[事件钩子](https://www.webpackjs.com/api/compiler-hooks/)。
- 处理 webpack 内部实例的特定数据。
- 功能完成后调用 webpack 提供的回调。

```js
// 一个 JavaScript 命名函数
class HelloWorldPlugin {
  constructor(options) {
    // 实例属性
    console.log(options)
  }

  // 在插件函数的原型上定义一个 apply 方法
  apply(compiler) {
    console.log('hello world')
    // 指定一个绑定到 webpack 自身的事件钩子
    compiler.plugin('webpacksEventHook', function(compilation, callback) {
      // 处理 webpack 内部实例的特定数据
      console.log('This is an hello world plugin')
      // 功能完成后调用 webpack 提供的回调
      callback()
    })

    // 设置回调来访问 compilation 对象
    compiler.plugin('compilation', function(compilation) {
      // 设置回调来访问 compilation 中的步骤
      compilation.plugin('optimize', function() {
        console.log('Assets are being optimized')
      })
    })
  }
}

module.exports = HelloWorldPlugin
```

```js
// webpack.config.js
const HelloWorldPlugin = require('./HelloWorldPlugin.js');
module.exports = {
  // ...
  plugins: [
    new HelloWorldPlugin({
      desc: 'hello plugin!'
    })
  ]
}
```

## Compiler & Compilation

在插件开发中最重要的两个资源就是`compiler`和`compilation`对象。理解它们的角色是扩展 `webpack`引擎重要的第一步。

- compiler：代表了完整的`webpack`环境配置。这个对象在启动`webpack`时被一次性建立，并配置好所有可操作的设置，包括`options`，`loader`和`plugin`。当在`webpack`环境中应用一个插件时，插件将收到此`compiler`对象的引用。可以使用它来访问`webpack`的主环境。
- compilation：代表了一次资源版本构建。当运行`webpack`开发环境中间件时，每当检测到一个文件变化，就会创建一个新的`compilation`，从而生成一组新的编译资源。一个`compilation`对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。`compilation`对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

关于`compiler`，`compilation`的可用回调，和其它重要的对象的更多信息，可查看[插件](https://www.webpackjs.com/api/plugins/)文档。

## 异步编译插件

有一些编译插件中的操作是异步的，这样就需要额外传入一个`callback`回调函数，并且在插件运行结束时，必须调用这个回调函数。比如下面的例子，打印每个`chunk`中包含的的文件路径。

```js
compiler.plugin('emit', function(compilation, callback) {
  // compilation.chunks 存放所有代码块，是一个数组
  compilation.chunks.forEach(function(chunk) {
    // chunk 代表一个代码块
    // 代码块由多个模块组成，通过 chunk.forEachModule 能读取组成代码块的每个模块
    chunk.forEachModule(function(module) {
      // module 代表一个模块
      // module.fileDependencies 存放当前模块的所有依赖的文件路径，是一个数组
      module.fileDependencies.forEach(function(filepath) {
        console.log(filepath)
      })
    })
  })
  // 这是一个异步事件，要记得调用 callback 通知 Webpack 本次事件监听处理结束。
  // 如果忘记了调用 callback，Webpack 将一直卡在这里而不会往后执行。
  callback()
})
```

## 参考文章

> https://www.webpackjs.com/contribute/writing-a-plugin/#compiler-%E5%92%8C-compilation

> https://www.jianshu.com/p/bbf9a37cf8f1

