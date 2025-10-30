# 长度最小子数组

## 题目

给定一个含有 n 个正整数的数组和一个正整数 s ，找出该数组中满足其和 ≥ s 的长度最小的 连续 子数组，并返回其长度。如果不存在符合条件的子数组，返回 0。


示例:
```
输入：s = 7, nums = [2,3,1,2,4,3]
输出：2
解释：子数组 [4,3] 是该条件下的长度最小的子数组。
```

## 思路

两次 for 循环，O(n^2)。

滑动窗口：根据当前子序列和大小的情况，不断调节子序列的起始位置。从而将O(n^2)暴力解法降为O(n)。

## 代码

```js
const minSubArrayLen1 = (target, nums) => {
  let len = 0;
  let sum = 0;
  let result = 0;
  for (let i = 0; i < nums.length; i++) {
    // 重置
    sum = 0;
    for (let j = i; j < nums.length; j++) {
      sum += nums[j];
      if (sum >= target) {
        len = j - i + 1;
        if (result !== 0) {
          result = Math.min(result, len);
          break;
        }
        result = len;
        break;
      }
    }
  }
  return result;
}

const minSubArrayLen2 = (target, nums) => {
  let start = 0, end = 0;
  let sum = 0;
  let len = nums.length;
  let ans = 0;
  while (end < len) {
    sum += nums[end];
    while (sum >= target) {
      ans = ans !== 0 ? Math.min(ans, end - start + 1) : end - start + 1;
      sum -= nums[start];
      start++;
    }
    end++;
  }
  return ans;
}
```