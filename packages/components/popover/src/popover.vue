<template>
  <noc-float
    :trigger-class="[ns.e('trigger')]"
    :content-class="[ns.b()]"
    show-arrow
    placement="top"
  >
    <template #trigger>
      <div
        style="margin-left: 100px; margin-right: 100px; border: 1px solid black"
      >
        trigger
      </div>
    </template>
    <template #content>
      <div>content</div>
    </template>
  </noc-float>
</template>

<script lang="ts" setup>
import { getNamespace } from '@no-component/utils'
import NocFloat from '../../base/float'

defineOptions({
  name: 'NocPopover',
  inheritAttrs: false,
})

const ns = getNamespace('popover')
</script>
