import { resolve } from 'path'
import UnoCss from 'unocss/vite'
import { presetAttributify, presetUno } from 'unocss'
import { root, unoCssColors } from '@no-component/build-utils'
import DefineOptions from 'unplugin-vue-define-options/vite'
import Components from 'unplugin-vue-components/vite'
import Inspect from 'vite-plugin-inspect'
import type { Alias, UserConfig, PluginOption } from 'vite'

const alias: Alias[] = [
  { find: '@/', replacement: `${resolve(__dirname, '../')}/` },
]
if (process.env.DOC_ENV === 'development') {
  alias.push(
    {
      find: /^no-component(\/(esm|cjs))?$/,
      replacement: resolve(root, 'packages/no-component/index.ts'),
    },
    {
      find: /^no-component\/(esm|cjs)\/([^/]+\.[^/]+)$/,
      replacement: `${resolve(root, 'packages/no-component')}/$2`,
    },
    {
      find: /^no-component\/(esm|cjs)\/(.*\/.*)$/,
      replacement: `${resolve(root, 'packages')}/$2`,
    }
  )
}

export default {
  resolve: {
    alias,
  },
  plugins: [
    DefineOptions(),
    Components({
      dirs: ['.vitepress/components'],
      allowOverrides: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      deep: true,
    }),
    UnoCss({
      presets: [presetAttributify(), presetUno()],
      theme: {
        colors: unoCssColors,
      },
    }),
  ],
} as UserConfig
