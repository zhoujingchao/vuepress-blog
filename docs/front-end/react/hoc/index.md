# React高阶组件

## 什么是高阶组件

传入一个组件，给这个组件新增一些`props`属性后，返回一个新的组件。

## 应用场景

1. 代码复用，逻辑抽象，抽离底层代码
2. 渲染劫持
3. State 抽象和更改
4. Props 更改

## 示例代码
```js
import React, { Component } from 'react'

//高阶组件定义
const HOC = WrappedComponent =>
  class Wrap extends Component {
    constructor(props) {
      super(props)
      this.state = {
        value: ''
      }
    }

    handleChange = e => {
      this.setState({
        value: e.target.value
      })
    }

    render() {
        value: this.state.value,
        onChange: this.handleChange,
        onClick: () => console.log('clicked')
      }
      return (
        <WrappedComponent
          {...this.props}
          {...newProps}
        />
      );
    }
  };

//普通的组件
class Input extends Component {
  render() {
    console.log(this.props);
    return <input className="input" type="text" {...this.props} />
  }
}

//高阶组件使用
export default HOC(Input)
```

react-redux 就是非常经典的高阶组件。
