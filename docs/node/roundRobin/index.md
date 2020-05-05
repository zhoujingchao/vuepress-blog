# node负载均衡RoundRobin

## 核心代码
```js
RoundRobinHandle.prototype.distribute = function(err, handle) {
  this.handles.push(handle);
  const worker = this.free.shift();
  if (worker) this.handoff(worker);
};

// 发送消息和handle给对应worker进程
RoundRobinHandle.prototype.handoff = function(worker) {
  if (worker.id in this.all === false) {
    return;  // 如果 worker 已经被关了
  }

  const handle = this.handles.shift();
  if (handle === undefined) {
    this.free.push(worker);  // 再次添加到空闲子进程队列
    return;
  }

  const message = { act: 'newconn', key: this.key };

  sendHelper(worker.process, message, handle, (reply) => {
    if (reply.accepted)
      handle.close();
    else
      this.distribute(0, handle);  // 当前 Worker 正在关闭，准备发送给另一个 worker

    this.handoff(worker);
  });
};
```

## 重要概念

- distribute: 负责筛选出处理请求的子进程
- this.handles: 存放客户端待处理的请求
- this.free: 存放空闲子进程
- handoff: 拿出排队中的客户端请求，进行任务处理

## 流程

1. 首先 request 进来。
2. 执行 distribute，把请求在 handles 里存放起来，再从 free 里取出空闲子进程，如果有空闲子进程，就执行 handoff 给他发消息。
3. handoff，先获取排队中的客户端请求，通过IPC通道发送句柄，等消息返回。当子进程返回正在处理请求的消息时，它会继续执行 handoff 函数，分配请求给这个子进程，不管该子进程上次请求是否处理完成（node的异步特性和事件循环可以让单进程处理多请求）。
4. 一旦主进程没有缓存的客户端请求时（handles为空），便会将当前子进程加入free空闲队列，等待主进程的下一步调度。这就是cluster模式的RoundRobin调度策略，每个子进程的处理逻辑都是一个闭环，直到主进程缓存的客户端请求处理完毕时，该子进程的处理闭环才被打开。
