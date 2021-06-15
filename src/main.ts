import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import { Connection } from '@solana/web3.js'
import { SERUM_RPC_ENDPOINT } from '@/utils'
import NProgress from 'nprogress'
import { vueAxios } from '@baloise/vue-axios'
import { VueClipboard } from '@soerenmartius/vue3-clipboard'
import Toast, { PluginOptions, POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import App from './App.vue'
import router from './router'
import 'windi.css'
import './styles/main.css'
import i18n from './i18n'

const head = createHead()

const app = createApp(App)

const toastOptions: PluginOptions = {
  position: POSITION.TOP_RIGHT,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: true,
  hideProgressBar: true,
  icon: true,
  transition: 'Vue-Toastification__bounce',
  timeout: 2000,
}

app.use(head)
app.use(i18n)
app.use(router)
app.use(vueAxios)
app.use(VueClipboard)
app.use(Toast, toastOptions)
app.mount('#app')

app.config.globalProperties.$web3 = new Connection(SERUM_RPC_ENDPOINT, 'confirmed')

router.beforeEach(() => { NProgress.start() })
router.afterEach(() => { NProgress.done() })
