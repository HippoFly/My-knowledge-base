import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "个人知识库",
  base: '/My-knowledge-base/',
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: nav(),

    sidebar: {
      '/docs/frontend/': { base: '/docs/frontend/', items:frontendBar() },
      '/docs/backend/': { base: '/docs/backend/', items: backendBar() }
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
      items: [{ text: "React", link: "/docs/front-end/react" }],
    },
    {
      text: "后端",
      activeMatch: "/backend/",
      items: [
        {
          text: "Java基础",
          link: "/docs/backend/Java/basis/java-basic-questions-01",
        },
        { text: "RabbitMQ", link: "/docs/back-end/rabbitmq" },
        { text: "ElasticSearch", link: "/docs/back-end/elasticsearch" },
        { text: "Mybatis-Plus", link: "/docs/back-end/mybatis-plus" },
        { text: "SpringBoot项目模版", link: "/docs/back-end/springboot-template" },
      ],
    },

    { text: '知识库', link: '/markdown-examples' }
  ];
}
function frontendBar() {
  return [
    {
      text: '简介',
      collapsed: false,
      items: [
        { text: '什么是 VitePress？', link: 'what-is-vitepress' },
        { text: '快速开始', link: 'getting-started' },
        { text: '路由', link: 'routing' },
        { text: '部署', link: 'deploy' }
      ]
    },
    {
      text: '写作',
      collapsed: false,
      items: [
        { text: 'Markdown 扩展', link: 'markdown' },
        { text: '资源处理', link: 'asset-handling' },
        { text: 'frontmatter', link: 'frontmatter' },
        { text: '在 Markdown 使用 Vue', link: 'using-vue' },
        { text: '国际化', link: 'i18n' }
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
    
  ]
}