<template>
  <Repl
    h-full
    :store="store"
    show-compile-output
    auto-resize
    :clear-console="false"
    @keydown="handleKeydown"
  />
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'
import { Repl } from '@vue/repl'
import { ReplStore } from '../utils/replStore'
import '@vue/repl/style.css'

const store = new ReplStore({
  serializedState: location.hash.slice(1),
  showOutput: true,
})

watchEffect(() => history.replaceState({}, '', store.serialize()))

const handleKeydown = (evt: KeyboardEvent) => {
  if ((evt.ctrlKey || evt.metaKey) && evt.code === 'KeyS') {
    evt.preventDefault()
    return
  }
  if ((evt.altKey || evt.ctrlKey) && evt.shiftKey && evt.code === 'KeyF') {
    evt.preventDefault()
    return
  }
}
</script>

<style lang="scss">
.vue-repl {
  --color-branding: var(--noc-color-primary) !important;
  --color-branding-dark: var(--noc-color-primary) !important;
}
</style>
