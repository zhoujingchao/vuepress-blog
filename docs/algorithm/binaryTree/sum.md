# 二叉树中是否有节点的和等于某个值

## 题目

输入一颗二叉树和一个整数，判断是否存在节点值的和等于输入的整数。

## 思路

- 把节点和都存起来，最后再判断

## 代码

```js
function hasSum(node, target) {
  let num = 0
  const result = []
  help(node, result, num, target)
  console.log(result)
  return result.indexOf(target) >= 0
}
function help(node, result, num, target) {
  if (!node.key) return
  num += node.key
  if (!node.left && !node.right) {
    result.push(num)
  }
  if (node.left) help(node.left, result, num, target)
  if (node.right) help(node.right, result, num, target)
}
```

## 扩展

假如存在这个节点和等于输入值，输出所有路径。

### 思路

- 利用回溯算法的思路
- 输入的值 target 减去 key，如果存在这条路径，最后肯定会相等

### 代码

```js
function hasPath(node, target) {
  const result = [], single = [];
  help(node, result, single, target)
  console.log(result)
  return result
}
function help(node, result, single, target) {
  if (!node.key) return
  single = [...single, node.key]
  if (!node.left && !node.right && node.key === target) {
    result.push(single)
  }
  if (node.left) help(node.left, result, single, target - node.key)
  if (node.right) help(node.right, result, single, target - node.key)
}
```
