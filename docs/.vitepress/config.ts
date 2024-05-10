import { defineConfig } from 'vitepress'
import viteConfig from './config/vite.config'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'No Component',
  description: 'A Vue3 Component Library.',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Guide', link: '/guide' },
      { text: 'Documents', link: '/documents' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Get Start', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
  vite: viteConfig,
})
