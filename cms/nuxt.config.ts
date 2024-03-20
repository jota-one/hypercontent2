// https://v3.nuxtjs.org/api/configuration/nuxt.config

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },

  content: {
    api: {
      baseURL: '/_content',
    },
    documentDriven: true,
  },

  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/plausible',
    '@nuxtjs/tailwindcss',
    '@element-plus/nuxt',
    join(currentDir, 'modules/hypercontent'),
  ],

  runtimeConfig: {
    public: {
      hc: {
        content: {
          api: {
            base: '_hc:api:',
            labels: '__langCode__:labels.json',
            langs: 'langs.json',
            navigation: '__langCode__:navigation.json',
          }
        },
      }
    },
  },

  tailwindcss: {
    config: {
      corePlugins: {
        preflight: false,
      },
    },
  },

  vite: {
    optimizeDeps: {
      include: ['@editorjs/editorjs'],
    },
  },
})
