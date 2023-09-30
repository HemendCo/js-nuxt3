import { useRuntimeConfig, defineNuxtPlugin } from '#imports'
import { App as VueApp } from 'vue'
import * as directives from './directives'

export default defineNuxtPlugin( nuxtApp => {
    const { public: { hemend } } = useRuntimeConfig()
    const vueApp = (nuxtApp.vueApp as VueApp);
    const _directives = directives as Record<string, (options: any, app: VueApp) => void>

    for (const directive in _directives) {
        _directives[directive] (
            hemend.directive &&
            hemend.directive[directive] &&
            typeof hemend.directive[directive] === 'object' ? hemend.directive[directive] : {}, vueApp)
    }
});
