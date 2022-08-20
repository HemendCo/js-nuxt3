import { defineNuxtPlugin, addRouteMiddleware, navigateTo } from '#app'
import { useRuntimeConfig } from '#imports'

export default defineNuxtPlugin(() => {
    addRouteMiddleware('auth', (to, from) => {
        const { isLoggedIn } = useAuth()
    
        if (!isLoggedIn()) {
            const { hemend } = useRuntimeConfig()
            const { route } = hemend.middleware.auth;
            return navigateTo(route)
        }
    }, { global: false })
})
