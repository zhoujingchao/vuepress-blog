# 二叉排序树

二叉排序树 又称为 二叉搜索树或二叉查找树。

## 特征

- 若它的左子树不空，则左子树上所有结点的值均小于它的根结点的值。
- 若它的右子树不空，则右子树上所有结点的值均大于它的根结点的值。
- 它的左、右子树也分别为二叉查找树。

## 结构

```js
// 创建根节点
let root = null

// 创建节点的构造函数
function Node(key) {
  this.key = key
  this.left = null
  this.right = null
}

// 根据二叉搜索树规则进行排序
function insert(node, newNode) {
  // 比较key，比他小的塞左边，比他大的塞右边
  if (newNode.key < node.key) {
    // 判断节点是否存在，无则赋值，有则递归比较再插入
    if (node.left === null) {
      node.left = newNode
    } else {
      insert(node.left, newNode)
    }
  } else {
    if (node.right === null) {
      node.right = newNode
    } else {
      insert(node.right, newNode)
    }
  }
}

// 生成二叉搜索树
function binaryTree(nodeArr) {
  function makeBinaryTree(key) {
    const newNode = new Node(key)
    if (root === null) {
      root = newNode
    } else {
      insert(root, newNode)
    }
  }
  nodeArr.forEach(key => makeBinaryTree(key))
  return root
}

const nodeArr = [8,3,10,1,6,14,12,4,7,13]
console.log(binaryTree(nodeArr))
```