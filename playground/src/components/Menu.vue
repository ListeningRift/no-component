<template>
  <div
    ref="resizeBar"
    class="menu"
    w-0
    h-full
    relative
    overflow-visible
    b-r
    b-r-border
  >
    <div w-full h-full overflow-y-auto overflow-x-hidden p-2>
      <div v-for="group in list" :key="group.title" m-b-4 overflow-x-hidden>
        <span class="component-group-title">{{ group.title }}</span>
        <div
          v-for="component in group.children"
          :key="component.title"
          m-t-2
          p-l-4
          p-y-1
          w-full
          text-12px
          truncate
          b-rd-0.5
          hover="bg-grey cursor-pointer"
          @click="setFile(component.title)"
        >
          {{ component.title }}
        </div>
      </div>
    </div>
    <div
      ref="resizeLine"
      class="resize-line"
      absolute
      top-0
      left-full
      h-full
      w-2
      bg-border
      cursor="ew-resize col-resize"
      z-10
      opacity-0
      hover:opacity-100
      flex-col
      justify-center
      text-center
      :class="foldState ? 'display-none' : 'flex'"
      @mousedown="onResize"
    >
      <div line-height-2>.</div>
      <div line-height-2>.</div>
      <div line-height-2>.</div>
    </div>
    <div
      class="menu-fold"
      absolute
      bottom-0
      left-full
      w-6
      h-6
      bg-border
      flex
      justify-center
      text-center
      cursor-pointer
      z-10
      opacity-0
      hover:opacity-100
      @click="onFoldChange"
    >
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import { utoa } from '../utils/encode'

const resizeBar = ref<HTMLElement>()
const resizeLine = ref<HTMLElement>()

const onResize = (e: MouseEvent) => {
  const startX = e.clientX
  const startWidth = resizeBar.value?.getBoundingClientRect().width
  if (resizeLine.value) resizeLine.value.style.opacity = '1'

  const onMove = (e: MouseEvent) => {
    const diff = e.clientX - startX
    if (resizeBar.value && startWidth)
      resizeBar.value.style.width = `${startWidth + diff}px`
  }
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', () => {
    window.removeEventListener('mousemove', onMove)
    if (resizeLine.value) {
      resizeLine.value.style.opacity = ''
    }
  })
  e.preventDefault()
}

const foldState = ref(true)
const onFoldChange = () => {
  if (resizeBar.value) {
    if (foldState.value === true) {
      resizeBar.value.style.width = '12.5rem'
      resizeBar.value.style.minWidth = '7.5rem'
    } else {
      resizeBar.value.style.width = '0px'
      resizeBar.value.style.minWidth = '0px'
    }
  }
  foldState.value = !foldState.value
}

const list = [
  {
    title: 'General',
    children: [],
  },
  {
    title: 'Feedback',
    children: [
      {
        title: 'Popover',
      },
    ],
  },
]

const context = inject('App') as any
const setFile = (file: string) => {
  fetch(`../../ComponentList/${file}.vue?raw`).then(res => {
    res.text().then(res => {
      history.replaceState(
        {},
        '',
        `#${utoa(
          JSON.stringify({
            'App.vue': res
              .match(/export default "(.+)"/)?.[1]
              .replace(/\\r\\n/g, '\n')
              .replace(/\\"/g, '"'),
          })
        )}`
      )
      context.modelKey.value++
    })
  })
}
</script>
