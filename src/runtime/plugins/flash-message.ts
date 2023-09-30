import { App as VueApp } from 'vue'

import { defineNuxtPlugin } from '#imports'
import FlashMessage from '@smartweb/vue-flash-message';

export default defineNuxtPlugin((nuxtApp) => {
    const vueApp = (nuxtApp.vueApp as VueApp);
    vueApp.use(FlashMessage, {
        //@ts-ignore
        time: 8000,
        strategy: 'multiple'
    })
})