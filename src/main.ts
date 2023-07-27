import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { api } from './api'
import { store } from './store'
import '@/assets/css/reset.css'
import '@/assets/css/public.scss'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import ElementPlus from 'element-plus'


createApp(App).use(api).use(router).use(store).use(ElementPlus, { locale }).mount('#app')
