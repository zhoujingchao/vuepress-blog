# webpack4性能调优

`webpack`毋庸置疑是主流前端工程构建工具，使用好它，将会对我们的开发以及生产提升极大的效率。

下面从以下几个方面来总结下性能相关的使用技巧：

## 优化构建速度

### 处理文件范围
#### resolve
缩小编译范围，减少不必要的编译工作。
```js
resolve: {
  // 告诉 webpack 解析模块时应该搜索的目录
  modules: [path.resolve(__dirname, '../src'), 'node_modules'],
  alias: {
    // 缓存src目录为@符号，避免重复寻址
    '@': path.resolve(__dirname, '../src')
  }
}
```

#### loader
不要让`loader`做太多事情，以`babel-loader`为例，合理利用`test`、`exclude`、`include`缩小搜索范围。
```js
module: {
  rules: [
    {
      test: /\.(js|jsx)$/,
      // 规避了对庞大的 node_modules 文件夹的转译处理
      exclude: /node_modules/,
      // 只解析以下目录
      include: path.join(__dirname, '../src'),
      use: {
        // 开启缓存将转译结果缓存至文件系统，至少可以将 babel-loader 的工作效率提升两倍
        loader: 'babel-loader?cacheDirectory=true'
      }
    }
  ]
}
```

#### noParse
利用`module.noParse`，告诉`webpack`不必解析哪些文件，可以用来排除对非模块化库文件的解析。
```js
module: {
  noParse: /jquery|lodash/
}
```

### externals
排除已使用`<script>`标签引入，而不用打包的代码。
```js
externals: {
  react: 'React'
}
```
```html
<!-- 最好把源码down下来存到自己的cdn地址上 -->
<script src="https://cdn.bootcdn.net/ajax/libs/react/16.8.0/cjs/react.production.min.js"></script>
```

### DllPlugin && DllReferencePlugin
用于减少基础模块编译次数，比如react、react-dom等，只要这些模块版本不升级，就只需被编译一次。并且打包完的体积也能变小。
```js
// webpack.dll.config.js
module.exports = {
  entry: {
    vendor: ['react', 'react-dom']
  },
  output: {
    // 打包后文件输出的位置
    path: path.join(__dirname, '../static/dll/'),
    // vendor.dll.js中暴露出的全局变量名。
    filename: '[name].dll.js',
    // 与webpack.DllPlugin中的`name: '[name]',`保持一致。
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../static/dll/', '[name]-manifest.json'),
      name: '[name]',
      context: __dirname
    })
  ]
};

// webpack.base.config.js
module.exports = {
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('../static/dll/vendor-manifest.json')
    })
  ]
};

// package.json
"scripts": {
  "dll": "webpack --config build/webpack.dll.config.js",
}
```

### HappyPack
使用[happypack](https://www.npmjs.com/package/happypack)开启多进程`loader`加速。
```js
const path = require('path')
const HappyPack = require('happypack')
const os = require('os')
const size = os.cpus().length

module.exports = {
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: ['happypack/loader?id=babel'],
    }],
    plugins: [
      new HappyPack({
        id: 'babel',
        threads: size,
        loaders: ['babel-loader?cacheDirectory']
      })
    ]
  }
}
```

## 优化开发体验
### devServer
模块热替换不刷新整个网页而只重新编译发生变化的模块，并用新模块替换老模块，预览反应更快，等待时间少，同时不刷新页面能保留当前网页的运行状态。
```js
devServer: {
  // 告诉服务从哪提供代码内容(静态文件这么使用)
  contentBase: path.resolve(__dirname, '../dist'),
  // hot模式开启
  hot: true
},
plugins: [
  // 热模块替换开启
  new webpack.HotModuleReplacementPlugin(),
]
```

## 优化输出质量
webpack4后一些默认插件由`optimization`配置替代了：
1. CommonsChunkPlugin 废弃，由 optimization.splitChunks 和 optimization.runtimeChunk 替代，前者拆分代码，后者提取 runtime 代码。原来的 CommonsChunkPlugin 产出模块时，会包含重复的代码，并且无法优化异步模块，minchunks 的配置也较复杂，splitChunks 解决了这个问题；另外，将 optimization.runtimeChunk 设置为true（或{ name: 'manifest' }），便能将入口模块中的 runtime 部分提取出来。
2. NoEmitOnErrorsPlugin 废弃，由 optimization.noEmitOnErrors 替代，生产环境默认开启。
3. NamedModulesPlugin 废弃，由 optimization.namedModules 替代，生产环境默认开启。
4. ModuleConcatenationPlugin 废弃，由 optimization.concatenateModules 替代，生产环境默认开启。
5. optimize.UglifyJsPlugin 废弃，由 optimization.minimize 替代，生产环境默认开启。

其他默认配置如下：
```js
optimization: {
  minimize: process.env.NODE_ENV === 'production' ? true : false, // 开发环境不压缩
  splitChunks: {
    chunks: 'async', // 共有三个值可选：initial(初始模块)、async(按需加载模块)和all(全部模块)
    minSize: 30000, // 模块超过30k自动被抽离成公共模块
    minChunks: 1, // 模块被引用>=1次，便分割
    maxAsyncRequests: 5,  // 异步加载chunk的并发请求数量<=5
    maxInitialRequests: 3, // 一个入口并发加载的chunk数量<=3
    name: true, // 默认由模块名+hash命名，名称相同时多个模块将合并为1个，可以设置为function
    automaticNameDelimiter: '~', // 命名分隔符
    cacheGroups: { // 缓存组，会继承和覆盖splitChunks的配置
      default: { // 模块缓存规则，设置为false，默认缓存组将禁用
        minChunks: 2, // 模块被引用>=2次，拆分至vendors公共模块
        priority: -20, // 优先级
        reuseExistingChunk: true, // 默认使用已有的模块
      },
      vendors: {
        test: /[\\/]node_modules[\\/]/, // 表示默认拆分node_modules中的模块
        priority: -10
      }
    }
  }
}
```

`splitChunks`是拆包优化的重点，如果你的项目中包含`antd`等第三方组件（组件较大），建议单独拆包，如下所示。
```js
splitChunks: {
  // ...
  cacheGroups: {    
    antd: {
      name: 'chunk-antd', // 单独将 antd 拆包
      priority: 15, // 权重需大于其它缓存组
      test: /[\/]node_modules[\/]antd[\/]/
    }
  }
}
```

## 分析工具
### webpack-bundle-analyzer
```js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = merge(webpackBaseConfig, {
  // ...
  plugins: [
    new BundleAnalyzerPlugin()
  ]
})
```

编译后的文件结果输出，可以清晰的看见每个包和对应的大小，再进一步做分析优化提取。

## 参考文章

> https://juejin.im/post/5b652b036fb9a04fa01d616b#heading-21
