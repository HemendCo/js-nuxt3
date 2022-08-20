import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use({
        install(app, options) {
            app.mixin({
                mounted() {
                    
                }
            })
        }
    })
})