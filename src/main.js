import { createApp } from 'vue'
import App from '@/App.vue' // 引入 APP 页面组建
import router from '@/router'

createApp(App).use(router).mount('#app')
