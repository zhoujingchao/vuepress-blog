# 无重复字符的最长子串

## 题目

给定一个字符串，请你找出其中不含有重复字符的 最长子串 的长度。

示例:
```
输入: "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```

## 思路

- 利用滑动窗口
- 不存在重复的字符往数组里丢，一旦重复删去前面的元素
- 比较及保存最大长度

## 代码

```js
function lengthOfLongestSubstring(strs) {
  const temp = [];
  let max = 0
  for (let i = 0; i < strs.length; i++) {
    const index = temp.indexOf(strs[i])
    if (index !== -1) {
      temp.splice(0, index + 1)
    }
    temp.push(strs[i])
    max = Math.max(temp.length, max)
  }
  return max
}
```