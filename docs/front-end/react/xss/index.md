# React XSS注意事项

## dangerouslySetInnerHTML

```js
const userName = "<img onerror='alert(\"Hacked!\");' src='invalid-image' />"
const userText = "<img onerror='alert(\"Hacked!\");' src='invalid-image' />"
class UserComponent extends React.Component {
  render() {
    return (
      <div>Hello {userName}!</div>
      <div dangerouslySetInnerHTML={{'__html': userText}} />
    )
  }
}
ReactDOM.render(<UserComponent />, document.querySelector('#app'))
```

第一种方式里，`jsx`帮我们做了转义，所以不会被攻击。

但是当使用`dangerouslySetInnerHTML`时，需要确保内容不包含任何`JavaScript`恶意代码。`React`在这里是无法帮我们处理任何事情的。

## a.href attribute

```js
const url_1 = "javascript:alert('Hacked!');"
let url_2 = "data:text/html;base64,PHNjcmlwdD5hbGVydCgiSGFja2VkISIpOzwvc2NyaXB0Pg=="
class Website extends React.Component {
  render() {
    url_2 = url_2.replace(/^(javascript\:)/, '')
    return (
      <a href={url_1}>Hello 1!</a>
      <a href={url_2}>Hello 2!</a>
    )
  }
}
ReactDOM.render(<Website />, document.querySelector('#app'))
```