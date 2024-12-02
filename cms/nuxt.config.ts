// https://v3.nuxtjs.org/api/configuration/nuxt.config

import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

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

  imports: {
    dirs: ['types/**'],
  },

  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/plausible',
    '@nuxtjs/tailwindcss',
    join(currentDir, 'modules/hypercontent'),
  ],

  runtimeConfig: {
    public: {
      hypercontent: {
        content: {
          api: {
            base: '_hc:api:',
            labels: '__langCode__:labels.json',
            langs: 'langs.json',
            navigation: '__langCode__:navigation.json',
          },
        },
      },
    },
  },

  tailwindcss: {
    config: {
      safelist: [
        'grid-cols-1',
        'grid-cols-2',
        'grid-cols-3',
        'grid-cols-4',
        'grid-cols-5',
        'grid-cols-6',
        'grid-cols-7',
        'grid-cols-8',
        'grid-cols-9',
        'grid-cols-10',
        'grid-cols-11',
        'grid-cols-12',
        'col-span-1',
        'col-span-2',
        'col-span-3',
        'col-span-4',
        'col-span-5',
        'col-span-6',
        'col-span-7',
        'col-span-8',
        'col-span-9',
        'col-span-10',
        'col-span-11',
        'col-span-12',
      ],
    },
  },
})
