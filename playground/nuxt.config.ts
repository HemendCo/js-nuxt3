import myModule from '../src/module'

export default defineNuxtConfig({
  ssr: false,
  modules: [
    myModule
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
