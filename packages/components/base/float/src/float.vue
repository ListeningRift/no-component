<template>
  <trigger>
    <slot name="trigger" />
  </trigger>
  <Teleport :disabled="props.teleportTo === false" :to="teleportTo">
    <div
      v-if="visible"
      ref="contentRef"
      :class="props.contentClass"
      :style="{
        zIndex,
        position: strategy,
        top: `${y}px`,
        left: `${x}px`,
      }"
    >
      <div :class="ns.e('content')" role="tooltip">
        <slot name="content" />
      </div>
      <div ref="arrowRef" :class="ns.e('arrow')">
        <div ref="arrowContentRef" :class="ns.e('arrow-content')" />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useVModel } from '@vueuse/core'
import { useFloating, useZIndex, useTimeoutFn } from '@no-component/composables'
import { getNamespace, isBoolean, isArray } from '@no-component/utils'
import {
  floatEmits,
  floatProps,
  provideFloatContext,
  handleTriggerAction,
} from './float'
import Trigger from './trigger'
import type { TriggerActionForEventMap } from './float'
import type { Placement, Strategy } from '@no-component/composables'

defineOptions({
  name: 'NocFloat',
  inheritAttrs: false,
})

const props = defineProps(floatProps)
const emits = defineEmits(floatEmits)
const ns = getNamespace('float')

const visible = useVModel(props, 'visible', emits, {
  passive: true,
})
const zIndex = useZIndex()
const placement = ref<Placement>(props.placement)
watchEffect(() => {
  placement.value = props.placement
})
const strategy = ref<Strategy>(props.strategy)
watchEffect(() => {
  strategy.value = props.strategy
})
const triggerAction = computed(() => props.triggerAction)
const teleportTo = computed(() => {
  return (isBoolean(props.teleportTo) ? 'body' : props.teleportTo) as string
})

const triggerRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()
const arrowRef = ref<HTMLElement>()
const arrowContentRef = ref<HTMLElement>()

const toggleVisible = (e?: Event) => {
  let delayTime = 0
  let newVisible = true

  if (visible.value) {
    delayTime = props.closeDelay
    newVisible = false
  } else {
    delayTime = props.openDelay
    newVisible = true
  }

  const { setTimer } = useTimeoutFn()
  setTimer(() => {
    visible.value = newVisible
    emits('visibleChange', newVisible, e)
  }, delayTime)
}

const triggerEvent = ref<TriggerActionForEventMap>({})

watchEffect(() => {
  triggerEvent.value = {}
  if (isArray(triggerAction.value)) {
    triggerAction.value.forEach(action => {
      Object.assign(
        triggerEvent.value,
        handleTriggerAction(action, toggleVisible, contentRef)
      )
    })
  } else {
    Object.assign(
      triggerEvent.value,
      handleTriggerAction(triggerAction.value, toggleVisible, contentRef)
    )
  }
})

provideFloatContext({
  triggerRef,
  triggerEvent,
  triggerClass: props.triggerClass,
})

const {
  x,
  y,
  placement: currentPlacement,
  middlewareData,
} = useFloating(triggerRef, contentRef, {
  placement,
  strategy,
  offset: props.offset ?? 12,
  shift: props.shift,
  flip: props.flip,
  arrow: props.showArrow
    ? {
        element: arrowRef,
      }
    : undefined,
  size: props.size,
  autoPlacement: props.autoPlacement,
  hide: props.hide,
  inline: props.inline,
})

// handle arrow style (position and size)
watchEffect(() => {
  const currentSide = currentPlacement.value.split('-')[0]

  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[currentSide]!

  const size =
    staticSide === 'left' || staticSide === 'right'
      ? {
          height: '18px',
          width: '9px',
        }
      : {
          height: '9px',
          width: '18px',
        }

  const position = {}
  if (middlewareData.value.arrow) {
    const { x: arrowX, y: arrowY } = middlewareData.value.arrow
    Object.assign(position, {
      left: arrowX ? `${arrowX}px` : '',
      top: arrowY ? `${arrowY}px` : '',
      [staticSide]: '-9px',
    })
  }

  const transform = {
    top: 'translate(3px, -6px)',
    right: 'translate(3px, 3px)',
    bottom: 'translate(3px, 3px)',
    left: 'translate(-6px, 3px)',
  }[currentSide]

  if (arrowRef.value) {
    Object.assign(arrowRef.value.style, {
      ...position,
      ...size,
    })
    Object.assign(arrowContentRef.value!.style, {
      transform: `${transform} rotate(45deg)`,
    })
  }
})
</script>
