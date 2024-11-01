import type { HcLink } from './link'

export type HcSponsor = {
  id: number
  name: string
  title?: string
  isGlobal: boolean
  bgColor?: string
}

export type HcSponsorWithDetail = HcSponsor & {
  content: any[]
  link?: HcLink
}
