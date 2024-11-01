import { mkdir, rm, writeFile } from 'fs/promises'
import { join } from 'path'

import {
  type ContentApiEndpointDef,
  type ContentApiEndpointDynamicPageResolver,
  HC_ENDPOINTS,
} from '../../common/config'
import {
  pascalToKebab,
  resolveEndpointDefPlaceholders,
} from '../../common/helpers'
import type { HcLang } from '../../types/lang'
import type { HcPage, HcPageContents } from '../../types/page'

interface ImportingPage extends HcPage {
  localPath?: string
  localSortedPath?: string
  hasDynamicContent?: boolean
  entity?: {
    name: string
    value: any
  }
}
interface Config {
  apiBasePath: string[]
  apiBaseUrl: string
  contentBasePath: string[]
}

interface DynamicPageResolver {
  endpoint: {
    path: string
    queryParams?: Record<string, string>
  }
  response: any
  resolve: ContentApiEndpointDynamicPageResolver
}

interface DynamicContentEntityDef {
  name: string
  field: string
}

type DynamicPageResolvers = Record<string, DynamicPageResolver>

const DYNAMIC_ENTITY_PLACEHOLDER_PATTERN = /:(\w+)\.(\w+)/gim
const PATH_CHECK_PATTERN = /[\/:\.a-z0-9-_]+/gm

export const config: Config = {
  apiBasePath: ['_hc', 'api'],
  apiBaseUrl: '',
  contentBasePath: ['content'],
}

const dumpFile = async (
  content: string,
  path: string,
  fileExtension: string
) => {
  const filePath = config.contentBasePath.concat(
    `${path}.${fileExtension}`.split('/').filter(p => p)
  )

  await mkdir(join(...filePath.filter(p => !p.endsWith(`.${fileExtension}`))), {
    recursive: true,
  })

  return writeFile(join(...filePath), content, 'utf-8')
}

const dumpJson = (json: any, path: string) => {
  return dumpFile(JSON.stringify(json), path, 'json')
}

const fetchEndpoint = async (path: string, query = '') => {
  const url = `${config.apiBaseUrl}${path}${query}`
  const response = await fetch(url)
  const json = await response.json()
  return { json, url }
}

const getFrontMatter = (page: HcPage, apiUrl: string) => {
  let ymlContent = `---\n`

  if (page.show !== 'always') {
    ymlContent += `navigation: false\n`
  }

  ymlContent += `access: ${page.access}\n`
  ymlContent += `apiUrl: ${apiUrl}\n`
  ymlContent += `---\n\n`

  return ymlContent
}

