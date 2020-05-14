# React函数式组件优化

## 前言

函数式组件与 hooks 的相关 API 优化实践经历。

## 优化思路

- 减少 render 次数
- 减少计算量：这里指的是函数的重复计算

## 减少render次数

### shouldComponentUpdate & PureComponent

```js
// child.js
export default class Child extends React.Component {
  shouldComponentUpdate(nexrProps) {
    if (this.props.name === nexrProps.name) return false
    return true
  }
  render() {
    console.log(this.props.name)
    return <h1>{this.props.name}</h1>
  }
}
```

父组件更新了，子组件的`props`没变的话，就不需要去重新`render`子组件了。同样的`PureComponent`这个`API`也能达到这个效果。

```js
export default class Child extends React.PureComponent {
  render() {
    console.log(this.props.name)
    return <h1>{this.props.name}</h1>
  }
}
```

`PureComponent`的内部对状态和`props`数据进行了浅层比较。如果先前的状态和`props`数据与下一个`props`或状态相同，则组件不会重新渲染。以上两种都是类组件的优化方式。

### React.memo

举个🌰：
```js
import React, { useState } from 'react'
import Child from './child'

function Parent() {
  const [num, setNum] = useState(0)

  return (
    <div>
      <h1>{num}</h1>
      <button onClick={() => setNum(num + 1)}>add num</button>
      <Child name="zjc" />
    </div>
  )
}

export default Parent
```
```js
// child.js
import React from 'react'

function Child(props) {
  console.log(props.name)
  return <h1>{props.name}</h1>
}

export default Child
```

这个例子中，子组件并`props`并没有变化，但是他还是重新渲染了，用`React.memo`包一层，他就不会重新渲染了，效果和`PureComponent`极其类似。只不过这个是用在函数组件。

改造后：
```js
// child.js
import React from 'react'

function Child(props) {
  console.log(props.name)
  return <h1>{props.name}</h1>
}

export default React.memo(Child)
```

高级用法，支持传自定义函数
```js
function MyComponent(props) {
  // 使用 props 渲染
}
function areEqual(prevProps, nextProps) {
  // 自定义比较逻辑
}
export default React.memo(MyComponent, areEqual)
```

`areEqual`这个方法就像是我们写`shouldComponentUpdate`逻辑一样，唯一区别就是返回值，`props`相等`areEqual`返回`true`，而`shouldComponentUpdate`返回`false`。

### useCallback

继续上面的🌰：
```js
import React, { useState } from 'react'
import Child from './child'

function Parent() {
  const [num, setNum] = useState(0)
  const [age, setAge] = useState(18)

  const callback = () => {
    setAge(28)
  }

  return (
    <div>
      <h1>{num}</h1>
      <button onClick={() => setNum(num + 1)}>add num</button>
      <Child onClick={callback} name="zjc" />
    </div>
  )
}

export default Parent
```
```js
// child.js
import React from 'react'

function Child(props) {
  console.log(props.name)
  return (
    <>
      <button onClick={props.onClick}>change age</button>
      <h1>{props.name}</h1>
    </>
  )
}

export default React.memo(Child)
```

这个例子你会发现，每次父组件更新，子组件也更新了。我们也用了`React.memo`，看上去`props`也并没有变化啊，为什么还是更新了？其实在函数式组件里每次重新渲染，函数组件都会重头开始重新执行，那么这两次创建的`callback`函数是发生了改变的，所以导致了子组件重新渲染。

改造后：
```js
import React, { useState, useCallback } from 'react'
import Child from './child'

function Parent() {
  const [num, setNum] = useState(0)
  const [age, setAge] = useState(18)

  const callback = () => {
    setAge(28)
  }

  // 通过 useCallback 进行记忆 callback，并将记忆的 callback 传递给 Child
  const memoizedCallback = useCallback(callback, [])

  return (
    <div>
      <h1>{num}</h1>
      <button onClick={() => setNum(num + 1)}>add num</button>
      <Child onClick={memoizedCallback} name="zjc" />
    </div>
  )
}

export default Parent
```

`useCallback`使用方式和`useEffect`类似，当后面的依赖数组变化时，他才会重新记忆。

### useMemo

举个🌰：
```js
import React, { useState } from 'react'

function Parent() {
  const [num, setNum] = useState(0)

  // 模拟一个非常耗时的计算
  const moreTimeFn = () => {
    let result
    for (let i = 0; i < 100000; i++) {
      result += i
    }
    console.log(result)
    return result
  }

  const result = moreTimeFn()

  return (
    <div>
      <h1>{num}</h1>
      <button onClick={() => setNum(num + result)}>add num</button>
    </div>
  )
}

export default Parent
```

你会发现，每次操作，函数都重新计算打印了。

改造后：
```js
import React, { useState, useMemo } from 'react'

function Parent() {
  const [num, setNum] = useState(0)

  // 模拟一个非常耗时的计算
  const moreTimeFn = () => {
    let result
    for (let i = 0; i < 100000; i++) {
      result += i
    }
    console.log(result)
    return result
  }

  // 缓存计算量比较大的函数结果
  const result = useMemo(moreTimeFn, [])

  return (
    <div>
      <h1>{num}</h1>
      <button onClick={() => setNum(num + result)}>add num</button>
    </div>
  )
}

export default Parent
```

这时你会发现，它只打印了一次，除非依赖数组项有变化，它才会重新计算。注意如果没有提供依赖数组项的话，它每次都会重新计算。

## 推荐

更多其他方面优化技巧实践：

[21 个 React 性能优化技巧](https://www.infoq.cn/article/KVE8xtRs-uPphptq5LUz)

[React 性能优化方向](https://juejin.im/post/5d045350f265da1b695d5bf2)

## 参考文章

> https://juejin.im/post/5dd337985188252a1873730f
