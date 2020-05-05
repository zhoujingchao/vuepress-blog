# 合并排序链表

## 题目

输入两个单调递增的链表，输出两个链表合成后的链表，合成后的链表仍然满足单调递增规则。

## 思路

- 链表头部节点比较，取较小节点
- 小节点的next等于小节点的next和大节点的较小值。

## 代码

```js
function ListNode(x) {
  this.val = x
  this.next = null
}

// 1,3,5,7
// 2,4,6,8

// 1,3,5,7
//   2,4,6,8

// 1,2
//    3,5,7
//    4,6,8   


function merge(head1, head2) {
  if (!head1) return head2
  if (!head2) return head1

  let head
  if (head1.val < head2.val) {
    head = head1
    head.next = merge(head1.next, head2)
  } else {
    head = head2
    head.next = merge(head1, head2.next)
  }
  return head
}
```