# 二叉树的镜像

## 定义

操作给定的二叉树，将其变换为源二叉树的镜像。即左右反转。

```
       源二叉树 
    	    5
    	   /  \
    	  3   10
    	 / \  / \
    	1  4 9  11
    	镜像二叉树
    	    5
    	   /  \
    	  10   3
    	 / \  / \
    	4  1 11  9
```

## 代码

```js
function mirror(node) {
  if (node) {
    const temp = node.right
    node.right = node.left
    node.left = temp
    mirror(node.right)
    mirror(node.left)
  }
}
```