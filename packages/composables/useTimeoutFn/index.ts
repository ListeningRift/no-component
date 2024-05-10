import { tryOnScopeDispose } from '@vueuse/core'
import type { Fn } from '@no-component/utils'

export const useTimeoutFn = () => {
  let timer: ReturnType<typeof setTimeout>

  const clearTimer = () => clearTimeout(timer)

  const setTimer = (cb: Fn, delay: number) => {
    clearTimer()
    if (delay) {
      timer = setTimeout(cb, delay)
    } else {
      cb()
    }
  }

  tryOnScopeDispose(() => clearTimer())

  return {
    clearTimer,
    setTimer,
  }
}
