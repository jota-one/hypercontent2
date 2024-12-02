/**
 * This file was @generated using pocketbase-typegen
 */

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
  HcConfigs = 'HcConfigs',
  HcContents = 'HcContents',
  HcLabels = 'HcLabels',
  HcLangs = 'HcLangs',
  HcNavigation = 'HcNavigation',
  HcPages = 'HcPages',
  HcPagesLang = 'HcPagesLang',
  HcRoles = 'HcRoles',
  HcTeasers = 'HcTeasers',
  HcTeasersLang = 'HcTeasersLang',
  HcTeasersTargets = 'HcTeasersTargets',
  Users = 'users',
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
  id: RecordIdString
  created: IsoDateString
  updated: IsoDateString
  collectionId: string
  collectionName: Collections
  expand?: T
}

export type AuthSystemFields<T = never> = {
  email: string
  emailVisibility: boolean
  username: string
  verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type HcConfigsRecord<Tvalue = unknown> = {
  key: string
  value: null | Tvalue
}

export enum HcContentsStateOptions {
  'draft' = 'draft',
  'published' = 'published',
  'backup' = 'backup',
}
export type HcContentsRecord<Tblocks = unknown> = {
  blocks?: null | Tblocks
  editorVersion: string
  name?: string
  state: HcContentsStateOptions
}

export type HcLabelsRecord = {
  Lang: RecordIdString
  key: string
  value: string
}

export type HcLangsRecord = {
  active?: boolean
  code: string
  isDefault?: boolean
  label?: string
  sort?: number
}

export type HcNavigationRecord<
  Taccess = unknown,
  TcontentId = unknown,
  Tlabel = unknown,
  Tlang = unknown,
  TlangCode = unknown,
  Tname = unknown,
  Tpath = unknown,
  TresolveSlug = unknown,
  Tshow = unknown,
  Tsort = unknown,
  TsortedPath = unknown,
> = {
  access?: null | Taccess
  contentId?: null | TcontentId
  label?: null | Tlabel
  lang?: null | Tlang
  langCode?: null | TlangCode
  name?: null | Tname
  path?: null | Tpath
  resolveSlug?: null | TresolveSlug
  show?: null | Tshow
  sort?: null | Tsort
  sortedPath?: null | TsortedPath
}

export enum HcPagesShowOptions {
  'always' = 'always',
  'active' = 'active',
  'never' = 'never',
}
export type HcPagesRecord = {
  Parent?: RecordIdString
  Role?: RecordIdString
  active?: boolean
  name?: string
  resolveSlug?: boolean
  show?: HcPagesShowOptions
  sort?: number
}

export type HcPagesLangRecord = {
  Content?: RecordIdString
  Lang?: RecordIdString
  Page?: RecordIdString
  label?: string
  slug?: string
}

export type HcRolesRecord = {
  name?: string
}

export type HcTeasersRecord = {
  Page?: RecordIdString
  activeFrom?: IsoDateString
  activeTo?: IsoDateString
  slugValue?: string
}

export type HcTeasersLangRecord<Ttags = unknown> = {
  Content?: RecordIdString
  Image?: string
  Lang?: RecordIdString
  Teaser?: RecordIdString
  description?: string
  linkLabel?: string
  tags?: null | Ttags
  title?: string
}

export type HcTeasersTargetsRecord = {
  Page?: RecordIdString
  Teaser?: RecordIdString
  slugValue?: string
}

export type UsersRecord = {
  Role?: RecordIdString
  avatar?: string
  name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type HcConfigsResponse<Tvalue = unknown, Texpand = unknown> = Required<
  HcConfigsRecord<Tvalue>
> &
  BaseSystemFields<Texpand>
export type HcContentsResponse<Tblocks = unknown, Texpand = unknown> = Required<
  HcContentsRecord<Tblocks>
> &
  BaseSystemFields<Texpand>
export type HcLabelsResponse<Texpand = unknown> = Required<HcLabelsRecord> &
  BaseSystemFields<Texpand>
export type HcLangsResponse<Texpand = unknown> = Required<HcLangsRecord> &
  BaseSystemFields<Texpand>
export type HcNavigationResponse<
  Taccess = unknown,
  TcontentId = unknown,
  Tlabel = unknown,
  Tlang = unknown,
  TlangCode = unknown,
  Tname = unknown,
  Tpath = unknown,
  TresolveSlug = unknown,
  Tshow = unknown,
  Tsort = unknown,
  TsortedPath = unknown,
  Texpand = unknown,
> = Required<
  HcNavigationRecord<
    Taccess,
    TcontentId,
    Tlabel,
    Tlang,
    TlangCode,
    Tname,
    Tpath,
    TresolveSlug,
    Tshow,
    Tsort,
    TsortedPath
  >
> &
  BaseSystemFields<Texpand>
export type HcPagesResponse<Texpand = unknown> = Required<HcPagesRecord> &
  BaseSystemFields<Texpand>
export type HcPagesLangResponse<Texpand = unknown> =
  Required<HcPagesLangRecord> & BaseSystemFields<Texpand>
export type HcRolesResponse<Texpand = unknown> = Required<HcRolesRecord> &
  BaseSystemFields<Texpand>
export type HcTeasersResponse<Texpand = unknown> = Required<HcTeasersRecord> &
  BaseSystemFields<Texpand>
export type HcTeasersLangResponse<
  Ttags = unknown,
  Texpand = unknown,
> = Required<HcTeasersLangRecord<Ttags>> & BaseSystemFields<Texpand>
export type HcTeasersTargetsResponse<Texpand = unknown> =
  Required<HcTeasersTargetsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> &
  AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
  HcConfigs: HcConfigsRecord
  HcContents: HcContentsRecord
  HcLabels: HcLabelsRecord
  HcLangs: HcLangsRecord
  HcNavigation: HcNavigationRecord
  HcPages: HcPagesRecord
  HcPagesLang: HcPagesLangRecord
  HcRoles: HcRolesRecord
  HcTeasers: HcTeasersRecord
  HcTeasersLang: HcTeasersLangRecord
  HcTeasersTargets: HcTeasersTargetsRecord
  users: UsersRecord
}

export type CollectionResponses = {
  HcConfigs: HcConfigsResponse
  HcContents: HcContentsResponse
  HcLabels: HcLabelsResponse
  HcLangs: HcLangsResponse
  HcNavigation: HcNavigationResponse
  HcPages: HcPagesResponse
  HcPagesLang: HcPagesLangResponse
  HcRoles: HcRolesResponse
  HcTeasers: HcTeasersResponse
  HcTeasersLang: HcTeasersLangResponse
  HcTeasersTargets: HcTeasersTargetsResponse
  users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
  collection(idOrName: 'HcConfigs'): RecordService<HcConfigsResponse>
  collection(idOrName: 'HcContents'): RecordService<HcContentsResponse>
  collection(idOrName: 'HcLabels'): RecordService<HcLabelsResponse>
  collection(idOrName: 'HcLangs'): RecordService<HcLangsResponse>
  collection(idOrName: 'HcNavigation'): RecordService<HcNavigationResponse>
  collection(idOrName: 'HcPages'): RecordService<HcPagesResponse>
  collection(idOrName: 'HcPagesLang'): RecordService<HcPagesLangResponse>
  collection(idOrName: 'HcRoles'): RecordService<HcRolesResponse>
  collection(idOrName: 'HcTeasers'): RecordService<HcTeasersResponse>
  collection(idOrName: 'HcTeasersLang'): RecordService<HcTeasersLangResponse>
  collection(
    idOrName: 'HcTeasersTargets'
  ): RecordService<HcTeasersTargetsResponse>
  collection(idOrName: 'users'): RecordService<UsersResponse>
}
