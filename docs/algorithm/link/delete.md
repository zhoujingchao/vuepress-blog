# 删除列表中的节点

## 题目

给定单链表的头指针和要删除的指针节点。

## 思路

- 删除的节点是尾部且等于头部，只有一个节点，置为null
- 删除的节点不是尾部节点，将next节点覆盖当前节点
- 删除的节点是尾节点且前面还有节点，遍历到末尾的前一个节点进行删除

## 代码

```js
function deleteNode(head, node) {
  if (node === head) {
    head = null
    node = null
  } else if (node.next) {
    node.val = node.next.val
    node.next = node.next.next
  } else {
    node = head
    while (node.next.next) {
      node.next = null
      node = null
    }
  }
  return node
}
```