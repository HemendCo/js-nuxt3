
import '@hemend/js-library/dist/require'
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'
import * as helpers from './helpers/index'
import * as libs from '@hemend/js-library'
import { FlashMessagePlugin } from '@smartweb/vue-flash-message';
import { ApiOptions } from '../types';

import '../assets/css/style.scss';

export default defineNuxtPlugin((nuxtApp) => {
  const { public: { hemend } } = useRuntimeConfig()

  nuxtApp.provide('hemend', {
    storage() {
      return libs.storage(hemend.storage)
    },
    storageBridge() {
      return libs.storageBridge;
    },
    request() {
      return helpers.request((hemend.api as ApiOptions))
    },
    flashMessage() {
      const $flashMessage = (nuxtApp.vueApp.config.globalProperties.$flashMessage as FlashMessagePlugin);
      return helpers.flashMessage($flashMessage, hemend.flashMessage)
    }
  });
})
