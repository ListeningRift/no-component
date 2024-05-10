import { warn } from '@no-component/utils'
import type { Slot, useAttrs } from 'vue'

export const useOnlyChild = (
  slot: Slot | undefined,
  attrs?: ReturnType<typeof useAttrs>
) => {
  if (!slot) return null
  const children = slot(attrs)
  if (!children) return null
  if (children.length > 1) {
    warn('Only one child is allowed.')
  }
  return children[0]
}
