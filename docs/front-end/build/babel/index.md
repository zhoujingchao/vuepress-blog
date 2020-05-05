# 初识babel
## babel是什么？
Babel 是 JavaScript 的编译器，是一个工具链，主要用于在当前和较旧的浏览器或环境中将ECMAScript 2015+代码转换为 JavaScript 的向后兼容版本，比如：
- 转换语法
- 目标环境中缺少的 Polyfill 功能（通过 @babel/polyfill 插件）
- 源代码转换（代码模块）
- ...

## 可控制插拔
Babel由插件构建而成。使用现有插件编写自己的转换管道或编写自己的转换管道。通过使用或创建预设轻松使用一组插件。使用 astexplorer.net 即时创建插件，或使用 generator-babel-plugin 生成插件模板。

@babel/core：核心功能模块

@babel/cli：允许终端使用 babel 的工具

@babel/env：预设的环境

@babel/polyfill：包含 core-js 和自定义的 regenerator runtime ，以模拟完整的ES2015 +环境。


## preset
@babel/preset-env：预设的环境

@babel/preset-react：jsx 和 react

@babel/preset-flow：类型注释--流

@babel/preset-typescript：类型注释--TypeScript

...

更多 preset [详细内容](https://babeljs.io/docs/en/presets)。

## plugin
@babel/plugin-transform-arrow-functions：箭头函数转换为ES5兼容的函数模式
...

Babel是一个编译器（源代码=>输出代码）。像许多其他编译器一样，它运行在3个阶段：`解析`，`转换`和`打印`。
这些语法插件仅允许 Babel 解析特定类型的语法（不转换）。
转换插件会自动启用语法插件。因此，如果已经使用了相应的转换插件，则无需指定语法插件。

更多 plugin [详细内容](https://babeljs.io/docs/en/plugins)。

## preset 与 plugin 的区别
如果没有 preset 预设，babel 转化是需要指定用什么插件的，`颗粒度小，效率高`，但是插件需要`逐个`安装(babel 官方拆成了20+个插件)。
为了解决插件依赖的问题，采用了Babel Preset。(Babel Preset视为Babel Plugin的集合， 比如babel-preset-es2015包含所有跟ES6转换有关的插件)

## Plugin 与 Preset 执行顺序
1. 先执行完所有Plugin，再执行Preset
2. 多个Plugin，按照声明次序顺序执行
3. 多个Preset，按照声明次序逆序执行

eg:
```json
{ 
  "plugins": [ "transform-react-jsx", "transform-async-to-generator" ],
  "presets": [ "es2015", "es2016" ] 
}
```

1, `babel-preset-env` 是一个新的 preset，可以根据配置的目标运行环境（environment）自动启用需要的 babel 插件。
babel-preset-es2015(转换为es5)、babel-preset-es2016(转化为es6)、babel-preset-es2017(转化为es7)、babel-preset-latest(转化最新stage4进度)。

2, 插件越来越多，效率变慢，浏览器升级，提出了 `babel-preset-env`, 默认配置的情况下，它跟 `babel-preset-latest` 是等同的，会加载从es2015开始的所有preset。

eg:

```
{ "presets": [ "env" ] } === { "presets": [ “latest" ] }
```

针对node环境：

```json
{ "presets": [ ["env", { "targets": { "node": "8.9.3" } }] ] }
```

针对ie11：

```json
{ "presets": [ ["env", { "targets": { "browsers": "ie 11" } }] ] }
```

针对Edge16：
```json
{ "presets": [ ["env", { "targets": { "browsers": "edge 16" } }] ] } 
```

针对Ie8+，chrome62+：
```json
{ "presets": [ ["env", { "targets": { "browsers": [ "ie >= 8", "chrome >= 62" ] } }] ] }
```

更多详细内容移步[官网](https://babeljs.io/docs/en)
