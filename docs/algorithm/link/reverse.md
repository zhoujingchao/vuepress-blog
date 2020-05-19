# 链表反转

```js
function ListNode(x) {
  this.val = x
  this.next = null
}

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

// 以头部节点为基准节点
// 将基准节点的下一个节点移到头部，直到基准节点的下一个节点为null
// 1，2，3
// 2，1，3
// 3，2，1
function reverse(head) {
  let prev = head
  let curr = null
  while (head && head.next) {
    curr = head.next
    head.next = curr.next
    curr.next = prev
    prev = curr
  }
  console.log(prev)
  return prev
}

reverse(head)
```