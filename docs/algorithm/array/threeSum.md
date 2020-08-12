# 三数之和

## 题目

给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有满足条件且不重复的三元组。

注意：答案中不可以包含重复的三元组。

示例:
```
给定数组 nums = [-1, 0, 1, 2, -1, -4]，

满足要求的三元组集合为：
[
  [-1, 0, 1],
  [-1, -1, 2]
]
```

## 思路

- 先进行从小到大的排序
- 左指针和右指针进行相加计算
- 如果小于0，和不够大，左指针向右移动；反之右指针向左移动
- 注意可重复，找到后继续移动指针

## 代码

```js
function threeSum(nums) {
  nums.sort((a, b) => a - b)
  const result = []

  for (let i = 0; i < nums.length; i++) {
    const n1 = nums[i]
    if (n1 < 0) break
    if (i > 0 && n1 === nums[i - 1]) continue
    let left = i + 1
    let right = nums.length - 1
    while (left < right) {
      const n2 = nums[left]
      const n3 = nums[right]
      const n = n1 + n2 + n3
      if (n === 0) {
        result.push([n1, n2, n3])
        // 执行完了，还要继续搜索
        while (left < right && nums[left] === n2) left++
        while (left < right && nums[right] === n3) right--
      } else if (n < 0) {
        left++
      } else {
        rigth--
      }
    }
  }

  return result
}
```