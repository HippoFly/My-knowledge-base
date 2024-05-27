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
      items: [
        { text: "Vitepress", link: "/docs/frontend/Vitepress/vitepress-tutorial" },
      ],
    },
    {
      text: "后端",
      activeMatch: "/backend/",
      items: [
        { text: "Java基础", link: "/docs/backend/Java/basis/java-basic-questions-01", },
        { text: "Mybatis", link: "/docs/backend/MyBatis/mybatis" },
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