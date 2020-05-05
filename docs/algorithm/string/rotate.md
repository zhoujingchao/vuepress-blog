# 字符串反转

## 题目

输入："abcdefg" 和 2

输出： "cdefgab"

## 代码
```js
const str = 'abcdefg'

// substring(from, to) 起始下标位置和最后一个下标位置的后一位
function rotate(str, num) {
  const front = str.substring(0, num)
  const end = str.slice(num)
  return end + front
}

// substr(start, length) 起始下标位置和长度
function rotate(str, n) {
  if (str && n) {
    return (str + str).substr(n, str.length)
  } else {
    return ''
  }
}

console.log(rotate(str, 2))
```