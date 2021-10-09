# 分页

## 题目
示例:
```js
const array = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];

const getDataByPage = (list, pageIndex = 1, pageSize = 5) => {
	// todo ...
};

getDataByPage(list, 3, 5) // [11,12,13,14,15];
getDataByPage(list, 7, 5) // [31];
getDataByPage(list, 7, 8) // [];
getDataByPage(list, 1, 8) // [1,2,3,4,5,6,7,8];
getDataByPage(list, 1) // [1,2,3,4,5];
```

## 思路

- 数组分段

## 代码

```js
const getDataByPage = (list, pageIndex = 1, pageSize = 5) => {
  if (pageIndex < 1) return;

  let index = 0;
  const newList = [];
  while(index < list.length) {
    newList.push(list.slice(index, index += pageSize));
  }
  return newList[pageIndex - 1] || []
}
```