import type { App, Component, Plugin } from 'vue'

export type SFCWithInstall<T> = T & Plugin

export const withComponentInstall = <T, K extends any[]>(
  main: T,
  child?: K
) => {
  ;(main as SFCWithInstall<T>).install = (app: App): void => {
    const components = [main, ...(child ?? [])] as Component[]
    for (const component of components) {
      app.component(component.name!, component)
    }
  }

  return main as SFCWithInstall<T>
}
