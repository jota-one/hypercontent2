import type { ParsedContent } from '@nuxt/content'

import { HcPagesShowOptions } from './db.js'
import type { HcUserRole } from './user.js'

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
  contentUrl: string
}

export interface HcPageBlock {
  id?: string
  type?: string
  props?: Record<string, any>
  children?: HcPageBlock[]
  text?: string
}

export type HcPageContent = HcContentsResponse<HcPageBlock[], never> & {
  id: number | string
}

// export interface HcPageContent {
//   id: number | string
//   blocks: HcPageBlock[]
//   lastUpdate?: string
//   updated?: string
//   state: string
//   editorVersion: string
// }

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

export interface DynamicContentEntityDef {
  name: string
  field: string
}

export type ImportingPage = HcNavigationResponse<
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  boolean,
  HcPagesShowOptions,
  number,
  string
> & {
  localPath?: string
  localSortedPath?: string
  hasDynamicContent?: boolean
  entity?: {
    name: string
    value: any
  }
}
