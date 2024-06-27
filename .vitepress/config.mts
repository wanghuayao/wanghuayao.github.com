import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "长风",
  description: "AI / RUST / Architecture",
  themeConfig: {
    logo: { src: '/huayao-logo.svg', width: 32, height: 24 },

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'DeepLearning', link: '/deeplearning/' },
    ],
    sidebar: {
      "/deeplearning/": [{
        text: '神经网络与深度学习',
        items: [
          { text: '深度学习框架(candle)', link: './candle' },
        ]
      }]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/wanghuayao' },
    ], footer: {
      message: '基于 MIT 许可发布',
      copyright: `版权所有 © 2024-${new Date().getFullYear()} huayao.xyz`
    },
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/huayao-logo.svg' }],
    ['meta', { name: 'theme-color', content: '#F8B20A' }],
  ],
})

