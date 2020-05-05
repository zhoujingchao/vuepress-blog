# node进程间通信方式

## ipc
```js
const cluster = require('cluster')
const cpuNums = require('os').cpus().length

if (cluster.isMaster) {
  for (let i = 0; i < cpuNums; i++) {
    cluster.fork()
  }

  for (let id in cluster.workers) {
    cluster.workers[id].on('message', msg => {
      console.log('[master] ' + 'message ' + msg);
    })
  }

  setInterval(() => {
    for (let id in cluster.workers) {
      cluster.workers[id].send('[master] ' + 'send message to worker' + id)
    }
  }, 3000)
} else {
  console.log('I am worker #' + cluster.worker.id);
  process.on('message', msg => {
    console.log('[worker] '+ msg)
    process.send('[worker] worker' + cluster.worker.id + ' received!')
  })
}
```
`cluster`就是`child_process`的高级封装，环境变量`NODE_UNIQUE_ID`必须通过`cluster.fork`创建的子进程才有`NODE_UNIQUE_ID`变量，如果通过`child_process.fork`的子进程，在不传递环境变量的情况下是没有`NODE_UNIQUE_ID的`。因此，当你在`child_process.fork`的子进程中执行`cluster.isMaster`判断时，它会返回`true`。

fork特性
1. fork会在父进程和子进程之间建立一个通信管道,用于进程之间的通信。
2. fork 出的进程拥有自己的独立的内存空间

## spwan & exec
```js
const { spawn } = require('child_process')
const ls = spawn('ls', ['-lh', '/usr'])
ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`)
})

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`)
})

ls.on('close', (code) => {
  console.log(`子进程退出，退出码 ${code}`)
})
```

```js
const { exec } = require('child_process')
exec('cat *.js missing_file | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`执行的错误: ${error}`)
    return
  }
  console.log(`stdout: ${stdout}`)
  console.error(`stderr: ${stderr}`)
});
```

`spawn`和`exec`最大的区别是：
1. `spawn`使用`Stream的形式`返回。
2. `exec`则是`回调函数形式`返回。

## socket

```js
// 父进程
const { spawn } = require('child_process')
const child = spawn('node', ['child'], {
  stdio: [null, null, null, 'pipe']
})
child.stdio[3].on('data', data => {
  console.log(data.toString())
})

// 子进程 => child.js
const net = require('net')
const pipe = net.Socket({ fd: 3 })
pipe.write('killme')
```