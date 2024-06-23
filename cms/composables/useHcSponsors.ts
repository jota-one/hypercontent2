import type { HcSponsor, HcSponsorWithDetail } from '../types/sponsor'

interface Sponsors {
  [id: number]: HcSponsor
}

interface SponsorsWithDetail {
  [id: number]: HcSponsorWithDetail
}

interface SponsorResponseItem {
  id: number
  name: string
  is_global: boolean
  bg_color?: string
}

interface SponsorWithDetailResponseItem {
  id: number
  name: string
  is_global: boolean
  bg_color?: string
  title?: string
  blocks: string
  link_href: string
  link_label: string
}

export const useHcSponsors = () => {
  const { hypercontent } = useRuntimeConfig().public
  const { currentLangCode, defaultLang } = useHcLangs()

  const sponsors = useState('sponsors', () => ref<Sponsors>({}))
  const sponsorsWithDetail = useState('sponsorsWithDetail', () =>
    ref<SponsorsWithDetail>({}),
  )

  const loadSponsors = async () => {
    const langCode = currentLangCode.value || defaultLang.value?.code || 'en'
    const hcApiPath = `${hypercontent.content.api.base}${langCode}:sponsors.json`
    const { data: _sponsorsList } = await useAsyncData('_sponsors', () =>
      queryContent()
        .where({ _partial: true, _id: `content:${hcApiPath}` })
        .findOne(),
    )

    const sponsorsList = _sponsorsList.value
      ?.body as unknown as SponsorResponseItem[]

    for (const sponsor of sponsorsList || []) {
      sponsors.value[sponsor.id] = {
        id: sponsor.id,
        name: sponsor.name,
        isGlobal: sponsor.is_global,
        bgColor: sponsor.bg_color,
      }
    }
  }

  const loadSponsorsWithDetail = async () => {
    const langCode = currentLangCode.value || defaultLang.value?.code || 'en'
    const hcApiPath = `${hypercontent.content.api.base}${langCode}:sponsorsDetail.json`
    const { data: _sponsorsList } = await useAsyncData('_sponsorsDetail', () =>
      queryContent()
        .where({ _partial: true, _id: `content:${hcApiPath}` })
        .findOne(),
    )

    const sponsorsList = _sponsorsList.value
      ?.body as unknown as SponsorWithDetailResponseItem[]

    for (const sponsor of sponsorsList || []) {
      sponsorsWithDetail.value[sponsor.id] = {
        id: sponsor.id,
        name: sponsor.name,
        title: sponsor.title,
        isGlobal: sponsor.is_global,
        bgColor: sponsor.bg_color,
        content: JSON.parse(sponsor.blocks),
        link: {
          href: sponsor.link_href,
          label: sponsor.link_label,
        },
      }
    }
  }

  return {
    sponsors,
    sponsorsWithDetail,
    loadSponsorsWithDetail,
    loadSponsors,
  }
}
