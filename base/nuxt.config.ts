// https://v3.nuxtjs.org/api/configuration/nuxt.config

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ]
    }
  },

  content: {
    api: {
      baseURL: '/_content',
    }
  },

  experimental: {
    inlineSSRStyles: false
  },

  modules: [
    '@nuxtjs/plausible',
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
    join(currentDir, 'modules/hypercontent')
  ],

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
