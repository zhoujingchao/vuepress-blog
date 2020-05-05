# 从尾到头输出

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
      next: null
    }
  }
}

function endToStart(head) {
  const array = []
  while(head) {
    array.unshift(head.val)
    head = head.next
  }
  console.log(array)
  return array
}

endToStart(head)
```