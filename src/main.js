import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import Avatar from 'primevue/avatar'
import Ripple from 'primevue/ripple'
import StyleClass from 'primevue/styleclass'

import 'primeicons/primeicons.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: Aura,
    options: {
      prefix: 'p', // 前綴，預設為 p
      darkModeSelector: 'system',
      cssLayer: false,
    },
  },
})

app.component('Button', Button)
app.component('Drawer', Drawer)
app.component('Avatar', Avatar)
app.directive('ripple', Ripple)
app.directive('styleclass', StyleClass)

app.mount('#app')
