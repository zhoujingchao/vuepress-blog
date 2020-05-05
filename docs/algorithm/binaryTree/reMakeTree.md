# 重建二叉树

## 题目

输入某二叉树的前序遍历和中序遍历的结果，请重建出该二叉树。
假设输入的前序遍历和中序遍历的结果中都不含重复的数字。

例如输入前序遍历序列{1,2,4,7,3,5,6,8}和中序遍历序列{4,7,2,1,5,3,8,6}，则重建二叉树并返回。

## 思路

- 利用前中后序遍历规则
- 前序遍历找到根结点root
- 找到root在中序遍历的位置 -> 左子树的长度和右子树的长度
- 截取左子树的中序遍历、右子树的中序遍历
- 截取左子树的前序遍历、右子树的前序遍历
- 递归重建二叉树

## 代码

```js
const pre = [1,2,4,7,3,5,6,8]
const vin = [4,7,2,1,5,3,8,6]

function Node(key) {
  this.key = key 
  this.left = null
  this.right = null
}

function reMakeTree(pre, vin) {
  if (!pre.length) return null
  if (pre.length === 1) return new Node(pre[0])

  const rootKey = pre[0]
  const rootIndexVin = vin.indexOf(rootKey)
  const vinLeft = vin.slice(0, rootIndexVin)
  const vinRight = vin.slice(rootIndexVin + 1)
  const preLeft = pre.slice(1, rootIndexVin + 1)
  const preRight = pre.slice(rootIndexVin + 1)
  const node = new Node(rootKey)
  node.left = reMakeTree(preLeft, vinLeft)
  node.right = reMakeTree(preRight, vinRight)
  return node
}
console.log(reMakeTree(pre, vin))
```

## 题目2-求二叉树遍历

输入某二叉树的前序遍历和中序遍历的结果，输出后续遍历。
```
输入
ABC
BAC
FDXEAG
XDEFAG

输出
BCA
XEDGAF
```

## 代码

```js
// const pre = ['A', 'B', 'C']
// const vin = ['B', 'A', 'C']
const pre = ['F','D','X','E','A','G']
const vin = ['X','D','E','F','A','G']

function Node(key) {
  this.key = key 
  this.left = null
  this.right = null
}

function getPost(pre, vin) {
  if (!pre.length) return ''
  if (pre.length === 1) return pre

  const rootKey = pre[0]
  const rootIndexVin = vin.indexOf(rootKey)
  const vinLeft = vin.slice(0, rootIndexVin)
  const vinRight = vin.slice(rootIndexVin + 1)
  const preLeft = pre.slice(1, rootIndexVin + 1)
  const preRight = pre.slice(rootIndexVin + 1)
  const HRD = getPost(preLeft, vinLeft) + getPost(preRight, vinRight) + rootKey
  return HRD
}
console.log(getPost(pre, vin))
```