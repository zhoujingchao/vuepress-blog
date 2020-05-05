// 给一个链表，若其中包含环，请找出该链表的环的入口结点，否则，输出null。

/** 
 * 思路：
 * 1.两个指针，一个走一步，一个走两步，能相遇即存在环
 * 2.从环内某个节点开始计数，再回到此节点时得到链表环的长度 length
 * 3.p1,p2回到初始节点，p1先走完环的长度length，然后p1p2一起走相遇即是起点
*/
function nodeOfLoop(head) {
  if(!head || !head.next) return null
  let p1 = head.next
  let p2 = head.next.next
  // 判断是否有环
  while (p1 !== p2) {
    if (!p2 || !p2.next) return null
    p1 = p1.next
    p2 = p2.next.next
  }
  // 环内的某个节点相遇了，获取环的长度
  let temp = p1
  let length = 1
  p1 = p1.next
  while(temp !== p1) {
    p1 = p1.next
    length++
  }
  // 把剩下不是环的长度走尽，相遇即是起点
  p1 = p2 = head
  while (length-- > 0) {
    p1 = p1.next
  }
  while(p1 !== p2) {
    p1 = p1.next
    p2 = p2.next
  }
  return p1
}
