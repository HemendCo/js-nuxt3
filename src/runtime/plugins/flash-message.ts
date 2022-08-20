import '../../assets/css/style.scss';

import { defineNuxtPlugin } from '#app'
import FlashMessage from '@smartweb/vue-flash-message';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(FlashMessage, {
        time: 8000,
        strategy: 'multiple'
    })
})