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

  // content: {
  //   documentDriven: {
  //     // Will fetch navigation, page and surround.
  //     navigation: true,
  //     page: true,
  //     surround: true,
  //     // Will fetch `content/_theme.yml` and put it in `globals.theme` if present.
  //     // globals: {
  //     //   theme: {
  //     //     where: {
  //     //       _id: 'content:_theme.yml'
  //     //     },
  //     //     without: ['_']
  //     //   }
  //     // },
  //     // Will use `theme` global to search for a fallback `layout` key.
  //     // layoutFallbacks: ['theme'],
  //     // Will inject `[...slug].vue` as the root page.
  //     injectPage: false
  //   }
  // },

  // experimental: {
  //   inlineSSRStyles: false
  // },

  modules: [
    '@nuxtjs/plausible',
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
    join(currentDir, 'modules/hypercontent')
  ]
})
