# 链表中倒数第k个结点

## 题目

输入一个链表，输出该链表中倒数第k个结点。

## 思路

1. 两个指针p1,p2，开始都指向头结点
2. 先让p2走k步，然后p1,p2同时向下走
3. 当p2指向null的时候，p1就是倒数第k个节点

## 代码

```js
const head = {
  val: 1,
  next: {
    val: 2,
    next: {
      val: 3,
      next: {
        val: 4,
        next: null
      }
    }
  }
}

function findK(head, k) {
  if (!head || !k) return null
  let p1 = head
  let p2 = head
  let index = 1
  while (p2.next) {
    index++
    p2 = p2.next
    if (index > k) {
      p1 = p1.next
    }
  }
  return (k <= index) && p1
}

findK(head, 2)
```