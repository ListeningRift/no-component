import { computed, getCurrentInstance, inject, ref } from 'vue'
import type { ConfigProviderProps } from '@no-component/components/configProvider'
import type { InjectionKey, Ref } from 'vue'

const globalConfigKey: InjectionKey<Ref<ConfigProviderProps>> = Symbol(
  'NOC_GLOBAL_CONFIG_KEY'
)

const defaultGlobalConfig = ref<ConfigProviderProps>({
  initialZIndex: 1000,
})

export function useGlobalConfig<K extends keyof ConfigProviderProps>(
  key: K
): Ref<ConfigProviderProps[K]>
export function useGlobalConfig(): Ref<ConfigProviderProps>
export function useGlobalConfig(key?: keyof ConfigProviderProps) {
  const config = getCurrentInstance()
    ? inject(globalConfigKey, defaultGlobalConfig)
    : defaultGlobalConfig
  if (key) {
    return computed(() => config.value?.[key] ?? defaultGlobalConfig)
  } else {
    return config
  }
}
