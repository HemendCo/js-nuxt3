import { defineNuxtConfig } from 'nuxt'
import hemendJSNuxt3 from '..'

export default defineNuxtConfig({
  ssr: false,
  modules: [
    hemendJSNuxt3
  ],
  hemend: {
    api: {
      url: 'https://sms.hemend.com/api/admin/1/',
      routes: [{
        name: 'admin',
        url: 'https://sms.hemend.com/api/admin/2/'
      }]
    },
    flashMessage: {
      rtl: true
    }
  }
})
