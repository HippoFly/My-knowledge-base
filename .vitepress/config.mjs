import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "个人知识库",
  base: '/My-knowledge-base/',
  ignoreDeadLinks: true,
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: nav(),
    outlineTitle:"文章目录",
    outline:[2,6],
    sidebar: {
      '/docs/frontend/': { base: '/docs/frontend/', items: frontendBar() },
      '/docs/backend/': { base: '/docs/backend/', items: backendBar() },
      '/docs/database/': { base: '/docs/database/', items: databaseBar() },
      '/docs/middleware/': { base: '/docs/middleware/', items: middlewareBar() }
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/HippoFly' }
    ]
  }
})
// 定义 nav 函数
function nav() {
  return [
    { text: '主页', link: '/' },
    {
      text: "前端",
      activeMatch: "/frontend/",
      items: [
        { text: "Vitepress", link: "/docs/frontend/Vitepress/vitepress-tutorial" },
      ],
    },
    {
      text: "后端",
      activeMatch: "/backend/",
      items: [
        { text: "Java基础", link: "/docs/backend/Java/basis/java-basic-questions-01", },
        { text: "Java集合", link: "/docs/backend/Java/collection/java-collection-questions-01", },
        { text: "Mybatis", link: "/docs/backend/MyBatis/mybatis" },
      ],
    },
    {
      text: "数据库",
      activeMatch: "/database/",
      items: [
        { text: "MySQL", link: "/docs/database/MySQL/MySQL", }, 
        { text: "Redis", link: "/docs/database/Redis/redis-question", }, 
      ],
    },
    {
      text: "中间件",
      activeMatch: "/middleware/",
      items: [
        { text: "消息队列MQ", link: "/docs/middleware/mq/rocketmq-questions", },  
      ],
    },

  ];
}
function frontendBar() {
  return [
    {
      text: 'Vitepress',
      collapsed: false,
      items: [
        { text: 'VitePress用法', link: 'Vitepress/vitepress-tutorial' },
        { text: '快速开始', link: 'getting-started' },
        { text: '路由', link: 'routing' },
        { text: '部署', link: 'deploy' }
      ]
    },
  ]
}

function backendBar() {
  return [
    {
      text: 'Java基础',
      collapsed: false,
      items: [
        { text: 'Java基础常见面试题总结(1)', link: 'Java/basis/java-basic-questions-01' },
        { text: 'Java基础常见面试题总结(2)', link: 'Java/basis/java-basic-questions-02' },
        { text: 'Java基础常见面试题总结(3)', link: 'Java/basis/java-basic-questions-03' },
      ]
    },
    {
      text: '集合',
      collapsed: false,
      items: [
        { text: 'Java集合常见面试题总结(1)', link: 'Java/collection/java-collection-questions-01' },
        { text: 'Java集合常见面试题总结(2)', link: 'Java/collection/java-collection-questions-02' },
      ]
    },
    {
      text: 'Mybatis',
      collapsed: false,
      items: [
        { text: 'Mybatis常见问题', link: 'MyBatis/mybatis' }, 
      ]
    },

  ]
}

function databaseBar() {
  return [
    {
      text: 'MySQL',
      collapsed: false,
      items: [
        { text: 'MySQL常见面试题', link: 'MySQL/MySQL' }, 
        { text: 'MySQL索引', link: 'MySQL/mysql-indexs' }, 
        { text: '单独：MySQL索引失效', link: 'MySQL/mysql-index-failure' }, 
      ]
    },
    {
      text: 'Redis',
      collapsed: false,
      items: [
        { text: 'Redis常见问题', link: 'Redis/redis-question' },
        { text: 'Redis数据结构', link: 'Redis/redis-data-structure' }, 
        { text: '单独：Redis缓存不一致问题', link: 'Redis/redis-read-and-write-strategies' }, 
        { text: '单独：Redis持久化', link: 'Redis/redis-persistent' }, 
        { text: '场景：设计一个排行榜', link: 'Redis/redis-ranking-list' }, 
      ]
    }, 

  ]
}
function middlewareBar() {
  return [
    {
      text: '消息队列MQ',
      collapsed: false,
      items: [
        { text: 'RocketMQ', link: 'mq/rocketmq-questions' },
       
      ]
    },
  ]
}