import type { ParsedContent } from '@nuxt/content'

import type { HcUserRole } from './user'

export type HcPageShow = 'always' | 'active' | 'never'
export type HcPageAccess = 'all' | HcUserRole

export interface HcPage {
  id: number
  name: string
  sort: number
  show: HcPageShow
  access: HcPageAccess
  lang: string
  label: string
  path: string
  sortedPath: string
  resolveSlug: string
}

export interface HcParsedPage extends ParsedContent {
  apiUrl: string
}

export interface HcPageBlock {
  id?: string
  type?: string
  props?: Record<string, any>
  children?: HcPageBlock[]
  text?: string
}

export interface HcPageContent {
  id: number | string
  blocks: HcPageBlock[]
  lastUpdate?: string
  updated?: string
  state: string
  editorVersion: string
}

export interface HcPageContents {
  contents: HcPageContent[]
  resolved: any
}

export interface HcPageSelectorModel {
  page?: HcTargetSelectorPage
  slugValue?: string
}

export interface HcTargetSelectorPage {
  id?: number
  name: string
  isDynamic?: boolean
  path: string
}
