# React Hooks实现原理
## 前言

Hooks推出已有一段时间，相信大家在尝试着摸索使用的过程中，难免遇到一些琢磨不透的问题，比如：

1. 为什么 useEffect 第二个参数是空数组时就当于 ComponentDidMount 的效果，只会执行一次？
2. 为什么只能在函数最外层调用 Hook，不能在循环、条件判断或者子函数中调用？
3. 自定义的 Hook 是如何影响自身并使用它的函数组件的？
4. 这个 effects 取的值怎么不是最新的？
5. ......

## useState

这是一个最简单的 useState 用法
```js
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

function App() {
  var [count, setCount] = useState(0);
  return (
    <div>
      <div>{count}</div>
      <button onClick={() => { setCount(count + 1) }}>click</button>
    </div>
  );
}

function render() {
  ReactDOM.render(<App />, document.getElementById('root'));
}
render();
```

基于 useState 我们自己模拟实现一下

```js
import React from 'react';
import ReactDOM from 'react-dom';

// 存储全局 state
let state;
function useState(initialValue) {
  // 如果没有 state，说明是第一次执行，把 initialValue 复制给它
  state = state || initialValue; 
  function setState(newState) {
    state = newState;
    // 重新渲染
    render();
  }
  return [state, setState];
}

function App() {
  var [count, setCount] = useState(0);
  return (
    <div>
      <div>{count}</div>
      <button onClick={() => { setCount(count + 1) }}>click</button>
    </div>
  );
}

function render() {
  ReactDOM.render(<App />, document.getElementById('root'));
}
render();
```

现在，我们实现了一个可以工作的 useState，至少现在来看没什么问题。

接下去，让我们看看 useEffect 是怎么实现的。

## useEffect

```js
useEffect(() => {
  console.log(count);
}, [count]);
```

玩过的同学都知道它的一些特点：

1. 有两个参数 callback 和 dependencies 数组
2. 如果 dependencies 不存在，那么 callback 每次 render 都会执行
3. 如果 dependencies 存在，只有当它发生了变化，callback 才会执行

我们再来模拟实现一下 useEffect

```js
// 记录 useEffect 的上一次依赖
let deps;
function useEffect(callback, depsArray) {
  const hasNoDeps = !depsArray;
  // 两次的 dependencies 是否完全相等
  const hasChangeDeps = deps ? !depsArray.every((el, i) => el === deps[i]) : true;
  if (hasNoDeps || hasChangeDeps) {
    callback();
    // 更新依赖
    deps = depsArray;
  }
}
```

你会发现，它也可以为我们工作了。这里我们就可以解释 “为什么 useEffect 第二个参数是空数组时就当于 ComponentDidMount 的效果？”了，因为依赖一直不变化，callback 不会二次执行。

## Not Magic, Just Arrays

其实目前我们已经实现了可以工作的 useState 和 useEffect。但是有一个很大的问题：它俩都只能使用一次，因为只有一个 state 和 一个 deps。

```js
const [count, setCount] = useState(0);
const [username, setUsername] = useState('zjc');
```

count 和 username 永远是相等的，因为他们共用了一个 state，并没有地方能分别存储两个值。我们需要可以存储多个 state 和 deps。

就如 [React hooks: not magic, just arrays](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e) 所写，我们可以使用数组，来解决 Hooks 的复用问题。里面提出了一些要点：

1. 初次渲染的时候，按照 useState，useEffect 的顺序，把 state，deps 等按顺序塞到 hooks 数组中。
2. 更新的时候，按照顺序，从 memoizedState 中把上次记录的值拿出来。

