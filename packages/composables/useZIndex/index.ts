import { ref } from 'vue'
import { useGlobalConfig } from '../useGlobalConfig'

const zIndex = ref(0)

export const useZIndex = () => {
  const initialZIndex = useGlobalConfig('initialZIndex')
  zIndex.value++
  return zIndex.value + initialZIndex.value
}
