import type { ExtractPropTypes, PropType } from 'vue'

export const configProviderProps = {
  initialZIndex: {
    type: Number as PropType<number>,
    default: 1000,
  },
}

export type ConfigProviderProps = ExtractPropTypes<typeof configProviderProps>
