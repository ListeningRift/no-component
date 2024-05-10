import * as components from './components'
import type { App } from 'vue'

export * from './components'
export * from './baseComponents'
export * from '@no-component/composables'
export * from '@no-component/constants'
export * from '@no-component/directives'
export * from '@no-component/utils'

export default {
  install(app: App) {
    Object.entries(components).forEach(([, component]) => {
      app.use(component)
    })
  },
}
