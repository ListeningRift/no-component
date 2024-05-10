import { onMounted, ref, unref, watchEffect } from 'vue'
import { isDefined, unrefElement } from '@vueuse/core'
import {
  computePosition,
  offset,
  shift,
  flip,
  arrow,
  size,
  autoPlacement,
  hide,
  inline,
} from '@floating-ui/dom'
import { isObject, keysOf } from '@no-component/utils'
import type { Ref } from 'vue'
import type { Middleware, MiddlewareData } from '@floating-ui/dom'
import type {
  Placement,
  Strategy,
  OffsetOptions,
  ShiftOptions,
  FlipOptions,
  ArrowOptions,
  SizeOptions,
  AutoPlacementOptions,
  HideOptions,
  InlineOptions,
} from './types'

export type {
  Placement,
  Strategy,
  OffsetOptions,
  ShiftOptions,
  FlipOptions,
  ArrowOptions,
  SizeOptions,
  AutoPlacementOptions,
  HideOptions,
  InlineOptions,
}

export interface FloatingOptions {
  // Popup placement
  placement: Ref<Placement>
  // Popup CSS position, 'fixed' or 'absolute'
  strategy: Ref<Strategy>
  // floating-ui offset options
  offset: OffsetOptions
  // floating-ui shift options
  shift: boolean | ShiftOptions
  // floating-ui flip options
  flip: boolean | FlipOptions
  // floating-ui arrow options
  arrow: ArrowOptions
  // floating-ui size options
  size: SizeOptions
  // floating-ui autoPlacement options
  autoPlacement: boolean | AutoPlacementOptions
  // floating-ui hide options
  hide: boolean | HideOptions
  // floating-ui inline options
  inline: boolean | InlineOptions
}

const handleMiddleware = <K extends keyof FloatingOptions>(
  option: FloatingOptions[K] | undefined,
  middleware: (options?: any) => Middleware
) => {
  if (isDefined(option)) {
    if (option === true) {
      return middleware()
    } else if (option === false) {
      return undefined
    } else {
      if (isObject(option)) {
        const newOptions = {} as Record<string, any>
        keysOf(option).forEach(key => {
          newOptions[key] = unref(option[key])
        })
        return middleware(newOptions)
      }
      return middleware(option)
    }
  } else {
    return undefined
  }
}

const defaultOptions = {
  placement: ref('top'),
  strategy: ref('absolute'),
  shift: true,
  flip: true,
  hide: true,
} as Partial<FloatingOptions>

export const useFloating = (
  triggerRef: Ref<HTMLElement | undefined>,
  contentRef: Ref<HTMLElement | undefined>,
  options: Partial<FloatingOptions> = defaultOptions
) => {
  const x = ref<number>()
  const y = ref<number>()
  const middlewareData = ref<MiddlewareData>({})

  const states = {
    x,
    y,
    placement: options.placement!,
    strategy: options.strategy!,
    middlewareData,
  } as const

  const update = async () => {
    const triggerEl = unrefElement(triggerRef)
    const contentEl = unrefElement(contentRef)
    if (!triggerEl || !contentEl) return

    const middleware = [
      handleMiddleware(options.offset, offset),
      handleMiddleware(options.shift, shift),
      handleMiddleware(options.flip, flip),
      handleMiddleware(options.size, size),
      handleMiddleware(options.autoPlacement, autoPlacement),
      handleMiddleware(options.hide, hide),
      handleMiddleware(options.inline, inline),
      handleMiddleware(options.arrow, arrow),
    ]

    const data = await computePosition(triggerEl, contentEl, {
      placement: unref(options.placement),
      strategy: unref(options.strategy),
      middleware,
    })
    keysOf(states).forEach(key => {
      states[key]!.value = data[key]
    })
  }

  onMounted(() => {
    watchEffect(() => {
      update()
    })
  })

  return {
    ...states,
    update,
  }
}
