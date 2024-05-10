import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import unocss from 'unocss/vite'
import { presetAttributify, presetUno } from 'unocss'
import DefineOptions from 'unplugin-vue-define-options/vite'
import { unoCssColors as colors } from '@no-component/build-utils'

export default defineConfig({
  define: {
    __NODE_ENV__: JSON.stringify('development'),
  },
  plugins: [
    vue(),
    DefineOptions(),
    unocss({
      presets: [presetAttributify(), presetUno()],
      theme: {
        colors,
      },
    }),
  ],
})
