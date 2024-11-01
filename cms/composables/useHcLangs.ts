import type { HcLang, HcLangCode } from '../types/lang'

export const useHcLangs = () => {
  const langs = useState('hcLangs', () => ref<HcLang[]>([]))
  const defaultLang = useState('hcDefaultLang', () => ref<HcLang | null>(null))

  const { hypercontent } = useRuntimeConfig().public
  const route = useRoute()

  const _loadLangs = async () => {
    const hcApiPath = `${hypercontent.content.api.base}${hypercontent.content.api.langs}`

    const { data: _langs } = await useAsyncData('_langs', () =>
      queryContent()
        .where({ _partial: true, _id: `content:${hcApiPath}` })
        .findOne()
    )

    if (_langs.value) {
      langs.value = _langs.value?.body as unknown as HcLang[]
    }

    const defaultLangItem = langs.value.find((lang: HcLang) => lang.isDefault)

    if (defaultLangItem) {
      defaultLang.value = defaultLangItem
    }
  }

  const langCodes = computed(() => langs.value.map((lang: HcLang) => lang.code))
  const currentLangCode = computed<HcLangCode>(
    () => route.path.split('/')[1] as HcLangCode
  )

  const currentLang = computed(() => {
    return (
      langs.value.find((lang: HcLang) => lang.code === currentLangCode.value) ||
      defaultLang.value
    )
  })

  return {
    _loadLangs,
    currentLang,
    currentLangCode,
    defaultLang,
    langs,
    langCodes,
  }
}
