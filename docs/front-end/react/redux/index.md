# Redux实现原理

## 基本雏形构成
```js
const createStore = () => {
  // 公共状态
  let currentState = {}

  // 获取当前状态 getter
  function getState () {
    return currentState
  }

  // setter
  function dispatch () {}

  // 发布订阅
  function subscribe () {}

  return { getState, dispatch, subscribe }
}
```

## 添加dispatch逻辑
```js
// setter
function dispatch (action) {
  switch (action.type) {
    case 'add':
      currentState = {
        ...currentState,
        count: currentState.count + 1 
      }
  }
}
```

## reducer
逻辑很多不利于维护，所以衍生出了专门管理的 `reducer`。
```js
// reducer.js
let initialState = {
  count: 1
}
export function reducer (state = initialState, action) {
  switch(action.type) {
    case 'add':
      return {
        ...state,
        count: state.count + 1
      }
    case 'delete':
      return {
        ...state,
        count: state.count - 1
      }
    default:        
      return state  
  }
}
```

## 添加观察者
```js
let initialState = {
  count: 1
}
export function reducer (state = initialState, action) {
  switch(action.type) {
    case 'add':
      return {
        ...state,
        count: state.count + 1
      }
    case 'delete':
      return {
        ...state,
        count: state.count - 1
      }
    default:        
      return state  
  }
}

export function createStore (initialState) {
  // 公共状态初始化
  let currentState = initialState
  // 观察者队列
  let subscribes = []

  // 获取当前状态 getter
  function getState () {
    return currentState
  }

  // setter
  function dispatch (action) {
    currentState = reducer(currentState, action)
    subscribes.forEach(fn => fn())
  }

  // 发布订阅
  function subscribe (fn) {
    subscribes.push(fn)
  }

  return { getState, dispatch, subscribe }
}

// 创建store
const store = createStore(initialState)
store.subscribe(() => { console.log('组件1收到store的通知') })
store.subscribe(() => { console.log('组件2收到store的通知') })
store.dispatch({ type: 'add' })
console.log(store.getState())
```

以上就是`redux`的基本原理，下面我们结合`react`，梳理一下`react-redux`。

## react-redux

在`react-redux`还未诞生前，我们的一个组件如果想从`store`存取公用状态，需要进行四步操作：
1. import 引入 store
2. getState 获取状态
3. dispatch 修改状态
4. subscribe 订阅更新

代码相对冗余，我们想要合并一些重复的操作，而`react-redux`就给我们提供了一种合并操作的方案：
1. 提供 Provider 和 connect 两个API
2. Provider 将 store 放进 this.context 里，省去了 import 这一步
3. connect 将 getState、dispatch 合并进了 this.props ，并自动订阅更新

### Provider
```js
import React, { Component } from 'react'
import PropTypes from 'prop-types'

// this.context.store 获取
export class Provider extends Component {
  // 需要声明静态属性 childContextTypes 来指定context对象的属性,是context的固定写法
  static childContextTypes = {
    store: PropTypes.object
  }

  // 实现 getChildContext 方法,返回context对象,也是固定写法
  getChildContext() {
    return {
      store: this.store
    }
  }

  constructor(props, context) {    
    super(props, context)    
    this.store = props.store  
  }  

  // 渲染被 Provider 包裹的组件
  render() {
    return this.props.children
  }
}
```

### connect
```js
// connect(mapStateToProps, mapDispatchToProps)(App)
import React from 'react'
import PropTypes from 'prop-types'

export function connect(mapStateToProps, mapDispatchToProps) {
  return function (Component) {
    class Connect extends React.Component {
      // 从 context 获取 store 并订阅更新
      componentDidMount() {          
        this.context.store.subscribe(this.handleStoreChange.bind(this));        
      }

      // 触发更新       
      handleStoreChange() {
        // 触发的方法有多种,为了简洁起见
        // 直接 forceUpdate 强制更新,也可以通过 setState 来触发子组件更新          
        this.forceUpdate()
      }

      render() {
        return (
          <Component 
            // 传入该组件的 props,需要由 connect 这个高阶组件原样传回原组件
            {...this.props}
            // 根据 mapStateToProps 把 state 挂到 this.props 上
            {...mapStateToProps(this.context.store.getState())}
            // 根据 mapDispatchToProps 把 dispatch(action) 挂到 this.props上 
            {...mapDispatchToProps(this.context.store.dispatch)}
          />
        )
      }
    }
    
    //接收 context 的固定写法      
    Connect.contextTypes = {        
      store: PropTypes.object      
    }      
    return Connect   
  }
}
```

都是基于高阶组件做的。
