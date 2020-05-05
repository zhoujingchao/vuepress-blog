# 移动端适配方案
## 前言
移动端项目写的比较少，因为之前用过`antd-mobile`，知道里面的高清方案。趁这会儿把适配相关的知识都补一下吧。

## viewport + rem
比较熟悉这个，先从它开始吧。有关`antd-mobile`的更多高清方案描述内容[请点这里](https://github.com/ant-design/ant-design-mobile/wiki/HD)

```js
/**
 * @param {Number} [baseFontSize = 100] - 基础fontSize, 默认100px;
 * @param {Number} [fontscale = 1] - 有的业务希望能放大一定比例的字体;
 */
const win = window;
export default win.flex = (baseFontSize, fontscale) => {
  const _baseFontSize = baseFontSize || 100;
  const _fontscale = fontscale || 1;

  const doc = win.document;
  const ua = navigator.userAgent;
  const matches = ua.match(/Android[\S\s]+AppleWebkit\/(\d{3})/i);
  const UCversion = ua.match(/U3\/((\d+|\.){5,})/i);
  const isUCHd = UCversion && parseInt(UCversion[1].split('.').join(''), 10) >= 80;
  const isIos = navigator.appVersion.match(/(iphone|ipad|ipod)/gi);
  let dpr = win.devicePixelRatio || 1;
  if (!isIos && !(matches && matches[1] > 534) && !isUCHd) {
    // 如果非iOS, 非Android4.3以上, 非UC内核, 就不执行高清, dpr设为1;
    dpr = 1;
  }
  const scale = 1 / dpr;

  let metaEl = doc.querySelector('meta[name="viewport"]');
  if (!metaEl) {
    metaEl = doc.createElement('meta');
    metaEl.setAttribute('name', 'viewport');
    doc.head.appendChild(metaEl);
  }
  metaEl.setAttribute('content', `width=device-width,user-scalable=no,initial-scale=${scale},maximum-scale=${scale},minimum-scale=${scale}`);
  doc.documentElement.style.fontSize = `${_baseFontSize / 2 * dpr * _fontscale}px`;
};
flex(100, 1);
```

原理就是使用`rem`这个相对长度单位，设置基础`fontSize`的大小，获得`dpr`即设备像素比后，进行字体元素的放大和视口[viewport](https://github.com/ant-design/ant-design-mobile/wiki/viewport)的`1 / dpr`倍数缩小，从而达到这样一个高清的效果。

配合`postcss-pxtorem`工具，使得编写业务代码的时候能以`px`为单位。

```js
const pxtorem = require('postcss-pxtorem');
webpackConfig.postcss.push(pxtorem({
  // 根元素设置的大小
  rootValue: 100,
  propWhiteList: [],
}));
```

- 优点：兼容性较好，页面不会因为伸缩发生变形，自适应效果更佳。
- 缺点：
  - 某些场景，大屏情况下希望看见更多的内容，而不是字放大，这类场景不适用。
  - 第三方相关UI库或者图表库，要通过工具或者调整，让准则变的统一。

## 设计稿规则 + rem

`viewport`是固定的`<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">`。

比如以设计稿750为准则。可以参考[手淘flexible方案](https://github.com/amfe/lib-flexible)。

```js
// 设计出稿宽度
const designWidth = 750;
// 在屏幕宽度 750px 的时候，设置根元素字体大小 100px
const baseFontSize = 100;
// 计算当前屏幕的宽度与设计稿比例
const scale = document.documentElement.clientWidth / designWidth;
// 根据屏幕宽度 动态计算根元素的 字体大小
document.documentElement.style.fontSize = scale * baseFontSize + 'px';
```

再配合`px2rem-loader`工具，使得编写业务代码的时候能以`px`为单位。
```js
{
  loader: 'px2rem-loader',
  options: {
    // 根元素设置的大小
    remUnit: 100
  }
}
```

- 优点：兼容性较好。
- 缺点：
  - 不是纯 css 移动适配方案，需要引入 js 脚本，并且必须将改变 font-size 的代码放在 css 样式之前。
  - [1px 像素问题](https://www.jianshu.com/p/31f8907637a6)。

## vm/vh

将视口宽度和视口高度等分为 100 份，并不会随着 viewport 的不同设置而改变。视口是浏览器中用于呈现网页的区域，移动端的视口通常指的是布局视口。

- vw: 1vw 为视口宽度的 1%
- vh: 1vh 为视口高度的 1%
- vmin: 选取vw 和 vh 中的较小值
- vmax: 选取 vw 和 vh 中的较大值

使用 css 预处理器把设计稿尺寸转换为 vw 单位，包括 文本，布局高宽，间距 等，使得这些元素能够随视口大小自适应调整。以750px设计稿为基准，转化的计算表示为：`1vw = 7.5px`。

- 优点：
  - 纯 css 移动端适配方案，不存在脚本依赖问题。
  - 相对于 rem 以根元素<b>字体大小的倍数</b>定义<b>元素大小</b>，逻辑清晰简单，视口单位依赖于视口的尺寸 "1vw ＝ 1/100 viewport width"，根据<b>视口尺寸的百分比</b>来定义<b>元素宽度</b>。
- 缺点：存在一些兼容性问题，Android4.4以下不支持。

## 总结

以上三种就是目前最普遍的适配方式了，至于媒体查询的响应式设计，这里就不展开说明了。总之，对于这些方案都有各自的优缺点，它们往往不都是单独使用的，而是通过几种方案的结合来达到我们的一个合理的预期。

## 参考文章

> https://www.jianshu.com/p/2c33921d5a68