const json2mdc = (
  json: HcPageContents,
  dynamicPageEntityDef?: DynamicContentEntityDef
) => {
  const content = json.contents[0]

  if (!content) {
    return
  }

  if (content.state !== 'published') {
    return
  }

  let mdContent = ''
  const blocks = JSON.parse(content.blocks)

  const isBooleanOrNumber = (value: string) =>
    typeof value !== 'object' &&
    (['true', 'false'].includes(value.toString().toLowerCase()) ||
      !isNaN(parseInt(value)))

  if (dynamicPageEntityDef) {
    mdContent += `::hc-dynamic-content{entity="${dynamicPageEntityDef.name}" field="${dynamicPageEntityDef.field}"}\n`
  }

  for (const block of blocks) {
    if (block.type === 'paragraph') {
      mdContent += `::block-p\n${block.data?.text}\n::\n`
    } else {
      const componentName = `:${pascalToKebab(block.type)}`

      const componentProps = []
      const props = block.data?.props || {}

      for (const [key, value] of Object.entries(props)) {
        let componentProp = ''

        // Prefix prop with : in case of object (incl. array)
        componentProp += typeof value === 'object' ? ':' : ''

        // Append prop key
        if (isBooleanOrNumber(value as string)) {
          componentProp += `:${key}=${value}`
        } else {
          componentProp += `${key}=`
          // Open value quotes
          // => object (incl. array) need to be wrapped inside single quotes (')
          // while primitives are wrapped with double quotes (")
          componentProp += typeof value === 'object' ? `'` : `"`
          // Append prop value
          componentProp +=
            typeof value === 'object' ? JSON.stringify(value) : value
          // Close value quotes
          componentProp += typeof value === 'object' ? `'` : `"`
        }

        componentProps.push(componentProp)
      }

      mdContent += `${componentName}`

      if (componentProps.length) {
        mdContent += `{${componentProps.join(' ')}}`
      }

      mdContent += `\n`
    }
  }

  if (dynamicPageEntityDef) {
    mdContent += '::'
  }

  return mdContent
}

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
  navigation: ImportingPage[],
  lang: HcLang,
  dynamicPageResolvers: DynamicPageResolvers
): Promise<ImportingPage[]> => {
  const getEntityDefFromPath = (pagePath: string): DynamicContentEntityDef =>
    pagePath
      .split('/')
      .filter(p => p.includes(':'))
      .reduce(
        (acc, p) => {
          const [name, field] = p.slice(1).split('.')
          acc.name = name
          acc.field = field
          return acc
        },
        { name: '', field: '' }
      )

  const pages: ImportingPage[] = []

  for (let i = 0; i < navigation.length; i++) {
    const page = navigation[i]
    page.hasDynamicContent = false

    if (!page.path.includes(':')) {
      // Push static page in pages array
      pages.push(page)
    } else {
      // Resolve dynamic page and push result (entites in the response)
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
            label: resolveInputWithEntity(page.label, entityName, entity),
            path: resolveInputWithEntity(page.path, entityName, entity),
            sortedPath: resolveInputWithEntity(
              page.sortedPath,
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

        continue
      } else {
        // If no resolver found, push the page as static template page
        pages.push(page)
        page.hasDynamicContent = true
      }
    }
  }

  // Write md file for each page and create folder according to page path
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]
    const pathCheck = page.path.match(PATH_CHECK_PATTERN)

    if (!pathCheck || pathCheck[0] !== page.path) {
      throw new Error(
        `Page path ${page.path} contains invalid character(s) => path check pattern: ${PATH_CHECK_PATTERN}`
      )
    }

    page.localSortedPath = page.sortedPath.replace(
      DYNAMIC_ENTITY_PLACEHOLDER_PATTERN,
      (_, g1, g2) => `__${g1}.${g2}__`
    )

    let { json: content, url: pageApiUrl } = await fetchEndpoint(
      resolveEndpointDefPlaceholders(HC_ENDPOINTS.content.detail.path, {
        page,
      }),
      resolveEndpointDefPlaceholders(HC_ENDPOINTS.content.detail.queryParams, {
        lang,
      })
    )

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

    const nextPage = i < navigation.length && navigation[i + 1]
    const createDir = nextPage && nextPage.sortedPath.includes(page.sortedPath)

    // Write _dir.yml file to skip section from nuxt content navigation
    if (page.show === 'never' && createDir) {
      await dumpFile('navigation: false', `${page.localSortedPath}/_dir`, 'yml')
    }

    // Adapt path folder structure + generate markdown content
    page.localPath = createDir
      ? (page.localSortedPath += '/0.index')
      : page.localSortedPath

    let mdContent

    if (page.hasDynamicContent) {
      const dynamicPageEntityDef = getEntityDefFromPath(page.path)
      mdContent =
        getFrontMatter(page, pageApiUrl) +
        json2mdc(content, dynamicPageEntityDef)
    } else {
      mdContent = getFrontMatter(page, pageApiUrl) + json2mdc(content)
    }

    // Write page on disk
    if (mdContent) {
      await dumpFile(mdContent, page.localPath, 'md')
    }

    // Remove sort from localPath
    page.localPath = page.localPath
      .replace(`/${page.sort + 1}.`, '/')
      .replace('/0.index', '')
  }

  return pages
}

