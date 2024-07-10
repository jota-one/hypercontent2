import type { HcCity } from '../types/city'

interface Cities {
  [id: number]: HcCity
}

interface CityResponseItem {
  id: number
  label: string
  coords: string
  slug: string
  sponsors: number[]
}

export const useHcCities = () => {
  const cities = useState('hcCities', () => ref<Cities>({}))
  const filteredCities = useState('hcFilteredCities', () => ref<HcCity[]>([]))

  const { hypercontent } = useRuntimeConfig().public
  const { currentLangCode, defaultLang } = useHcLangs()
  const { buildCoords } = useHcCoords()

  const loadCities = async () => {
    const langCode = currentLangCode.value || defaultLang.value?.code || 'en'
    const hcApiPath = `${hypercontent.content.api.base}${langCode}:cities.json`
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
