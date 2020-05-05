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

// 局部反转构成整体反转
// 1,2,3,4
// 2,1,3,4
// 3,2,1,4
// 4,3,2,1
function reverser(head) {
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

reverser(head)
```