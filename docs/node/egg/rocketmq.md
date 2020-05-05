# egg-rocketmq消息中间件

前一阵子的业务驱使下，出于考虑系统稳定性以及 java 和 node 的解耦性，node端接入了中台已有的 [rocketmq](https://github.com/apache/rocketmq) 消息中间件，我们 node 业务架子用的是 [egg](https://github.com/eggjs/egg)，在这基础上结合中台和相关业务，做过二次框架开发。这回接入 rocketmq 使得编码方式一点都不友好，所有的生产者和消费者业务代码统统不符合 egg 本身编码规范。因此后面利用碎片化时间，撸了一个 [egg-rocketmq](https://github.com/zhoujingchao/egg-rocketmq) 插件，是基于 [rocketmq-client-nodejs](https://github.com/apache/rocketmq-client-nodejs) 扩展的，有需要的或者感兴趣的同学可以试一试。
