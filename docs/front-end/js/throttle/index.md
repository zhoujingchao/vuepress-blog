# 节流与防抖
## 问题引入

**问题1:** 实现dom拖拽功能，但是绑定在拖拽事件的时候每当元素稍微移动一点便触发了大量的毁回调函数，导致浏览器卡死。
**问题2:** 用户连续输入时需要AJAX请求问题。

像这种场景实在是太常见了，为了应对便出现了 `函数节流` 和 `函数防抖` 这两个概念，总的来说：
这两个方法是在**时间轴上控制函数的执行次数**。

## 应用场景

### 节流 throttle

1. 游戏中的刷新率
2. dom元素拖拽
3. 监听滚动事件判断是否到页面底部自动加载更多内容

指定时间间隔内甭管怎么触发只会执行一次任务。目的是让一个函数不要执行得太频繁，减少一些过快的调用来节流，间隔时间段触发，有规律的执行。

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
  <title>函数节流</title>
  <style>
    body {
      height: 4000px;
    }
  </style>
</head>

<body>
  <script>
    const time = +new Date()
    function count() {
      console.log("函数调用:" + (+new Date() - time))
    }

    // 节流 控制执行间隔时间 防止频繁触发 scroll resize mousemove
    let throttle = (fn, delay) => {
      let run = true
      return function(...args) {
        if (!run) return // 如果开关关闭了，就不用往下执行逻辑代码
        run = false // 持续触发的话，就会命中上面的判断条件
        setTimeout(function() {
          fn.apply(this, args)
          run = true // 时间到达后，打开开关，执行逻辑
        }, delay)
      }
    }

    window.onscroll = throttle(count, 1000);
  </script>
</body>

</html>
```

### 防抖 debounce

1. 防止表单多次提交
2. 防止输入框连续输入进行AJAX请求
3. 窗口缩放

任务频繁触发的情况下，只有任务触发的间隔超过指定间隔的时候，任务才会执行，适合多次事件一次响应的情况。

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
  <title>函数防抖</title>
  <style>
    body {
      height: 4000px;
    }
  </style>
</head>

<body>
  <script>
    let debounce = (fn, wait) => {
      let timer = null
      return function(...args) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(function() {
          fn.apply(this, args)
        }, wait)
      }
    }

    function count() {
      console.log('函数调用')
    }
    const fn = debounce(count, 300)
    window.onscroll = function () {
      console.log('scroll滑动')
      fn()
    }
  </script>
</body>

</html>
```

我们滚动页面时，频繁触发了多次的函数调用，如果函数调用中涉及到了dom操作或者接口请求的话，那就爆炸了。所以用防抖，让他停止滑动后，定时结束才执行函数处理逻辑。

总之，巧用函数节流方式能够显著得提高页面性能以及交互体验。
