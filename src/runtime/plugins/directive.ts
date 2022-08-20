import { defineNuxtPlugin } from '#app'
import { useRuntimeConfig } from '#imports'
import * as directives from './directives'

export default defineNuxtPlugin( nuxtApp => {
    const { hemend } = useRuntimeConfig()

    for (const directive in directives) {
        directives[directive] (
            hemend.directive &&
            hemend.directive[directive] &&
            typeof hemend.directive[directive] === 'object' ? hemend.directive[directive] : {}, nuxtApp.vueApp)
    }
});
