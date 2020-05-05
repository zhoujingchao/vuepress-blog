# 两个链表的第一个公共节点

## 题目

输入两个链表，找出它们的第一个公共结点。

## 思路

1. 先找到两个链表的长度
2. 让长一点的链表先走length2-length1步，让长链表和短链表起点相同
3. 两个链表一起前进，比较获得第一个相等的节点

## 代码

```js
function commonNode(head1, head2) {
  if (!head1 || !head2) return null
  // 找长度
  let length1 = getLength(head1)
  let length2 = getLength(head2)
  // 长链表先走
  let long, short, dValue;
  if (length1 >= length2) {
    long = head1
    short = head2
    dValue = length1 - length2
  } else {
    long = head2
    short = head1
    dValue = length2 - length1
  }
  while (dValue-- > 0) {
    long = long.next
  }
  // 一起走，找公共
  while(long) {
    if (long === short) return long
    long = long.next
    short = short.next
  }
  return null
}

function getLength(head) {
  let length = 0
  let p = head
  while(p && p.next) {
    p = p.next
    legnth++
  }
  return length
}
```