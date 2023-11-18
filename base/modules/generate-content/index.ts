import { mkdir, rm, writeFile } from 'fs/promises'
import { join } from 'path'

import { HC_ENDPOINTS } from './config'
import { get } from './helpers.js'

interface Config {
  apiBasePath: string[]
  apiBaseUrl: string
  contentBasePath: string[]
}

const config:Config = {
  apiBasePath: ['_hc', 'api'],
  apiBaseUrl: '',
  contentBasePath: ['content']
}

const dumpFile = async (
  content: string,
  path: string,
  fileExtension: string,
) => {
  const filePath = config.contentBasePath.concat(
    `${path}.${fileExtension}`.split('/').filter(p => p),
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

const resolvePlaceholders = (input: any, values = {}) => {
  const replaceInString = (input = '') => {
    const placeholders = input.match(/{(\w+\.)+\w+}/gim) || []

    for (const placeholder of placeholders) {
      input = input.replaceAll(
        placeholder,
        get(values, placeholder.replace(/^{(.*)}$/gim, '$1')),
      )
    }

    return input
  }

  if (typeof input === 'object') {
    return Object.entries(input).reduce((acc, [key, value]) => {
      const replaced = replaceInString(value as string)
      acc += acc ? '&' : '?'
      return acc + `${key}=${replaced}`
    }, '')
  } else if (input) {
    return replaceInString(input)
  }

  return input
}

const formatDynamicPagePath = (path: string) =>
  path.replace(/:(\w+)\.(\w+)/gim, '__$1__$2')

const getFrontMatter = (page: Page, apiUrl: string) => {
  let ymlContent = `---\n`

  if (page.show !== 'always') {
    ymlContent += `navigation: false\n`
  }

  ymlContent += `access: ${page.access}\n`
  ymlContent += `apiUrl: ${apiUrl}\n`
  ymlContent += `---\n\n`

  return ymlContent
}

const pascalToKebab = (input: string) =>
  input.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

const json2mdc = (json: PageContents) => {
  const content = json.contents[0]

  if (!content) {
    return
  }

  if (content.state !== 'published') {
    return
  }

  let mdContent = ''
  const blocks = JSON.parse(content.blocks)

  const isBooleanOrNumber = (value: string) => typeof value !== 'object' && (
    ['true', 'false'].includes(value.toString().toLowerCase()) ||
    !isNaN(parseInt(value))
  )

  for (const block of blocks) {
    if (block.type === 'paragraph') {
      mdContent += `::paragraph\n${block.data?.text}\n::\n`
    } else {
      let componentName = `:${pascalToKebab(block.type)}`

      if (componentName.startsWith(':session')) {
        componentName = componentName.replace(':session', ':event')
      }

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

  return mdContent
}

const buildPages = async (navigation: Page[], lang: Lang) => {
  const pages = navigation.map(page => ({
    ...page,
    path: formatDynamicPagePath(page.path),
    sortedPath: formatDynamicPagePath(page.sortedPath),
  }))

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]

    const { json: content, url: pageApiUrl } = await fetchEndpoint(
      resolvePlaceholders(HC_ENDPOINTS.contents.path, { page }),
      resolvePlaceholders(HC_ENDPOINTS.contents.queryParams, { lang }),
    )

    const nextPage = i < navigation.length && navigation[i + 1]
    const createDir = nextPage && nextPage.sortedPath.includes(page.sortedPath)

    // Write _dir.yml file to skip section from nuxt content navigation
    if (page.show === 'never' && createDir) {
      await dumpFile('navigation: false', `${page.sortedPath}/_dir`, 'yml')
    }

    // Adapt path folder structure + generate markdown content
    const path = createDir ? (page.sortedPath += '/0.index') : page.sortedPath
    const mdContent = getFrontMatter(page, pageApiUrl) + json2mdc(content)

    // Write page on disk
    if (mdContent) {
      await dumpFile(mdContent, path, 'md')
    }
  }

  return pages
}

const generateContent = async ({
  apiUrl,
  contentRoot
} : {
  apiUrl: string
  contentRoot?: string
}) => {
  // Set api url
  config.apiBaseUrl = apiUrl

  // Update content base path
  if (contentRoot) {
    config.contentBasePath = [contentRoot]
  }

  console.log(`Generating content from ${apiUrl} into "${join(...config.contentBasePath)}"...`)

  // Cleanup
  await rm(join(...config.contentBasePath), { recursive: true, force: true })

  // Fetch and dump langs
  const langs = (await fetchEndpoint(HC_ENDPOINTS.langs.path)).json.langs
  await dumpJson(langs, join(...config.apiBasePath.concat(['langs'])))

  let pageLinks: string[] = []

  // Fetch and dump HC endpoints
  for (const lang of langs) {
    // Create language dir
    await mkdir(join(...config.contentBasePath.concat(lang.code)), { recursive: true })

    // Labels
    const { json: labels } = await fetchEndpoint(
      resolvePlaceholders(HC_ENDPOINTS.labels.path, { lang }),
    )
    await dumpJson(labels, join(...config.apiBasePath.concat([lang.code, 'labels'])))

    // Navigation
    const { json: navigation } = await fetchEndpoint(
      resolvePlaceholders(HC_ENDPOINTS.navigation.path, { lang }),
      resolvePlaceholders(HC_ENDPOINTS.navigation.queryParams, { lang }),
    )

    // Pages
    const pages = await buildPages(navigation, lang)

    // Push pages to pageLinks
    pageLinks = pageLinks.concat(
      pages.map((page: Page) =>
        `- [${page.label.replace(/:(.*)\./gmi, '__$1__.')}](${page.path})`
      ),
    )
  }

  // Build homepage
  await dumpFile(pageLinks.join(`\n`), 'index', 'md')
  console.log('Content generation done!')
}

export default () => ({ generateContent })
