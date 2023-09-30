import { useRuntimeConfig, defineNuxtPlugin, addRouteMiddleware, navigateTo } from '#imports'

export default defineNuxtPlugin(() => {
  addRouteMiddleware('auth', (to, from) => {
    const { isLoggedIn } = useAuth()

    if (!isLoggedIn()) {
      const { public: { hemend } } = useRuntimeConfig()
      const { route } = hemend.middleware.auth;
      return navigateTo(route)
    }
  }, { global: false })
})
