import type { LangCode } from '../index'

export interface Lang {
  id: number
  code: string
  label: string
  isDefault: boolean
  sort: number
}

export default function() {
  const route = useRoute()
  const langs = useState('langs', () => ref<Lang[]>([]))
  const defaultLang = useState('defaultLang', () => ref<Lang | null>(null))

  const _loadLangs = async () => {
    const { data: _langs } = await useAsyncData(
      '_langs',
      () => queryContent()
        .where({ _partial: true, _id: 'content:_hc:api:langs.json' })
        .findOne()
    )
    
    if (_langs.value) {
      langs.value = _langs.value?.body as unknown as Lang[]
    }

    const defaultLangItem = langs.value.find((lang: Lang) => lang.isDefault)

    if (defaultLangItem) {
      defaultLang.value = defaultLangItem
    }
  }

  const langCodes = computed(() => langs.value.map((lang: Lang) => lang.code))

  const currentLangCode = computed<LangCode>(() => route.path.split('/')[1] as LangCode)

  const currentLang = computed(() => {
    return (
      langs.value.find((lang: Lang) => lang.code === currentLangCode.value) ||
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
