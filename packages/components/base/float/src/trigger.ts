import { defineComponent, cloneVNode, watch } from 'vue'
import { useOnlyChild } from '@no-component/composables'
import { isString } from '@no-component/utils'
import { injectFloatContext } from './float'
import type { ComponentPublicInstance } from 'vue'

export default defineComponent({
  setup(props, { slots }) {
    const { triggerRef, triggerEvent, triggerClass } = injectFloatContext()

    watch(
      [triggerRef, triggerEvent],
      ([newTriggerRef, newTriggerEvent], [oldTriggerRef, oldTriggerEvent]) => {
        if (oldTriggerRef) {
          Object.entries(oldTriggerEvent).forEach(([key, event]) => {
            oldTriggerRef.removeEventListener(key, event)
          })
        }
        if (newTriggerRef) {
          const classNames = isString(triggerClass)
            ? triggerClass
            : triggerClass.join(' ')
          newTriggerRef.classList.add(classNames)
          Object.entries(newTriggerEvent).forEach(([key, event]) => {
            newTriggerRef.addEventListener(key, event)
          })
        }
      }
    )

    return () =>
      cloneVNode(useOnlyChild(slots.default)!, {
        className: 'trigger',
        ref: (el: Element | ComponentPublicInstance | null) =>
          (triggerRef.value = (el as HTMLElement)
            ?.nextElementSibling as HTMLElement),
      })
  },
})
