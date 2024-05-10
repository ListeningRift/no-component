import { createApp } from 'vue'
import '@unocss/reset/tailwind.css'
import 'uno.css'
import './src/style/index.scss'
import App from './src/App.vue'

const app = createApp(App)
app.mount('#app')
