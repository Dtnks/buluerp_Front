import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/assets/style/main.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { useDict } from '@/utils/dict'
import { download } from '@/utils/httpsInstance'
import { parseTime, resetForm, addDateRange, handleTree, selectDictLabel, selectDictLabels } from '@/utils/ruoyi.js'
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')
app.config.globalProperties.useDict = useDict
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.download = download
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm