import { defineNuxtPlugin } from '#imports'
import { App as VueApp } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
    const vueApp = (nuxtApp.vueApp as VueApp);

    vueApp.use({
        //@ts-ignore
        install(app: VueApp, options: any[]) {
            app.mixin({
                mounted() {
                    
                }
            })
        }
    })
})