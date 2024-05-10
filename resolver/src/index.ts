import { camelCase } from 'unplugin-vue-components'
import type { ComponentResolver } from 'unplugin-vue-components/types'

export interface NocResolveOptions {
  cjs?: boolean
}

function getSideEffects(name: string, options: NocResolveOptions = {}) {
  const { cjs = false } = options
  return `no-component/${
    cjs ? 'cjs' : 'esm'
  }/components/${name}/style/${name}.css`
}

const resolveComponent = (name: string, options: NocResolveOptions = {}) => {
  if (!name.match(/^Noc[A-Z]/)) return

  const { cjs = false } = options
  return {
    name,
    from: `no-component/${cjs ? 'cjs' : 'esm'}`,
    sideEffects: getSideEffects(camelCase(name.slice(3)), options),
  }
}

export const NocResolver = (
  options: NocResolveOptions = {}
): ComponentResolver[] => {
  return [
    {
      type: 'component',
      resolve: (name: string) => resolveComponent(name, options),
    },
  ]
}
