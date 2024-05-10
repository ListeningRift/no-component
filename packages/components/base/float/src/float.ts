import { provide, inject } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { error, isBoolean, isObject } from '@no-component/utils'
import type {
  Placement,
  Strategy,
  OffsetOptions,
  ShiftOptions,
  FlipOptions,
  SizeOptions,
  AutoPlacementOptions,
  HideOptions,
  InlineOptions,
} from '@no-component/composables'
import type { PropType, InjectionKey, Ref, ExtractPropTypes } from 'vue'

export type TriggerAction = 'click' | 'hover' | 'focus' | 'contextmenu'

export const floatProps = {
  // Is float content visible
  visible: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  // float content trigger action
  triggerAction: {
    type: [String, Array] as PropType<TriggerAction | TriggerAction[]>,
    default: 'hover',
  },
  // float content's placement
  placement: {
    type: String as PropType<Placement>,
    default: 'bottom',
  },
  strategy: {
    type: String as PropType<Strategy>,
    default: 'absolute',
  },
  // the time delay float content open
  openDelay: {
    type: Number as PropType<number>,
    default: 0,
  },
  // the time delay float content close
  closeDelay: {
    type: Number as PropType<number>,
    default: 0,
  },
  // trigger element class name
  triggerClass: {
    type: [String, Array] as PropType<string | string[]>,
    default: '',
  },
  // content element class name
  contentClass: {
    type: [String, Array] as PropType<string | string[]>,
    default: '',
  },
  // content teleport to
  teleportTo: {
    type: [String, Boolean] as PropType<string | boolean>,
    default: 'body',
  },
  // floating-ui offset options
  offset: {
    type: Object as PropType<OffsetOptions>,
  },
  // floating-ui shift options
  shift: {
    type: [Boolean, Object] as PropType<boolean | ShiftOptions>,
    default: true,
  },
  // floating-ui flip options
  flip: {
    type: [Boolean, Object] as PropType<boolean | FlipOptions>,
    default: true,
  },
  // floating-ui arrow options
  showArrow: {
    type: Boolean as PropType<boolean>,
  },
  // floating-ui size options
  size: {
    type: Object as PropType<SizeOptions>,
  },
  // floating-ui autoPlacement options
  autoPlacement: {
    type: [Boolean, Object] as PropType<boolean | AutoPlacementOptions>,
    default: false,
  },
  // floating-ui hide options
  hide: {
    type: [Boolean, Object] as PropType<boolean | HideOptions>,
    default: true,
  },
  // floating-ui inline options
  inline: {
    type: [Boolean, Object] as PropType<boolean | InlineOptions>,
    default: true,
  },
}

export type FloatProps = ExtractPropTypes<typeof floatProps>

export const floatEmits = {
  'update:visible': (visible: boolean) => isBoolean(visible),
  visibleChange: (visible: boolean, e?: Event) => {
    if (!e) {
      return isBoolean(visible)
    } else {
      return isBoolean(visible) && isObject(e)
    }
  },
}

export type FloatEmits = typeof floatEmits

interface FloatContext {
  triggerRef: Ref<HTMLElement | undefined>
  triggerEvent: Ref<TriggerActionForEventMap>
  triggerClass: string | string[]
}

const FLOAT_CONTEXT_KEY: InjectionKey<FloatContext> =
  Symbol('NOC_FLOAT_CONTEXT')

export type ToggleVisibleEvent = (e?: Event) => void

export const provideFloatContext = ({
  triggerRef,
  triggerEvent,
  triggerClass,
}: FloatContext) => {
  provide(FLOAT_CONTEXT_KEY, {
    triggerRef,
    triggerEvent,
    triggerClass,
  })
}

export const injectFloatContext = () => {
  const context = inject(FLOAT_CONTEXT_KEY, undefined)
  if (!context) {
    throw error('Trigger should be used inside Popup.', 'Trigger')
  }
  return context
}

export type TriggerActionForEventMap = Record<string, ToggleVisibleEvent>

export const handleTriggerAction = (
  action: TriggerAction,
  event: ToggleVisibleEvent,
  contentRef: Ref<HTMLElement | undefined>
) => {
  const actionForEventMap: TriggerActionForEventMap = {}
  switch (action) {
    case 'click':
      actionForEventMap['click'] = event
      onClickOutside(contentRef, (e: Event) => event(e))
      break
    case 'hover':
      actionForEventMap['mouseenter'] = event
      actionForEventMap['mouseleave'] = event
      break
    case 'focus':
      actionForEventMap['focus'] = event
      actionForEventMap['blur'] = event
      break
    case 'contextmenu':
      actionForEventMap['contextmenu'] = event
      onClickOutside(contentRef, (e: Event) => event(e))
      break
    default:
  }
  return actionForEventMap
}
