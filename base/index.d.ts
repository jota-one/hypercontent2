namespace hc {
  namespace content {
    export type LangCode = 'fr' | 'de' | 'en' | 'it' | 'es' | 'pt'

    export interface Lang {
      id: number
      code: LangCode
      label: string
      isDefault: boolean
      sort: number
      path: string
    }
  }
}

/*
export type BlockSpaceSize = 'full' | 'half' | 'quarter'
export type Coords = [number, number]
export interface CenterCoords {
  lat: number
  lng: number
}

export interface DateRange {
  from: Dayjs
  to: Dayjs
}

export interface Link {
  label: string
  href: string
}

export interface Marker {
  coords: Coords
  icon: string
  label: string
  slug?: string
}

export type ColorTheme =
  | 'error'
  | 'info'
  | 'warning'
  | 'success'
  | 'neutral'
  | 'subscribed'

export type I18nField = Record<LangCode, string>

export type ShowPage = 'always' | 'active' | 'never'

export interface Page {
  id: number
  name: string
  label: string
  sort: number
  show: ShowPage
  access: string
  lang: string
  path: string
  resolveSlug?: string
}

export interface Tag {
  id: number
  label: string
}

export interface Teaser {
  tags?: Tag[]
  content?: string
  link?: Link
}

export type Sponsor = {
  id: number
  name: string
  title?: string
  isGlobal: boolean
  bgColor?: string
}

export type SponsorWithDetail = Sponsor & {
  content: any[]
  link?: Link
}

export interface City {
  id: number
  label: string
  coords: Coords
  slug: string
  sponsors: number[]
}

export interface SessionLocation {
  label: string
  coords: Coords
  address: string
}

export interface SessionSubscriptions {
  starting?: Date
  max: number
  currentCount: number
  staffCount: number
}

export type SessionAttendeesStatus = 'todo' | 'checked' | 'disabled'

export interface Session {
  id: number
  title: string
  location: SessionLocation
  cityId: number
  start: Date
  end?: Date
  subscriptions: SessionSubscriptions
  tags: Tag[]
  moreInfo?: string
  paused: string | null
  cancelled: string | null
  attendees: SessionAttendeesStatus
}

export type DateRangeSize = 'day' | 'week' | 'month' | 'year'

export interface CaptchaModel {
  verified: boolean
  expired: boolean
  token: string
  eKey: string
  error: string
  isValid: boolean
}

export interface Person {
  firstName: string
  lastName: string
  street: string
  zip?: number
  city: string
  phone: string
  email: string
  title?: string
}

export interface Attendee {
  subscriptionId: number
  presence: boolean | null
  firstName: string
  lastName: string
  gender: 'male' | 'female' | 'other'
}

export type UserProfileLogin = {
  email: string
  password?: string
  passwordConfirm?: string
}

export type UserProfileDetails = {
  firstName: string
  lastName: string
  street: string
  zip?: number
  city: string
  regionId?: number
  country?: string
  phone?: string
  gender: string
  birthdate: string
  size?: number
  weight?: number
  emergencyContact?: string
}

export type UserProfileHealth = {
  heartIssues: boolean
  chestPains: boolean
  pastChestPains: boolean
  balanceIssues: boolean
  boneProblemsOn: boolean
  boneProblemsDetails: string
  bloodMedicationOn: boolean
  bloodMedicationDetails: string
  otherHealthIssuesOn: boolean
  otherHealthIssuesDetails: string
  objectives: string
}

export type UserProfileAgreements = {
  risks?: boolean
  promo?: boolean
  ad?: boolean
}

export type UserProfile = UserProfileLogin &
  UserProfileDetails &
  UserProfileHealth &
  UserProfileAgreements & {
    id: number
  }

export interface EventType {
  id?: number
  xid: string
  label: I18nField
}

export interface EventsImportResponse {
  nbEvents: number
  inserted: Array<number>
  duplicates: Array<number>
}

export interface HateoasLinkDef {
  href: string
}
export interface HateoasResource {
  id: number
  _links: Record<string, HateoasLinkDef>
}
*/
