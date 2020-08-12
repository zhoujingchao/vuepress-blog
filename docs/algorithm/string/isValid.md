# 有效的括号

## 题目

给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。

有效字符串需满足：

左括号必须用相同类型的右括号闭合。
左括号必须以正确的顺序闭合。
注意空字符串可被认为是有效字符串

## 思路

- hash
- 遇到左括号就塞进数组
- 遇到右括号，就拿出最前面的左括号进行抵消

## 代码

```js
function isValid(s) {
  const map = {
    '{': '}',
    '[': ']',
    '(': ')'
  }
  const temp = []
  for (let i = 0; i < s.length; i++) {
    if (s[i] in map) {
      temp.push(s[i])
    } else {
      if (s[i] !== map[temp.pop()]) return false
    }
    return !temp.length
  }
}
```