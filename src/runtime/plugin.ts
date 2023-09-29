
import '@hemend/js-library/dist/require'
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'
import * as helpers from './helpers/index'
import * as libs from '@hemend/js-library'

import '../assets/css/style.scss';

export default defineNuxtPlugin((nuxtApp) => {
  const { hemend } = useRuntimeConfig()

  console.log('ff', hemend)

  nuxtApp.provide('hemend', {
    storage() {
      return libs.storage(hemend.storage)
    },
    storageBridge() {
      return libs.storageBridge;
    },
    request() {
      return helpers.request(hemend.api)
    },
    flashMessage() {
      const $flashMessage = nuxtApp.vueApp.config.globalProperties.$flashMessage;
      return helpers.flashMessage($flashMessage, hemend.flashMessage)
    }
  });
})
