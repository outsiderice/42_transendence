import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import '@fontsource/oswald'

const app = createApp(App)

import router from './router'
app.use(router)

import { createPinia } from 'pinia'
const pinia = createPinia();
app.use(pinia)

app.mount('#app')
