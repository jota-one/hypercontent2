import type {
  DynamicContentEntityDef,
  HcPageBlock,
  HcPageContent,
  ImportingPage,
} from '../types/page.js'
import { HC_ENDPOINTS } from './config.js'
import {
  isEmpty,
  pascalToKebab,
  resolveEndpointDefPlaceholders,
} from './helpers.js'

type BlockProcessorConfig = {
  block: HcPageBlock
  depth: number
}

const getFrontMatter = (page: ImportingPage) => {
  let ymlContent = `---\n`

  if (page.show !== 'always') {
    ymlContent += `navigation: false\n`
  } else {
    ymlContent += `navigation:\n`
    ymlContent += `  title: ${page.label}\n\n`
  }

  ymlContent += `access: ${page.access || 'all'}\n`
  ymlContent += `apiUrl: ${resolveEndpointDefPlaceholders(HC_ENDPOINTS.content.page.path, { page })}\n`
  ymlContent += `contentUrl: ${resolveEndpointDefPlaceholders(HC_ENDPOINTS.content.blocks, { page })}\n`
  ymlContent += `---\n\n`

  return ymlContent
}

export const getEntityDefFromPath = (
  pagePath: string
): DynamicContentEntityDef =>
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

const isInlineComponent = (block: HcPageBlock) =>
  !block.children || block.children.length === 0

const mdComponentName = (block: HcPageBlock, depth: number) => {
  const prefix = isInlineComponent(block) ? ':' : ''.padEnd(depth + 2, ':')
  return `${prefix}${pascalToKebab(block.type as string)}`
}

const indent = (depth: number) => {
  return ''.padStart(depth, '  ')
}

const isBooleanOrNumber = (value: string) =>
  typeof value !== 'object' &&
  (['true', 'false'].includes(value.toString().toLowerCase()) ||
    !isNaN(parseInt(value)))

const processBlockProps = (block: HcPageBlock) => {
  const componentProps = []
  const props = { ...block.props, id: block.id }
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
      componentProp += typeof value === 'object' ? JSON.stringify(value) : value
      // Close value quotes
      componentProp += typeof value === 'object' ? `'` : `"`
    }

    componentProps.push(componentProp)
  }

  return componentProps.length ? `{${componentProps.join(' ')}}` : ''
}

export const processBlock = ({ block, depth }: BlockProcessorConfig) => {
  // raw text (or html or markdown)
  if (block.type === undefined && block.text) {
    return [block.text]
  }

  const componentName = mdComponentName(block, depth)
  const propsPart = processBlockProps(block)
  const indentation = indent(depth)

  let lines = [`${indentation}${componentName}${propsPart}`]
  if (!isInlineComponent(block)) {
    lines = lines.concat(
      (block.children || []).flatMap(childBlock =>
        processBlock({ block: childBlock, depth: depth + 1 })
      )
    )
    lines.push(indentation + ''.padEnd(depth + 2, ':'))
  }

  return lines
}

export const json2mdc = (
  content: HcPageContent,
  dynamicPageEntityDef?: DynamicContentEntityDef
) => {
  if (!content || !content.blocks || isEmpty(content.blocks)) {
    return ''
  }

  let mdContentLines: string[] = []

  if (dynamicPageEntityDef) {
    mdContentLines.push(
      `::hc-dynamic-content{entity="${dynamicPageEntityDef.name}" field="${dynamicPageEntityDef.field}"}`
    )
  }

  const depth = 0
  for (const block of content.blocks) {
    mdContentLines = mdContentLines.concat(processBlock({ block, depth }))
  }

  if (dynamicPageEntityDef) {
    mdContentLines.push('::')
  }

  return mdContentLines.join('\n')
}

export const getMarkdownContent = (
  page: ImportingPage,
  content: HcPageContent
) => {
  return (
    getFrontMatter(page) +
    json2mdc(
      content,
      (page.hasDynamicContent && getEntityDefFromPath(page.path as string)) ||
        undefined
    )
  )
}
