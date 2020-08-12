# 基本操作

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

// 生成二叉树
function binaryTree(nodeArr) {
  function makeBinaryTree(key) {
    const newNode = new Node(key)
    if (!root) {
      root = newNode
      return
    }
    let current = root
    let node = null
    while (current) {
      node = current
      if (key <= node.key) {
        current = current.left
        if (!current) {
          node.left = newNode
          return
        }
      } else {
        current = current.right
        if (!current) {
          node.right = newNode
          return
        }
      }
    }
  }
  nodeArr.forEach(key => makeBinaryTree(key))
  return root
}

const nodeArr = [5,4,8,11,13,4,7,3,5,1]
binaryTree(nodeArr)
```

## 遍历
### 中序遍历

```js
// 先左子树，后根节点，再右子树
function inOrder(node) {
  if (node) {
    inOrder(node.left)
    console.log(node.key)
    inOrder(node.right)
  }
}
```

### 前序遍历
```js
// 先根节点，后左子树，再右子树
function prevOrder(node) {
  if (node) {
    console.log(node.key)
    prevOrder(node.left)
    prevOrder(node.right)
  }
}
```

### 后序遍历
```js
// 先左子树，后右子树，再根节点
function postOrder(node) {
  if (node) {
    postOrder(node.left)
    postOrder(node.right)
    console.log(node.key)
  }
}
```

## 查找

### 树查找

```js
function getNode(node, target) {
  if (node) {
    if (target === node.key) {
      return node
    } else if (target < node.key) {
      getNode(node.left, target)
    } else {
      getNode(node.right, target)
    }
  } else {
    return null
  }
}
```

### 二分法查找

二分查找的条件是必须是有序的线性表。

和线性表的中点值进行比较，如果小就继续在小的序列中查找，如此递归直到找到相同的值。

```js
function binarySearch(target, arr, start, end) {
  if (start > end) {
    return -1
  }
  const mid = Math.floor((end + start) / 2)
  if (target === arr[mid]) {
    return mid
  } else if (target < arr[mid]) {
    return binarySearch(target, arr, start, mid - 1)
  } else {
    return binarySearch(target, arr, mid + 1, end)
  }
}
const arr = [0, 1, 1, 1, 1, 1, 4, 6, 7, 8]
console.log(binarySearch(6, arr, 0, arr.length - 1))
```

### 查找BST最大值

即二叉树右子树最右侧的那个没有右子树的节点

```js
function maxNode(node) {
  if (node) {
    while (node.right) {
      node = node.right
    }
    return node.key
  }
  return null
}
```

### 查找BST最小值

即二叉树左子树最左侧的那个没有左子树的节点

```js
function minNode(node) {
  if (node) {
    while (node.left) {
      node = node.left
    }
    return node.key
  }
  return null
}
```

## 深度

### 最大深度

```js
function maxDeep(node) {
  return !node ? 0 : Math.max(maxDeep(node.left), maxDeep(node.right)) + 1
}
```

### 最小深度

- 左右子树都不为空：左子树深度和右子树最小深度的最小值 + 1
- 左树为空：当前右子树最小深度值 + 1
- 右树为空：当前左子树最小深度值 + 1

```js
function minDeep(node) {
  if (!node) return 0
  if (!node.left) {
    return 1 + minDeep(node.right)
  }
  if (!node.right) {
    return 1 + minDeep(node.left)
  }
  return Math.min(minDeep(node.left), minDeep(node.right)) + 1
}
```