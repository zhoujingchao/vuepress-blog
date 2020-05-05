# 实现一个深拷贝

## 浅拷贝

> 创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性是基本类型，拷贝的就是基本类型的值，如果属性是引用类型，拷贝的就是内存地址，所以如果其中一个对象改变了这个地址，就会影响到另一个对象。

浅拷贝只复制指向某个对象的指针，而不复制对象本身，新旧对象还是共享同一块内存。

```js
Object.assign()
Array.prototype.concat()
Array.prototype.slice()
// ...
```

## 深拷贝

> 将一个对象从内存中完整的拷贝一份出来，从堆内存中开辟一个新的区域存放新对象，且修改新对象不会影响原对象。

### 简易版

```js
const target = {}
JSON.parse(JSON.stringify(target))
```

虽然很简单，但它也足够应对很多业务场景了。如果属性值里有函数，循环引用，undefined 这三种情况的话，那么它将不适用。

### 基础版

```js
function checkType(target) {
  return Object.prototype.toString.call(target).slice(8, -1)
}
function deepClone(target) {
  const type = checkType(target)
  let cloneTarget
  if (type === 'Object') {
    cloneTarget = {}
  } else if (type === 'Array') {
    cloneTarget = []
  } else {
    return target
  }
  for (const key in target) {
    if (target.hasOwnproperty(key)) {
      const temp = target[key]
      if (checkType(temp) === 'Object' || checkType(temp) === 'Array') {
        cloneTarget[key] = deepClone(temp)
      } else {
        cloneTarget[key] = temp
      }
    }
  }
  return cloneTarget
}
```

同样的，这里循环引用的问题还是没有解决。但是我们可以额外开辟一个存储空间，来存储当前对象和拷贝对象的对应关系，当需要拷贝当前对象时，先去存储空间中找，有没有拷贝过这个对象，如果有的话直接返回，如果没有的话继续拷贝，这样就可以巧妙化解的循环引用的问题。

### 循环引用

```js
function checkType(target) {
  return Object.prototype.toString.call(target).slice(8, -1)
}
function deepClone(target, map = new Map()) {
  const type = checkType(target)
  let cloneTarget
  if (type === 'Object') {
    cloneTarget = {}
  } else if (type === 'Array') {
    cloneTarget = []
  } else {
    return target
  }
  if (map.get(target)) {
    return map.get(target)
  }
  map.set(target, cloneTarget)
  for (const key in target) {
    if (target.hasOwnproperty(key)) {
      const temp = target[key]
      if (checkType(temp) === 'Object' || checkType(temp) === 'Array') {
        cloneTarget[key] = deepClone(temp)
      } else {
        cloneTarget[key] = temp
      }
    }
  }
  return cloneTarget
}
```

到这里，它考虑的就更全面一些了。如果你想看看一些优秀的js库是如何做的，可以去看下 [lodash](https://lodash.com/docs/4.17.11#cloneDeep) 里`cloneDeep`函数的源码。
