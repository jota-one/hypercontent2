// https://nuxt.com/docs/api/configuration/nuxt-config
import hypercontent from './hypercontent.config.json'
export default defineNuxtConfig({
  extends: hypercontent.extends,

  devtools: { enabled: true },

  routeRules: {
    '/': { prerender: true },
  },

  compatibilityDate: '2024-10-27',
  ...hypercontent.config,
})
