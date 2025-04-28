import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/assets/style/main.css'
import App from './App.vue'
import router from './router'
<<<<<<< HEAD
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
=======


>>>>>>> 57f1361 (第一次提交，完成两个页面)
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')
