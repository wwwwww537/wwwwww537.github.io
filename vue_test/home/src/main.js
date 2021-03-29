import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import jquery from 'jquery'

createApp(App).use(router,jquery).mount('#app')
