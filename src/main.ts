import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import { Connection } from '@solana/web3.js'
import { SERUM_RPC_ENDPOINT } from '@/utils'
import NProgress from 'nprogress'
import { vueAxios } from '@baloise/vue-axios'
import { VueClipboard } from '@soerenmartius/vue3-clipboard'
import App from './App.vue'
import router from './router'
import 'windi.css'
import './styles/main.css'
import i18n from './i18n'

const head = createHead()

const app = createApp(App)

app.use(head)
app.use(i18n)
app.use(router)
app.use(vueAxios)
app.use(VueClipboard)
app.mount('#app')

app.config.globalProperties.$web3 = new Connection(SERUM_RPC_ENDPOINT, 'confirmed')

router.beforeEach(() => { NProgress.start() })
router.afterEach(() => { NProgress.done() })
