import type { HcCoords } from "./location"

export interface HcCity {
  id: number
  label: string
  coords: HcCoords
  slug: string
  sponsors: number[]
}