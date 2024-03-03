import { defineNuxtModule } from '@nuxt/kit'
import generateContentModule from './generate-content'
import type { ContentApiEndpointDef } from './generate-content/config'

export interface ModuleOptions {
  generateContent: {
    /**
     * If set to true, hypercontent will generate md files in your
     * `contentRoot` folder, overwriting all its content.
     */
    enabled?: boolean
    /**
     * The base url of your api without trailing slash
     */
    apiBaseUrl?: string
    /**
     * The root folder of your content if you changed it from the default
     * value (`content`) defined by nuxt.
     */
    contentRootFolder?: string
    /**
     * If you have label keys that are onyl used in the admin section,
     * you can exclude them from the website by providing their prefixes.
     *
     * @example
     * ['my_module_admin_']
     */
    excludeLabelKeyPrefixes?: string[],
    /**
     * If you need to have access to custom content in your website's
     * layouts/components, you should add the corresponding endpoints here
     * so that hypercontent can fetch them and store their result in
     * `_hc/api/<path>` folder under `contentRootFolder`.
     *
     * If you have dynamic pages that need to be resolved against custom entities
     * you can define them via `customContentApiEndpoints.dynamicRouteResolver`
     */
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
      apiBaseUrl: 'http://localhost:8090/api',
      contentRootFolder: 'content',
      excludeLabelKeyPrefixes: [],
      customContentApiEndpoints: {},
    }
  },
  setup (options: any, nuxt: any) {
    nuxt.hook('ready', async () => {
      if (options.generateContent.enabled) {
        const {
          apiBaseUrl,
          contentRootFolder,
          excludeLabelKeyPrefixes,
          customContentApiEndpoints,
        } = options.generateContent
        const { generateContent } = generateContentModule()

        if (apiBaseUrl) {
          await generateContent({
            apiBaseUrl,
            contentRootFolder,
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

