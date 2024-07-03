// import { defineConfig } from 'vitepress'
import { withMermaid } from "vitepress-plugin-mermaid";



// https://vitepress.dev/reference/site-config
export default withMermaid({
  title: "长风",
  description: "AI / RUST / Architecture",
  themeConfig: {
    logo: { src: '/huayao-logo.svg', width: 32, height: 24 },

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'DeepLearning', link: '/deeplearning/' },
      { text: 'Architecture', link: '/architecture/' },
    ],
    sidebar: {
      "/deeplearning/": [{
        text: '神经网络与深度学习',
        items: [
          { text: '优化神经网络', link: './optimize-neural-network' },
          { text: '深度学习框架(candle)', link: './candle' },
        ]
      }],
      "/architecture/": [{
        text: '系统架构',
        items: [
          { text: '通用的系统架构', link: './general-system-architecture' },
          { text: '股票市场行实时情推送系统', link: './stock-market-quotation-push-system' }
        ]
      }]

    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/wanghuayao' },
    ], footer: {
      message: '',
      copyright: `版权所有 © 2024-${new Date().getFullYear()} huayao.xyz`
    },
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/huayao-logo.svg' }],
    ['meta', { name: 'theme-color', content: '#F8B20A' }],
  ],
})

