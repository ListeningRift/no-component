<template>
  <!-- <vp-nav></vp-nav> -->
  <header class="nav" p-x-8 h-16 flex>
    <div class="header-title" text-4 font-600 flex-shrink-0>
      <a href="/">No Component</a>
    </div>
    <div class="header-nav" text-14px font-500 m-l-auto>
      <a href="/guide">Guide</a>
      <a href="/documents">Documents</a>
    </div>
  </header>
</template>

<script setup lang="ts">
import VpNav from 'vitepress/dist/client/theme-default/components/VPNav.vue'
</script>

<style lang="scss">
.nav {
  & > div {
    display: flex;
    align-items: center;
    height: 100%;

    & > a {
      cursor: pointer;
      margin-left: 24px;
      transition: color 0.25s;

      &:hover {
        color: var(--noc-color-primary);
      }
    }
  }
}
</style>
