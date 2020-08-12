# 括号生成

## 题目

数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。

示例:
```
输入：n = 3
输出：[
  "((()))",
  "(()())",
  "(())()",
  "()(())",
  "()()()"
]
```

## 思路

- 左括号未用完，继续添加左括号
- 右括号少于左括号，右括号继续增加
- 直到左右括号全部用完

## 代码

```js
function generateParenthesis(n) {
  const result = []
  function handle(left, right, total, s) {
    if (left === total && right === total) {
      result.push(s)
      return
    }

    if (left < total) handle(left + 1, right, total, s + '(')
    if (left > right) handle(left, right + 1, total, s + ')')
  }
  handle(0, 0, n, '')
  return result
}
```