const generateContent = async ({
  apiBaseUrl,
  contentRootFolder,
  excludeLabelKeyPrefixes,
  customContentApiEndpoints,
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

  // Set default excluded label keys
  const _excludeLabelKeyPrefixes = ['hc_', ...(excludeLabelKeyPrefixes || [])]

  {
    const into = join(...config.contentBasePath)
    console.info(`Generating content from ${apiBaseUrl} into "${into}"...`)
  }

  // Cleanup
  await rm(join(...config.contentBasePath), { recursive: true, force: true })

  // Fetch and dump langs
  const langs = (await fetchEndpoint(HC_ENDPOINTS.lang.list.path)).json.langs
  await dumpJson(langs, join(...config.apiBasePath.concat(['langs'])))

  let pageLinks: string[] = []

  // Fetch and dump HC endpoints
  for (const lang of langs) {
    // Create language dir
    await mkdir(join(...config.contentBasePath.concat(lang.code)), {
      recursive: true,
    })

    // Labels
    const { json: labels } = await fetchEndpoint(
      resolveEndpointDefPlaceholders(HC_ENDPOINTS.label.list.path, { lang })
    )

    const filteredLabels = Object.entries(labels).reduce(
      (acc: any, [key, value]) => {
        if (!_excludeLabelKeyPrefixes.some(prefix => key.startsWith(prefix))) {
          acc[key] = value
        }

        return acc
      },
      {}
    )

    await dumpJson(
      filteredLabels,
      join(...config.apiBasePath.concat([lang.code, 'labels']))
    )

    // Navigation
    const { json: navigation } = await fetchEndpoint(
      resolveEndpointDefPlaceholders(HC_ENDPOINTS.navigation.list.path, {
        lang,
      }),
      resolveEndpointDefPlaceholders(HC_ENDPOINTS.navigation.list.queryParams, {
        lang,
      })
    )

    await dumpJson(
      navigation,
      join(...config.apiBasePath.concat([lang.code, 'navigation']))
    )

    // Custom content api endpoints
    const dynamicPageResolvers: DynamicPageResolvers = {}
    if (customContentApiEndpoints) {
      for (const [name, endpointDef] of Object.entries(
        customContentApiEndpoints
      )) {
        const nameCheckPattern = /[a-zA-Z0-9-_]+/gm
        const nameCheck = name.match(nameCheckPattern)

        if (nameCheck === null || nameCheck[0] !== name) {
          throw new Error(
            `customContentApiEndpoint name ${name} contains invalid character(s) => name check pattern: ${nameCheckPattern}`
          )
        }

        const { json } = await fetchEndpoint(
          resolveEndpointDefPlaceholders(endpointDef.path, { lang }),
          resolveEndpointDefPlaceholders(endpointDef.queryParams, { lang })
        )

        await dumpJson(
          json,
          join(...config.apiBasePath.concat([lang.code, name]))
        )

        const resolver = endpointDef.dynamicPageResolver

        if (resolver) {
          dynamicPageResolvers[resolver.entityName] = {
            endpoint: {
              path: endpointDef.path,
              ...(endpointDef.queryParams
                ? { queryParams: endpointDef.queryParams }
                : {}),
            },
            response: json,
            resolve: resolver.resolve,
          }
        }
      }
    }

    // Pages
    const pages = await buildPages(navigation, lang, dynamicPageResolvers)

    // Push pages to pageLinks
    pageLinks = pageLinks.concat(
      pages.map(
        (page: ImportingPage) =>
          `- [${page.label.replace(/:(.*)\./gim, '__$1__.')}](${
            page.localPath
          })`
      )
    )
  }

  // Build homepage
  await dumpFile(pageLinks.join(`\n`), 'index', 'md')
  console.info('Content generation done!')
}

export default () => ({ generateContent })