```js
import React from 'react';
import ReactDOM from 'react-dom';

// 存放 hooks 的数组
let memoizedState;
// 当前 memoizedState 下标
let cursor = 0; 
function useState(initialValue) {
  // 如果没有 state，说明是第一次执行，把 initialValue 复制给它
  memoizedState[cursor] = memoizedState[cursor] || initialValue;
  // cursor 是全局可变的，所以需要保存本次的
  const currentCursor = cursor;
  function setState(newState) {
    memoizedState[currentCursor] = newState;
    // 重新渲染
    render();
  }
  // 返回当前 state，并 cursor + 1，使 state 可以继续存储
  return [memoizedState[cursor++], setState];
}
function useEffect(callback, depArray) {
  const hasNoDeps = !depArray;
  const deps = memoizedState[cursor];
  const hasChangedDeps = deps
    ? !depArray.every((el, i) => el === deps[i])
    : true;
  if (hasNoDeps || hasChangedDeps) {
    callback();
    // 更新依赖值
    memoizedState[cursor] = depArray;
  }
  // 更新下标，得以复用
  cursor++;
}

function App() {
  const [count, setCount] = useState(0);
  const [username, setUsername] = useState('zjc');

  useEffect(() => {
    console.log(count);
  }, [count]);
  useEffect(() => {
    console.log(username);
  }, [username]);

  return (
    <div>
      <div>{count}</div>
      <button onClick={() => { setCount(count + 1) }}>click</button>
      <div>{username}</div>
      <button onClick={() => { setUsername(username + ' hello') }}>click</button>
    </div>
  );
}

function render() {
  // 在 rerender 的时候才能按照 hooks 在组件函数内的书写顺序从0依次获取 memoizedState 中的值
  cursor = 0;
  ReactDOM.render(<App />, document.getElementById('root'));
}
render();
```

这时，我们得到了可以任意复用的 useState 和 useEffect。同时我们就能解释最开始的几个问题了。
Q：为什么只能在函数最外层调用 Hook？为什么不要在循环、条件判断或者子函数中调用？
A：memoizedState 数组是按 hook 定义的顺序来放置数据的，如果 hook 顺序变化，memoizedState 是感知不到的，会引起问题。
Q：自定义的 Hook 是如何影响自身并使用它的函数组件的？
A：共享同一个 memoizedState，共享同一个顺序

至于“这个 effects 取的值怎么不是最新的？”高频问题，我们用下面这个例子复现下：

```js
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
 
 function App() {
   const [count, setCount] = useState(0);
 
   const handleAlertClick = () => {
     setTimeout(() => {
       alert('You clicked on: ' + count);
     }, 3000)
   };
 
   return (
     <div>
       <p>You clicked {count} times</p>
       <button onClick={() => setCount(count + 1)}>add</button>
       <button onClick={handleAlertClick}>show</button>
     </div>
   );
 }

 ReactDOM.render(<App />, document.getElementById('root'));
```

操作add，接着操作show，再定时器回调前继续add，就发现count不是最新的了。
其实在此例子前面的任意复用的 useState 和 useEffect的模式下，我们可以看出来，useEffect 实际每次都执行了，它相当于给我们存了一个快照，每次都有自己固定不变的state及状态。所以就会出现例子上的的问题。

那么，倔强的我们就想在3s后获取最新的 count 我们该怎么办？官方给出得方案是：每次改变 count 的时候，将其放在 ref 类型的变量里即可。

```js
import React, { useState, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
 
function App() {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const handleAlertClick = useCallback(
  () => {
    setTimeout(() => {
      alert("You clicked on: " + countRef.current);
    }, 3000);
  },
  [count]
);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button
        onClick={() => {
          countRef.current = count + 1;
          setCount(count + 1);
        }}
      >add</button>
      <button onClick={handleAlertClick}>show</button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
```

## 真正的 React 实现

前面虽然我们用数组基本实现了一个可用的 Hooks，了解了 Hooks 的原理，但在 React 中，实现方式肯定是有差异的。粗略的看下源码，你会发现：

1. React 中是通过类似单链表的形式来代替数组的。通过 next 按顺序串联所有的 hook。

```
type Hooks = {
	memoizedState: any, // 指向当前渲染节点 Fiber
  baseState: any, // 初始化 initialState， 已经每次 dispatch 之后 newState
  baseUpdate: Update<any> | null,// 当前需要更新的 Update ，每次更新完之后，会赋值上一个 update，方便 react 在渲染错误的边缘，数据回溯
  queue: UpdateQueue<any> | null,// UpdateQueue 通过
  next: Hook | null, // link 到下一个 hooks，通过 next 串联每一 hooks
}
 
type Effect = {
  tag: HookEffectTag, // effectTag 标记当前 hook 作用在 life-cycles 的哪一个阶段
  create: () => mixed, // 初始化 callback
  destroy: (() => mixed) | null, // 卸载 callback
  deps: Array<mixed> | null,
  next: Effect, // 同上 
};
```

2. memoizedState，cursor 是存在哪里的？如何和每个函数组件一一对应的？

我们知道，react 会生成一棵组件树（包括fiber），树中每个节点对应了一个组件，hooks 的数据就作为组件的一个信息，存储在这些节点上，伴随组件一起出生，一起死亡。

## 参考文章

> https://github.com/brickspert/blog/issues/26
