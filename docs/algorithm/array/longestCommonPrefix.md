# 最长公共前缀

## 题目

编写一个函数来查找字符串数组中的最长公共前缀。如果不存在公共前缀，返回空字符串 ""。

## 代码

```js
/**
 * @param {string[]} strArr
 * @return {string}
 */
function longestCommonPrefix(strArr) {
  const len = strArr.length
  if (len === 0) return '';
  else if (len === 1) return strArr[0];
  else {
    let result = '';
    for (let i = 0, length = strArr[0].length; i < length; i++) {
      for (let j = 1; j < len; j++) {
        if (strArr[0][i] !== strArr[j][i]) return result;
      }
      result += strArr[0][i];
    }
    return result;
  }
};
```