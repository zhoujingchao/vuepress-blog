# 最长回文子串

## 题目

给定一个字符串 s，找到 s 中最长的回文子串。你可以假设 s 的最大长度为 1000。

示例:
```
输入: "babad"
输出: "bab"
注意: "aba" 也是一个有效答案
```

## 思路

- 中心扩展法
- 从中间向两边扩展，直至不是回文
- 记录当前字符串，比较最大值

## 代码

```js
function longestPalindrome(s) {
  const length = s.length
  if (!s) return ''
  else if (length === 1) return s
  else if (length === 2) return s[0] === s[1] ? s : s[0]
  else {
    let result = ''

    /// 记录回文索引的工具函数
    function getIndex(left, right, s) {
      if (left >= 0 && right < s.length && s[left] === s[right]) {
        left--
        right++
      }
      return { left, right }
    }

    for (let i = 0; i < length; i++) {
      let even = '', odd = '';
      // 相邻且相同的字符串默认就是回文了
      if (s[i] === s[i + 1]) {
        const evenI = getIndex(i - 1, i + 2, s)
        even = s.slice(evenI.left + 1, evenI.right)
      }

      const oddI = getIndex(i - 1, i + 1, s)
      odd = s.slice(oddI.left + 1, oddI.right)
      const max = odd.length > even.length ? odd : even
      result = max.length > result.length ? max : result
    }

    return result
  }
}
```