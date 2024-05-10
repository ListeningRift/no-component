<template>
  <div class="home" h-full flex flex-col>
    <base-header></base-header>
    <div flex flex-grow flex-col items-center justify-center>
      <div text-12 font-700 line-height-14 class="title">No Component</div>
      <div text-6 font-600 line-height-8>A Vue3 Component Library.</div>
      <div text-4 font-500 line-height-7>
        Supports custom themes. Provides custom basic components.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
</script>

<style lang="scss" scoped>
.title {
  color: transparent;
  background: linear-gradient(315deg, var(--noc-color-primary) -45%, #42b883);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: linear-gradient(
    315deg,
    var(--noc-color-primary) -45%,
    #42b883
  );
}
</style>
