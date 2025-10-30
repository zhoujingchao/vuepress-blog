# 移除元素

## 题目

给你一个按 非递减顺序 排序的整数数组 nums，返回 每个数字的平方 组成的新数组，要求也按 非递减顺序 排序。

示例:
```
输入：nums = [-4,-1,0,3,10]
输出：[0,1,9,16,100]
解释：平方后，数组变为 [16,1,0,9,100]，排序后，数组变为 [0,1,9,16,100]
```

## 思路

1、平方后直接排序

2、数组其实是有序的， 只不过负数平方之后可能成为最大数了。那么数组平方的最大值就在数组的两端，不是最左边就是最右边，不可能是中间。此时可以考虑双指针法了，i指向起始位置，j指向终止位置。

## 代码

```js
// 时间复杂度 O(n) + O(nlogn) = O(nlogn)
// 空间复杂度 O(n)
const sortedSquares1 = (nums) => {
  return nums.map(item => item * item).sort((a, b) => a - b);
}

// 时间复杂度 O(n)
const sortedSquares2 = (nums) => {
  let n = nums.length;
  let res = new Array(n).fill(0);
  let i = 0, j = n - 1, k = n - 1;
  while (i <= j) {
    let left = nums[i] * nums[i];
    let right = nums[j] * nums[j];
    if (left < right) {
      res[k--] = right;
      j--;
    } else {
      res[k--] = left;
      i++;
    }
  }
  return res;
}
```