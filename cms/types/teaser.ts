import type { HcI18nField } from "./content"
import type { HcLangCode } from "./lang"
import type { HcLink } from "./link"
import type { HcPageSelectorModel } from "./page"
import type { HcTag } from "./tag"

export interface HcTeaser {
  id?: number
  activeFrom?: string
  activeUntil?: string
  tags?: HcTag[]
  title?: string
  description?: string
  imageUrl?: string
  link?: HcLink
  displayTargets: Array<{
    pageId: number
    slugValue?: string
  }>
}

export interface HcTeaserAdminModel {
  id?: number
  activeFrom?: string
  activeUntil?: string
  source: Record<HcLangCode, HcPageSelectorModel>
  title: HcI18nField
  description: HcI18nField
  linkLabel: HcI18nField
  imageUrl: HcI18nField
  displayTargets: HcPageSelectorModel[]
}

export interface HcTeaserLangRecord {
  teaser_id: number
  title: string
  description: string
  link_label: string
  image_url: string
  lang_id: number
}

export interface HcTeaserListItemAdminModel extends HcTeaserAdminModel {
  source: Record<HcLangCode, HcPageSelectorModel>
}