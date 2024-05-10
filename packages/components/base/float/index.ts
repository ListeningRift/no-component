import { withComponentInstall } from '@no-component/utils'

import Float from './src/float.vue'
export type { TriggerAction, FloatProps, FloatEmits } from './src/float'
const NocFloat = withComponentInstall(Float)

export default NocFloat
