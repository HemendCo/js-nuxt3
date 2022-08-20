import { defineNuxtPlugin, addRouteMiddleware, navigateTo } from '#app'
import { useRuntimeConfig } from '#imports'

export default defineNuxtPlugin(() => {
    addRouteMiddleware('guest', (to, from) => {
        const { isLoggedIn } = useAuth()
        
        if (isLoggedIn()) {
            const { hemend } = useRuntimeConfig()
            const { route } = hemend.middleware.guest;
            return navigateTo(route)
        }
    }, { global: false })
})