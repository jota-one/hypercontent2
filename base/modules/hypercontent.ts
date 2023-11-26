import { defineNuxtModule } from '@nuxt/kit'
import generateContentModule from './generate-content'
import type { ContentApiEndpointDef } from './generate-content/config'

export interface ModuleOptions {
  generateContent: {
    enabled?: boolean
    apiUrl?: string
    contentRoot?: string
    excludeLabelKeyPrefixes?: string[],
    customContentApiEndpoints?: Record<string, ContentApiEndpointDef>
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
      contentRoot: 'content',
      excludeLabelKeyPrefixes: [],
      customContentApiEndpoints: {},
    }
  },
  setup (options: any, nuxt: any) {
    nuxt.hook('ready', async () => {
      if (options.generateContent.enabled) {
        const {
          apiUrl,
          contentRoot,
          excludeLabelKeyPrefixes,
          customContentApiEndpoints,
        } = options.generateContent
        const { generateContent } = generateContentModule()

        if (apiUrl) {
          await generateContent({
            apiUrl,
            contentRoot,
            excludeLabelKeyPrefixes,
            customContentApiEndpoints
          })
        }
      }
    })

    nuxt.hook('nitro:build:public-assets', () => {
      // Replace .output/public/index.html content with:
      // <!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/<defaultLang>"/></html>
    })
  }
})

