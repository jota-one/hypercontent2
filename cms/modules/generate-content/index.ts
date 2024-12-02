import { mkdir, rm } from 'fs/promises'
import { join } from 'path'

import { fetchEndpoint } from '../../common/backend'
import {
  baseConfig as config,
  type ContentApiEndpointDef,
  type ContentApiEndpointDynamicPageResolver,
  HC_ENDPOINTS,
} from '../../common/config'
import { getEntityDefFromPath, getMarkdownContent } from '../../common/content'
import { resolveEndpointDefPlaceholders } from '../../common/helpers'
import { dumpFile, dumpJson } from '../../common/io'
import type { HcLang } from '../../types/lang'
import type { ImportingPage } from '../../types/page'

interface DynamicPageResolver {
  endpoint: {
    path: string
    queryParams?: Record<string, string>
  }
  response: any
  resolve: ContentApiEndpointDynamicPageResolver
}

type DynamicPageResolvers = Record<string, DynamicPageResolver>

const DYNAMIC_ENTITY_PLACEHOLDER_PATTERN = /:(\w+)\.(\w+)/gim
const PATH_CHECK_PATTERN = /[/:.a-z0-9-_]+/gm

const resolveInputWithEntity = (
  input: string,
  entityName: string,
  entity: any
): string => {
  let resolvedInput = ''

  const placeHolderMatches = input.match(DYNAMIC_ENTITY_PLACEHOLDER_PATTERN)

  if (!placeHolderMatches) {
    return input
  }

  for (const placeHolder of placeHolderMatches) {
    const entityProp = placeHolder.replace(`:${entityName}.`, '')
    resolvedInput = (resolvedInput || input).replaceAll(
      placeHolder,
      entity[entityProp]
    )
  }

  return resolvedInput
}

const buildPages = async (
  apiBaseUrl: string,
  lang: HcLang,
  dynamicPageResolvers: DynamicPageResolvers
): Promise<ImportingPage[]> => {
  const pages: ImportingPage[] = []

  const navigation = (
    await fetchEndpoint(
      resolveEndpointDefPlaceholders(
        apiBaseUrl + HC_ENDPOINTS.navigation.list,
        {
          lang,
        }
      )
    )
  ).json.items as ImportingPage[]

  for (let i = 0; i < navigation.length; i++) {
    const page = navigation[i]
    page.hasDynamicContent = false

    if (!page.path?.includes(':')) {
      // Push static page in pages array
      pages.push(page)
    } else {
      // Resolve dynamic page and push result (entities in the response)
      // as static pages in the array
      const { name: entityName } = getEntityDefFromPath(page.path)

      const resolver = dynamicPageResolvers[entityName]

      if (resolver) {
        const entities = resolver.resolve(resolver.response)

        const resolvePageWithEntity = (
          page: ImportingPage,
          entity: any
        ): ImportingPage => {
          return {
            ...page,
            label: resolveInputWithEntity(
              page.label as string,
              entityName,
              entity
            ),
            path: resolveInputWithEntity(
              page.path as string,
              entityName,
              entity
            ),
            sortedPath: resolveInputWithEntity(
              page.sortedPath as string,
              entityName,
              entity
            ),
            entity: {
              name: entityName,
              value: entity,
            },
          }
        }

        for (const entity of entities) {
          pages.push(resolvePageWithEntity(page, entity))
        }
      } else {
        // If no resolver found, push the page as static template page
        pages.push(page)
        page.hasDynamicContent = true
      }
    }
  }

  // Write md file for each page and create folder according to page path
  const updatedPages: ImportingPage[] = []
  let i = 0
  for (const page of pages) {
    const nextPage = i < navigation.length && navigation[i + 1]
    const createDir = Boolean(
      nextPage && nextPage.sortedPath?.includes(page.sortedPath as string)
    )

    const updatedPage = await buildPage(apiBaseUrl, page, createDir)
    updatedPages.push(updatedPage)
    i++
  }

  return updatedPages
}

const buildPage = async (
  apiBaseUrl: string,
  page: ImportingPage,
  createDir: boolean
) => {
  const pathCheck = page.path?.match(PATH_CHECK_PATTERN)

  if (!pathCheck || pathCheck[0] !== page.path) {
    throw new Error(
      `Page path ${page.path} contains invalid character(s) => path check pattern: ${PATH_CHECK_PATTERN}`
    )
  }

  page.localSortedPath = page.sortedPath?.replace(
    DYNAMIC_ENTITY_PLACEHOLDER_PATTERN,
    (_, g1, g2) => `__${g1}.${g2}__`
  )

  const endpoint = await fetchEndpoint(
    resolveEndpointDefPlaceholders(
      apiBaseUrl + HC_ENDPOINTS.content.detail.path,
      {
        page,
      }
    )
  )
  let content = endpoint.json.items[0].expand.Content

  if (page.entity) {
    // Replace entity props in content, e.g. :city.label => lausanne
    let resolvedContentStr = resolveInputWithEntity(
      JSON.stringify(content),
      page.entity.name,
      page.entity.value
    )

    // Replace full entity in content escaped json
    resolvedContentStr = resolvedContentStr.replaceAll(
      `\\":${page.entity.name}\\"`,
      JSON.stringify(page.entity.value).replaceAll('"', '\\"')
    )

    content = JSON.parse(resolvedContentStr)
  }

  // Write _dir.yml file to skip section from nuxt content navigation
  if (page.show === 'never' && createDir) {
    await dumpFile('navigation: false', `${page.localSortedPath}/_dir`, 'yml')
  }

  // Adapt path folder structure + generate markdown content
  page.localPath = createDir
    ? (page.localSortedPath += '/0.index')
    : page.localSortedPath

  const mdContent = getMarkdownContent(page, content)

  // Write page on disk
  if (mdContent) {
    await dumpFile(mdContent, page.localPath as string, 'md')
  }

  // Remove sort from localPath
  page.localPath = page.localPath
    ?.replace(`/${Number(page.sort) + 1}.`, '/')
    .replace('/0.index', '')

  return page
}

