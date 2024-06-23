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
      { text: 'DeepLearning', link: '/deeplearning/outline' },
    ],
    sidebar: [
      // {
      //   text: 'Examples',
      //   items: [
      //     { text: 'Markdown Examples', link: '/markdown-examples' },
      //     { text: 'Runtime API Examples', link: '/api-examples' }
      //   ]
      // }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/wanghuayao' },
    ]
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/huayao-logo.svg' }],
    ['meta', { name: 'theme-color', content: '#F8B20A' }],
  ],
})

