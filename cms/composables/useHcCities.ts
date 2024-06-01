import type { City } from '../index'

export interface Cities {
  [id: number]: City
}

interface CityResponseItem {
  id: number
  label: string
  coords: string
  slug: string
  sponsors: number[]
}

export const useHcCities = () => {
  const { hc } = useRuntimeConfig().public
  const { currentLangCode, defaultLang } = useHcLangs()
  const { buildCoords } = useHcCoords()

  const cities = useState('cities', () => ref<Cities>({}))
  const filteredCities = useState('filteredCities', () => ref<City[]>([]))

  const loadCities = async () => {
    const langCode = currentLangCode.value || defaultLang.value?.code || 'en'
    const hcApiPath = `${hc.content.api.base}${langCode}:cities.json`
    const { data: _citiesList } = await useAsyncData('_cities', () =>
      queryContent()
        .where({ _partial: true, _id: `content:${hcApiPath}` })
        .findOne(),
    )

    const citiesList = _citiesList.value?.body as unknown as CityResponseItem[]

    for (const city of citiesList) {
      cities.value[city.id] = {
        id: city.id,
        coords: buildCoords(city.coords),
        label: city.label,
        slug: city.slug,
        sponsors: city.sponsors,
      }
    }
  }

  return {
    cities,
    filteredCities,
    loadCities,
  }
}
