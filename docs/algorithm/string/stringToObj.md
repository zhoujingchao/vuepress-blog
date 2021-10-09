# 查询字符串解析为键值对的集合

## 题目

输入：查询字符串 'foo=bar&abc=xyz&abc=123'

输出：一个键值对的对象

~~~
 {
    foo: 'bar',
    abc: ['xyz', '123'],
 }
~~~

## 代码
```js
function stringToObj(str) {
  const obj = {};
  const list = str.split('&');
  list.forEach(item => {
    const [ key, value ] = item.split('=');
    if (obj[key]) {
      obj[key] = [].concat(obj[key], value);
      return;
    }
    obj[key] = value;
  })
  return obj;
}
```