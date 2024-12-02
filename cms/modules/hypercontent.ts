import { readFile, writeFile } from 'node:fs/promises'
import { join as joinPaths } from 'node:path'

import { defineNuxtModule } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'

import {
  baseConfig as config,
  type ContentApiEndpointDef,
} from '../common/config'
import copyFiles from './copy-files'
import generateContentModule from './generate-content'
import setConfigs from './set-configs'

export interface ModuleOptions {
  copyFiles: {
    enabled?: boolean
    dest?: string
  }
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
     * If you have label keys that are only used in the admin section,
     * you can exclude them from the website by providing their prefixes.
     *
     * @example
     * ['my_module_admin_']
     */
    excludeLabelKeyPrefixes?: string[]
    /**
     * If you need to have access to custom content in your website's
     * layouts/components, you should add the corresponding endpoints here
     * so that hypercontent can fetch them and store their result in
     * `_hc/api/<path>` folder under `contentRootFolder`.
     *
     * If you have dynamic pages that need to be resolved against custom entities
     * you can define them via `customContentApiEndpoints.dynamicPageResolver`
     */
    customContentApiEndpoints?: Record<string, ContentApiEndpointDef>
  }
  setConfigs: {
    enabled?: boolean
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@jota-one/hypercontent',
    configKey: 'hypercontent',
    compatibility: {
      nuxt: '^3.6.1',
    },
  },
  defaults: {
    copyFiles: {
      enabled: false,
      dest: '',
    },
    generateContent: {
      enabled: false,
      apiBaseUrl: 'http://localhost:8090/api',
      contentRootFolder: 'content',
      excludeLabelKeyPrefixes: [],
      customContentApiEndpoints: {},
    },
    setConfigs: {
      enabled: false,
    },
  },
  setup(options: ModuleOptions, nuxt: Nuxt) {
    nuxt.hook('ready', async () => {
      if (options.copyFiles.enabled) {
        const { dest } = options.copyFiles

        if (dest) {
          const { run } = copyFiles()
          await run({
            dest,
          })
        }
      }
      if (options.setConfigs.enabled) {
        // const { dest } = options.setConfigs

        //if (dest) {
        const { run } = setConfigs()
        await run()
        //}
      }
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
            customContentApiEndpoints,
          })
        }
      }
    })

    nuxt.hook('nitro:build:public-assets', async (obj: any) => {
      const outputRoot = obj.options.output.publicDir
      const home = obj._prerenderedRoutes.find(
        (route: any) => route.route === '/'
      )
      const homeHtmlFile = joinPaths(outputRoot, home.fileName)
      const contentRoot = obj.options.devStorage['content:source:content'].base
      const langsFile = joinPaths(
        contentRoot,
        ...config.apiBasePath,
        'langs.json'
      )
      const langs = JSON.parse(await readFile(langsFile, 'utf8'))
      const defaultLang = langs.find((lang: any) => lang.isDefault).code
      const homeHtmlContent = `<!DOCTYPE html><html lang="${defaultLang}"><head><title>Hypercontent</title><meta http-equiv="refresh" content="0; url=/${defaultLang}"/></html>`

      await writeFile(homeHtmlFile, homeHtmlContent, 'utf8')
    })
  },
})
