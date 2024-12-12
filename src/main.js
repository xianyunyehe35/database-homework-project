import './assets/main.css'//全局默认样式
import 'element-plus/dist/index.css' // 确保 Element Plus 样式被导入
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import persistedStatePlugin from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
pinia.use(persistedStatePlugin)

app.use(pinia)
app.use(router)
app.mount('#app')
