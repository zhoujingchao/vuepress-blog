# 回文数

回文数是指正序（从左向右）和倒序（从右向左）读都是一样的。

```js
function isPalindrome(x) {
  const str = String(x)
  const revStr = str.split('').reverse().join('')
  if (str === revStr) return true
  return false
}
```
