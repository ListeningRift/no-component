<template>
  <div h-full flex flex-col>
    <Header />
    <div w-full flex-grow flex>
      <Menu />
      <Repl :key="modelKey" flex-grow />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import Repl from './components/Repl.vue'
import Header from './components/Header.vue'
import Menu from './components/Menu.vue'

const modelKey = ref(1)
provide('App', {
  modelKey,
})
</script>

<style lang="scss"></style>
