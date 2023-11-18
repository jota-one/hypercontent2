import { defineNuxtModule } from '@nuxt/kit'
import generateContentModule from './generate-content'

export interface ModuleOptions {
  generateContent: {
    enabled?: boolean
    apiUrl?: string
    contentRoot?: string
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@jota-one/hypercontent',
    configKey: 'hypercontent',
    compatibility: {
      nuxt: '^3.6.1'
    }
  },
  defaults: {
    generateContent: {
      enabled: false,
      apiUrl: 'http://localhost:8090/api',
      contentRoot: 'content'
    }
  },
  setup (options: any, nuxt: any) {
    nuxt.hook('ready', async () => {
      if (options.generateContent.enabled) {
        const { apiUrl, contentRoot } = options.generateContent
        const { generateContent } = generateContentModule()

        if (apiUrl) {
          await generateContent({ apiUrl, contentRoot })
        }
      }
    })
  }
})

