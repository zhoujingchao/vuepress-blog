# puppeteer实战系列-截图的诱惑

前面一篇文章讲了 puppeteer 的前期开展工作，这篇我们来讲下截图操作

官方入门 demo

```js
const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://www.baidu.com");
  await page.screenshot({ path: "baidu.png" });
  await browser.close();
})();
```

## 业务场景

### 截全屏图

```js
const puppeteer = require("puppeteer");
(async () => {
  const options = {
    headless: true,
    timeout: 0,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    ignoreHTTPSErrors: true
  };
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.goto("http://www.baidu.com", {
    waitUntil: ["networkidle2"], // https://pptr.dev/#?product=Puppeteer&version=v1.18.1&show=api-pagegotourl-options
    timeout: 20 * 1000
  });

  // 如果 waitUntil 为'networkidle2'的方式还是会出现不能完全加载异步的内容
  // 可以手动添加滑动操作以及延时等待去处理
  await page.evaluate(() => {
    return Promise.resolve(window.scrollTo(0, window.innerHeight));
  });

  // await page.waitFor(2000);

  await page.screenshot({
    path: "baidu.png",
    fullPage: true
  });
  await browser.close();
})();
```

### 元素精确截图或者指定范围尺寸截图

```js
const puppeteer = require("puppeteer");
(async () => {
  async function getElementBounding(page, element) {
    const pos = await page.$eval(element, e => {
      // 相当于在evaluate的pageFunction内执行
      // document.querySelector(element).getBoundingClientRect()
      // https://pptr.dev/#?product=Puppeteer&version=v1.18.1&show=api-pageevalselector-pagefunction-args-1
      const { left, top, width, height } = e.getBoundingClientRect();
      return { left, top, width, height };
    });
    return pos;
  }

  const options = {
    headless: true,
    timeout: 0,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    ignoreHTTPSErrors: true
  };
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.goto("http://www.baidu.com", {
    waitUntil: ["networkidle2"],
    timeout: 20 * 1000
  });
  await page.evaluate(() => {
    return Promise.resolve(window.scrollTo(0, window.innerHeight));
  });
  const pos = await getElementBounding(page, ".head_wrapper");
  await page.screenshot({
    path: "baidu.png",
    // 根据业务应用场景灵活运用
    clip: {
      x: pos.left,
      y: pos.top,
      width: pos.width,
      height: pos.height
    }
  });
  await browser.close();
})();
```

## 性能优化

业务复杂且量大的情况下，一般都是几百个或者上千个页面需要处理。
我们通常都是 `Promise.all()` 并行处理异步，进行批量截图，但标签页一多，就会导致机器性能急剧下降。

于是我们可以把打开浏览器的个数和每个浏览器的标签页数都抽出来，可灵活调整，便于不同配置的机器在执行任务的时候方便调整，避免机器崩掉。

```js
/**
   * startBrowser 启动浏览器
   * @param {array} urlList 数据源
   * @param {number} browserNum 打开的浏览器个数
   * @param {number} tabNum 每个浏览器打开的标签页
   * @return {array}
   */

  async startBrowser(urlList, browserNum, tabNum) {
    // 单个浏览器执行流程
    const action = async (startPosition, length) => {
      const options = {
        headless: true,
        timeout: 0,
        args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
        ignoreHTTPSErrors: true
      };

      const platform = os.platform().toLocaleLowerCase();

      if (platform === 'linux') {
        // 环境上chromium对应的安装路径
        options.executablePath = path.join(__dirname, '../../../chrome-linux/chrome');
      }

      const browser = await puppeteer.launch(options);

      // 处理数据源 urlList
      const promises = [];
      for (let i = 0; i < length; i++) {
        const groupIndex = parseInt(i / tabNum, 10);
        promises[groupIndex] = promises[groupIndex] ? promises[groupIndex] : [];
        promises[parseInt(i / tabNum, 10)].push(urlList[i + startPosition]);
      }

      const pagesGroups = [];
      for (let i = 0; i < promises.length; i++) {
        pagesGroups.push(
          await Promise.all(
            promises[i].map(async option => {
              // 这里就不拿出来说了，单个标签页的执行截图逻辑，根据各自业务场景处理后，并返回数据即可
              return await this.startPage(browser, option);
            })
          )
        );
      }

      // 处理回调数据
      const pages = [];
      pagesGroups.map(pagesGroup => {
        pagesGroup.map(page => {
          pages.push(page);
        });
      });

      await browser.close();
      return pages;
    };

    // 根据打开的浏览器个数，拆分需要截图的数据
    const result = [],
      promiseArr = [];
    for (let i = 0, len = urlList.length; i < browserNum; i++) {
      let SingleLen = parseInt(len / browserNum, 0);
      const startPosition = SingleLen * i;
      if (i === browserNum - 1) {
        SingleLen = len - SingleLen * i;
      }
      promiseArr.push(action(startPosition, SingleLen));
    }
    const allList = await Promise.all(promiseArr);
    allList.map(item => {
      item.map(subItem => {
        result.push(subItem);
      });
    });
    return result;
  }
```

其次是通过 [cluster](https://nodejs.org/dist/latest-v10.x/docs/api/cluster.html) 优化 puppeteer，多开一核，任务处理效率就会多翻一倍
你可以通过自己编写 cluster.js 去处理，举个例子：
```js
const cluster = require('cluster');
const startBrowser = require('./startBrowser');
const numCPUs = require('os').cpus().length;

const urls = require('./testData.js');

(async () => {
  if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
  } else {
    // 拆分每核要跑的业务数据
    let len = parseInt(urls.length / numCPUs, 0)
    let start = len * (cluster.worker.id - 1);
    if (cluster.worker.id === numCPUs) {
      len = urls.length - len * (numCPUs - 1);
    }
    await startBrowser(urls, start, len);
    cluster.worker.kill();
  }
})();
```

也可以通过 [pm2](http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/) 来管理 node 进程，就省去了自己编写 cluster.js 的逻辑

```js
// http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/
{
  "apps": [
  {
    "name": "screenshot-demo",
    "script": "./index.js", // 入口文件
    "env":
    {
      "NODE_ENV": "production"
    },
    "error_file": "./logs/app-err.log",
    "out_file": "./logs/app-out.log",
    "log_date_format": "YYYY-MM-DD HH:mm Z",
    "instances" : 4, // 启动[数量]进程自动进行负载均衡。提高整体性能和性能稳定性
    "exec_mode" : "cluster"
  }]
}
```
启动方式
```
pm2 start pm2.json
```
