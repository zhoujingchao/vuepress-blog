# 替换空格

```js
const str = 'we  are  happy'
function replaceSpace(str) {
  return str.split(' ').join('%20')

  // 正则
  // return str.replace(/\s/g, '%20')
  
  // 多个空格用一个代替
  // return str.replace(/\s+/g, '%20')
}
console.log(replaceSpace(str))
```