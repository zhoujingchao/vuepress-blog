# 两数相加

## 题目

给出两个 非空 的链表用来表示两个非负的整数，其中，它们各自的位数是按照 逆序 的方式存储的，并且它们的每个节点只能存储 一位 数字。如果，我们将这两个数相加起来，则会返回一个新的链表来表示它们的和。可以假设除了数字 0 之外，这两个数都不会以 0 开头。

示例:
```
输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
输出：7 -> 0 -> 8
原因：342 + 465 = 807
```

## 思路

- +2 4 3
- +5 6 4
- =7 0 8 向后+1

## 代码

```js
function ListNode(val) {
  this.val = val
  this.next = null
}

function addTwoNumbers(l1, l2) {
  const temp = new ListNode()
  let node = temp, sum, n = 0;
  while (l1 || l2) {
    const n1 = l1 ? l1.next : 0
    const n2 = l2 ? l2.next : 0
    sum = n1 + n2 + n
    temp.next = new ListNode(sum % 10)
    temp = temp.next
    n = parseInt( sum / 10)
    if (l1) l1 = l1.next
    if (l2) l2 = l2.next
  }
  if (n > 0) temp.next = new ListNode(n)
  return node.next
}
```