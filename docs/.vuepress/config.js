module.exports = {
  title: 'Zhoujc的blog',
  description: '知识沉淀，好记性不如烂笔头',
  // base: '/vuepress-blog/',
  themeConfig: {
    sidebarDepth: 2,
    lastUpdated: 'Last Updated',
    nav: [
      { text: '前端相关', link: '/front-end/' },
      { text: 'Node实践', link: '/node/' },
      { text: '数据结构与算法', link: '/algorithm/' },
      { text: 'Github', link: 'https://github.com/zhoujingchao/vuepress-blog' },
    ],
    sidebar: {
      '/front-end/': [
        '/front-end/',
        {
          title: 'JS进阶',
          children: [
            '/front-end/js/event-loop/',
            '/front-end/js/promise/',
            '/front-end/js/prototype/',
            '/front-end/js/flatten/',
            '/front-end/js/throttle/',
            '/front-end/js/curry/',
            '/front-end/js/continuous-assignment/',
            '/front-end/js/design/factory',
            '/front-end/js/design/constructor',
            '/front-end/js/bind/',
            '/front-end/js/closure/',
          ]
        },
        {
          title: 'React深入系列',
          children: [
            '/front-end/react/hooks/optimize',
            '/front-end/react/hooks/',
            '/front-end/react/hoc/',
            '/front-end/react/redux/',
            '/front-end/react/source/setState',
            '/front-end/react/source/fiber',
            '/front-end/react/source/dom',
            '/front-end/react/ssr/',
            '/front-end/react/diff/',
            '/front-end/react/xss/',
            '/front-end/react/event/',
          ]
        },
        {
          title: '前端工程化',
          children: [
            '/front-end/build/webpack/plugin',
            '/front-end/build/webpack/',
            '/front-end/build/module/',
            '/front-end/build/babel/',
          ]
        },
        {
          title: '浏览器和网络',
          children: [
            '/front-end/net/tcp/',
            '/front-end/net/http/',
            '/front-end/net/ajax/',
            '/front-end/browser/',
          ]
        },
        {
          title: '前端安全',
          children: [
            '/front-end/safe/',
          ]
        },
        {
          title: '移动端',
          children: [
            '/front-end/mobile/rem/',
            '/front-end/mobile/jsbridge/',
          ]
        },
        {
          title: 'CSS',
          children: [
            '/front-end/css/box/',
          ]
        },
      ],
      '/node/': [
        '/node/',
        '/node/roundRobin/',
        '/node/cluster/',
        '/node/error/',
        '/node/egg/rocketmq',
        '/node/koa/',
        '/node/puppeteer/performance',
        '/node/puppeteer/screenshot',
        '/node/puppeteer/install',
      ],
      '/algorithm/': [
        '/algorithm/',
        {
          title: '二叉树',
          children: [
            '/algorithm/binaryTree/concept',
            '/algorithm/binaryTree/baseAction',
            '/algorithm/binaryTree/sort',
            '/algorithm/binaryTree/symmetry',
            '/algorithm/binaryTree/sum',
            '/algorithm/binaryTree/mirror',
            '/algorithm/binaryTree/reMakeTree',
          ]
        },
        {
          title: '链表',
          children: [
            '/algorithm/link/concept',
            '/algorithm/link/endToStart',
            '/algorithm/link/reverse',
            '/algorithm/link/delete',
            '/algorithm/link/k',
            '/algorithm/link/common',
            '/algorithm/link/and',
          ]
        },
        {
          title: '数组',
          children: [
            '/algorithm/array/twosum',
            '/algorithm/array/longestCommonPrefix',
            '/algorithm/array/sort',
          ]
        },
        {
          title: '字符串',
          children: [
            '/algorithm/string/replaceSpace',
            '/algorithm/string/reverse',
            '/algorithm/string/rotate',
          ]
        },
      ]
    }
  }
};