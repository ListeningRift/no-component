declare module 'vue' {
  export interface GlobalComponents {
    // base components
    NocFloat: typeof import('no-component')['NocFloat']

    // components
    NocPopover: typeof import('no-component')['NocPopover']
  }
}

export {}
