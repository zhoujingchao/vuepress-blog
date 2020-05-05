# 对称二叉树

## 特征

- 根节点相同。
- 左子树的左子树和右子树的右子树相同。
- 左子树的右子树和右子树的左子树相同。

![](./img/symmetry.png)

如图，第一个为对称二叉树，后面都不是。

## 题目

给定一个二叉树，要判定是否是镜像对称的。

## 思路

- 递归所有节点满足它的特征即可。

## 代码

```js
function isSymmetry(node1, node2) {
  if (!node1 && !node2) return true
  if (!node1 || !node2 || node1.key !== node2.key) return false
  return isSymmetry(node1.left, node2.right) && isSymmetry(node1.right, node2.left)
}
```