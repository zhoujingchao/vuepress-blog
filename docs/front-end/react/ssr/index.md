# React服务端渲染
## 前言

最近想了解下服务端渲染，就从熟悉的 react 下手进行 [demo](https://github.com/zhoujingchao/koa-react-ssr.git)

## 什么是服务端渲染

服务端渲染是指页面的渲染和生成由服务器来完成，并将渲染好的页面返回客户端。而客户端渲染是页面的生成和数据的渲染过程是在客户端（浏览器或APP）完成。

## 为什么要使用服务端渲染

1. SEO友好
2. 加快首屏渲染，减少白屏时间

### SEO又是什么

现在的网站大多都是SPA，页面数据都通过ajax来的，[搜索引擎的spider](https://zh.wikipedia.org/wiki/%E7%B6%B2%E8%B7%AF%E7%88%AC%E8%9F%B2)来收录网页的时候，发现全是空的话，那么你的网站收录的权重跟效果肯定是不好的

## 核心思想

1. 起一个 node 服务
2. 把 react 根组件 renderToString 渲染成字符串一起返回前端
3. 前端再重新 render 一次

### 为什么需要前端再 render 一次

事件是在浏览器渲染页面的时候进行挂载的，服务器返回的内容HTML字符串，不在浏览器里再渲染一次的话，事件是不会挂载的

以下示例代码从 [demo](https://github.com/zhoujingchao/koa-react-ssr.git) 里取出，如需查看完整请移步 [demo](https://github.com/zhoujingchao/koa-react-ssr.git)

## 示例代码

babel 的入口，index.js代码如下

```js
require('babel-core/register')();
require('babel-polyfill');
require('./app');
```

项目入口 app.js代码如下

```js
import Koa from 'koa';
import React from 'react';
import { renderToString } from 'react-dom/server';
import views from 'koa-views';   // 配置模板的中间件
import Static from 'koa-static'; // 处理静态文件的中间件
import ip from 'ip';
import path from 'path';

import webpack from 'webpack';
import webpackConfig from './webpack.config';
import koaWebpack from 'koa-webpack';

import Home from './client/components/home';

const app = new Koa();
const port = 3000;
const host = ip.address();

// dev 模式热加载
app.use(koaWebpack({
  compiler: webpack(webpackConfig),
  hot: {
    log: () => {}
  },
  dev: {
    noInfo: true,
    serverSideRender: true,
    hot: true,
    logLevel: 'error',
    stats: {
      colors : true
    },
    publicPath: ''
  },
}));

// dist文件夹设置为静态路径
app.use(Static(__dirname + '/dist'));

// 使用模板引擎来渲染
app.use(views(path.resolve(__dirname, './views'), 
  { map: { html: 'ejs' } }
));

app.use(async (ctx) => {
  let str = renderToString(<Home />);
  await ctx.render('index', {
    root: str
  });
});

app.listen(port, host, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info('==> 🌎  Listening on port %s. Open up http://%s:%s/ in your browser.', port, host, port);
  }
});
```

Home 组件代码如下：

```js
import React, { Component } from 'react';

class Home extends Component {
  render() {
    return (
      <div onClick={() => window.alert('home')}>home!</div>
    )
  }
}

export default Home;

```

我们的渲染模板，新建一个 views 文件夹里面新建一个 index.html：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>SSR</title>
</head>
<body>
  <div id="root"><%- root %></div>
  <!-- 构建出来的代码-->
  <script src="/main.js"></script>
</body>
</html>
```

webpack 配置

```js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: [
    'react-hot-loader/patch',
    'webpack/hot/only-dev-server',
    `${__dirname}/client/index.js`
  ],
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loaders: ['babel-loader'],
    },
    {
      test: /\.css$/,
      include: [path.join(__dirname, 'client')],
      use: ['style-loader', 'css-loader', 'postcss-loader']
    }]
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin(), // 启用 HMR
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  devServer: {
    hot: true,
    inline: true,
    host: 'localhost',
    port: 3333,
    contentBase: path.resolve(__dirname, 'dist')
  }
}
```

这里面支持 react-router 配置是和客户端有些差别的，这里就不拿出来多讲了，详情请查看 [demo](https://github.com/zhoujingchao/koa-react-ssr.git)，热更新和实时构建也已配置好，后面可以补上 redux 或者 mobx 的支持，使这个工具链更完善一点。