const buildLabels = async (
  apiBaseUrl: string,
  lang: HcLang,
  excludeLabelKeyPrefixes?: string[]
) => {
  // Set default excluded label keys
  const _excludeLabelKeyPrefixes = ['hc_', ...(excludeLabelKeyPrefixes || [])]

  const labels = (
    await fetchEndpoint(
      resolveEndpointDefPlaceholders(
        apiBaseUrl + HC_ENDPOINTS.label.list.path,
        { lang }
      )
    )
  ).json.items

  const filteredLabels = Object.values(labels).reduce((acc: any, item: any) => {
    if (!_excludeLabelKeyPrefixes.some(prefix => item.key.startsWith(prefix))) {
      acc[item.key] = item.value
    }

    return acc
  }, {})

  await dumpJson(
    filteredLabels,
    join(...config.apiBasePath.concat([lang.code, 'labels']))
  )
}

const buildPseudoSitemap = (pages: ImportingPage[]) => {
  return pages.map(
    (page: ImportingPage) =>
      `- [${page.label?.replace(/:(.*)\./gim, '__$1__.')}](${page.localPath})`
  )
}

const generateContent = async ({
  apiBaseUrl,
  contentRootFolder,
  excludeLabelKeyPrefixes,
}: {
  apiBaseUrl: string
  contentRootFolder?: string
  excludeLabelKeyPrefixes?: string[]
  customContentApiEndpoints?: Record<string, ContentApiEndpointDef>
}) => {
  // Set api url
  config.apiBaseUrl = apiBaseUrl

  // Update content base path
  if (contentRootFolder) {
    config.contentBasePath = [contentRootFolder]
  }

  const into = join(...config.contentBasePath)
  console.info(`Generating content from ${apiBaseUrl} into "${into}"...`)

  // Cleanup
  await rm(join(...config.contentBasePath), { recursive: true, force: true })

  // Fetch and dump langs
  const langs = (await fetchEndpoint(apiBaseUrl + HC_ENDPOINTS.lang.list.path))
    .json.items as HcLang[]
  await dumpJson(langs, join(...config.apiBasePath.concat(['langs'])))

  let pageLinks: string[] = []

  // Fetch and dump HC endpoints
  for (const lang of langs) {
    // Create language dir
    await mkdir(join(...config.contentBasePath.concat(lang.code)), {
      recursive: true,
    })

    // Labels
    await buildLabels(apiBaseUrl, lang, excludeLabelKeyPrefixes)

    // Custom content api endpoints
    const dynamicPageResolvers: DynamicPageResolvers = {}
    // if (customContentApiEndpoints) {
    //   for (const [name, endpointDef] of Object.entries(
    //     customContentApiEndpoints
    //   )) {
    //     const nameCheckPattern = /[a-zA-Z0-9-_]+/gm
    //     const nameCheck = name.match(nameCheckPattern)
    //
    //     if (nameCheck === null || nameCheck[0] !== name) {
    //       throw new Error(
    //         `customContentApiEndpoint name ${name} contains invalid character(s) => name check pattern: ${nameCheckPattern}`
    //       )
    //     }
    //
    //     const { json } = await fetchEndpoint(
    //       resolveEndpointDefPlaceholders(endpointDef.path, { lang }),
    //       resolveEndpointDefPlaceholders(endpointDef.queryParams, { lang })
    //     )
    //
    //     await dumpJson(
    //       json,
    //       join(...config.apiBasePath.concat([lang.code, name]))
    //     )
    //
    //     const resolver = endpointDef.dynamicPageResolver
    //
    //     if (resolver) {
    //       dynamicPageResolvers[resolver.entityName] = {
    //         endpoint: {
    //           path: endpointDef.path,
    //           ...(endpointDef.queryParams
    //             ? { queryParams: endpointDef.queryParams }
    //             : {}),
    //         },
    //         response: json,
    //         resolve: resolver.resolve,
    //       }
    //     }
    //   }
    // }

    // Pages
    const pages = await buildPages(apiBaseUrl, lang, dynamicPageResolvers)

    // Push pages to pageLinks
    pageLinks = pageLinks.concat(buildPseudoSitemap(pages))
  }

  // Build homepage
  await dumpFile(pageLinks.join(`\n`), 'index', 'md')
  console.info('🎉 Content generation done!')
}

export default () => ({ generateContent })
