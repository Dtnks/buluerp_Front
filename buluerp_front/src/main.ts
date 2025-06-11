import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/assets/style/main.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { useDict } from '@/utils/dict'
import { download } from '@/utils/httpsInstance'
import { parseTime, resetForm, addDateRange } from '@/utils/ruoyi.js'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
const pinia = createPinia()

const app = createApp(App)
app.use(router).use(ElementPlus, { locale: zhCn }).use(pinia)
app.mount('#app')
app.config.globalProperties.useDict = useDict
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.download = download
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
