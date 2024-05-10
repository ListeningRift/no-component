<script setup>
import { useData } from 'vitepress'
import { useLang } from '@/composables/useLang'
import locale from '@/locale/components/float'

const { params } = useData()
const { t } = useLang(locale, params.value.lang)
console.log(params)
</script>

<pre>{{ t('intro') }}</pre>

<!-- @content -->
