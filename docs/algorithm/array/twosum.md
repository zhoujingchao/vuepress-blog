# 两数之和

## 题目

给定一个整数数组 nums 和一个目标值 target，在该数组中找出和为目标值的那两个整数，并返回他们的数组下标。

你可以假设每种输入只会对应一个答案。但是，你不能重复利用这个数组中同样的元素。

示例:
```
给定 nums = [2, 7, 11, 15], target = 9

因为 nums[0] + nums[1] = 2 + 7 = 9
所以返回 [0, 1]
```

## 思路

- 遍历过的数据进行值和索引的存储，便于判断读取

## 代码

```js
function twoSum(nums, target) {
  const temp = {}
  for (let i = 0, len = nums.length; i < len; i++) {
    if (temp[target - nums[i]] != undefined) {
      return [temp[target - nums[i]], i]
    } else {
      temp[nums[i]] = i
    }
  }
  return []
}
```