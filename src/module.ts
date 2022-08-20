import { resolve, dirname, basename } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtModule, addPlugin, addComponentsDir } from '@nuxt/kit'
import { NuxtPlugin } from '@nuxt/schema';
import { defu } from 'defu'
import type { ModuleOptions } from './types'
import 'hemend-js-library/dist/require'

const namespace = 'hemend'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: namespace,
    configKey: namespace,
    compatibility: {
      // Semver version of supported nuxt versions
      nuxt: '^3.0.0'
    }
  },
  defaults: {
    namespace,
    component: {
      prefix: 'Hem'
    },
    storage: {
      prefix: namespace,
      driver: 'local',
      ttl: 0
    },
    middleware: {
      auth: {
        route: '/login'
      },
      guest: {
        route: '/'
      },
    },
    api: {
      url: '/',
      routes: []
    },
    directive: {
    },
    flashMessage: {
      rtl: false
    }
  },
  setup (options, nuxt) {
    // nuxt.options.css.push('assets/css/style.scss')

    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir)

    // Default runtimeConfig
    nuxt.options.runtimeConfig.public.hemend = defu(nuxt.options.runtimeConfig.public.hemend, options)
    nuxt.options.runtimeConfig.hemend = defu(nuxt.options.runtimeConfig.hemend, options)
    
    // Resolve config paths
    const cwd = process.cwd()
    const componentsDir = resolve(cwd, 'components')
    const layoutsDir = resolve(cwd, 'layouts')
    const pagesDir = resolve(cwd, 'pages')
    const pluginsDir = resolve(cwd, 'plugins')
    const staticDir = resolve(cwd, 'static')
    const storeDir = resolve(cwd, 'store')

    console.log(cwd)

    addComponentsDir({
      path: resolve(runtimeDir, 'components'),
      pathPrefix: false,
      prefix: 'Hem',
      level: 999,
      global: true
    })

    // add all of the initial plugins
    // mode: all | server | client
    const pluginsToSync: Array<NuxtPlugin> = [
      {
        src: './plugin',
        mode: 'client'
      },
      {
        src: './plugins/mixin',
        mode: 'client'
      },
      {
        src: './plugins/directive',
        mode: 'client'
      },
      {
        src: './plugins/flash-message',
        mode: 'client'
      },
      {
        src: './middleware/auth',
        mode: 'client'
      },
      {
        src: './middleware/guest',
        mode: 'client'
      }
    ]
    
    for (const plg of pluginsToSync) {
      const fileDir = dirname(plg.src);
      const fileName = basename(plg.src);

      addPlugin({
        src: resolve(runtimeDir, fileDir, fileName),
        mode: plg.mode
      })
    }

    nuxt.hook('autoImports:dirs', (dirs) => {
      dirs.push(resolve(runtimeDir, 'composables'))
    })
  }
})
