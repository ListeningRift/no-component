import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'
import DefineOption from 'unplugin-vue-define-options/vite'

export default defineConfig({
  plugins: [Vue(), DefineOption()],
  optimizeDeps: {
    disabled: true,
  },
  test: {
    clearMocks: true,
    environment: 'jsdom',
    transformMode: {
      web: [/\.[jt]sx$/],
    },
  },
})
