# 排序

## 快速排序

### 思路

选取一个基准数，小于它的站左边，大于它的站右边，不断进行重复操作即可。

### 代码

```js
function quickSort(arr) {
  if (arr.length <= 1) return arr;

  // 基准位置选取，理论上可以任意选取
  var pointIndex = Math.floor(arr.length / 2);
  // 获取基准数（注意：splice会直接对数组进行修改）
  var point = arr.splice(pointIndex, 1)[0];
  
  var left = [], right = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    if (arr[i] < point) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return quickSort(left).concat([point], quickSort(right));
}
```

## 选择排序

### 思路

- 在未排序序列中找到最小（大）元素，存放到排序序列的起始位置
- 从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾
- 重复第二步，直到所有元素均排序完毕

### 代码

```js
function selectSort(arr) {
  var len = arr.length,
    minIndex, value;

  for (var i = 0; i < len - 1; i++) {
    minIndex = i;
    for (var j = i + 1; j < len; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    value = arr[i];
    arr[i] = arr[minIndex];
    arr[minIndex] = value;
  }

  return arr;
}
```

## 冒泡排序

### 思路

- 循环数组，比较当前元素和下一个元素，如果当前元素比下一个元素小，进行位置互换

### 代码

```js
function bubbleSort(arr) {
  var len = arr.length
  for (var i = 0; i < len - 1; i++) {
    for (var j = i + 1; j < len; j++) {
      if (arr[j] < arr[i]) {
        var value = arr[i];
        arr[i] = arr[j];
        arr[j] = value;
      }
    }
  }

  return arr;
}
```