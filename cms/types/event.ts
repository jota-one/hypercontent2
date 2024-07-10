import type { HcCoords } from "./location"
import type { HcTag } from "./tag"

export interface HcEventLocation {
  label: string
  coords: HcCoords
  address: string
}

export interface HcEventSubscriptions {
  starting?: Date
  max: number
  currentCount: number
  staffCount: number
}

export type HcEventAttendeesStatus = 'todo' | 'checked' | 'disabled'

export interface HcEvent {
  id: number
  title: string
  location: HcEventLocation
  cityId: number
  start: Date
  end?: Date
  subscriptions: HcEventSubscriptions
  tags: HcTag[]
  moreInfo?: string
  paused: string | null
  cancelled: string | null
  attendees: HcEventAttendeesStatus
}

export interface HcEventUserSubscription {
  id: number
  eventId: number
}