import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import router from './router'
import 'windi.css'
import './styles/main.css'
import i18n from './i18n'

const head = createHead()

createApp(App)
  .use(head)
  .use(i18n)
  .use(router)
  .mount('#app')
