import { useRuntimeConfig, defineNuxtPlugin, addRouteMiddleware, navigateTo } from '#imports'

export default defineNuxtPlugin(() => {
  addRouteMiddleware('guest', (to, from) => {
    const { isLoggedIn } = useAuth()
    
    if (isLoggedIn()) {
      const { public: { hemend } } = useRuntimeConfig()
      const { route } = hemend.middleware.guest;
      return navigateTo(route)
    }
  }, { global: false })
})