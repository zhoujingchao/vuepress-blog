# 最长有效括号

## 题目

给定一个只包含 '(' 和 ')' 的字符串，找出最长的包含有效括号的子串的长度。

示例:
```
输入: ")()())"
输出: 4
解释: 最长有效括号子串为 "()()"
```

## 思路

- 遇到'('塞进数组，索引入栈
- 添加索引参照物，便于后续有效长度的计算

## 代码

```js
function longestValidParentheses(s) {
  let stack = [-1], ans = 0;
  for (let i === 0; i < s.length; i++) {
    if (s[i] === '(') {
      // 左括号索引入栈
      stack.push(i)
    } else {
      // 遇到右括号，栈顶出栈
      stack.pop()
      if (stack.length === 0) {
        // 右括号匹配不到人，就充当参照物
        stack.push(i)
      } else {
        // 计算有效连续长度
        ans = Math.max(ans, i - stack[stack.length - 1])
      }
    }
  }
}
```