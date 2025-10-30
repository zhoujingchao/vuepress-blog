# 二分查找

## 题目

给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target  ，写一个函数搜索 nums 中的 target，如果目标值存在返回下标，否则返回 -1。

示例:
```
输入: nums = [-1,0,3,5,9,12], target = 9     
输出: 4       
解释: 9 出现在 nums 中并且下标为 4
```

## 思路

有序数组且无重复，定义好区间即可

## 代码

```js
const search = (nums, target) => {
  let left = 0, right = nums.length - 1;
  // 左闭右闭
  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);
    if (nums[mid] > target) {
      // 去左面闭区找
      right = mid - 1;
    } else if (nums[mid] < target) {
      // 去右面闭区找
      left = mid + 1;
    } else {
      return mid;
    }
  } 
  return -1;
}
```