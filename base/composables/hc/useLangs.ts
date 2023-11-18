import { LangCode } from '~'

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
    
    langs.value = _langs.value?.body

    const defaultLangItem = langs.value.find(l => l.isDefault)

    if (defaultLangItem) {
      defaultLang.value = defaultLangItem
    }
  }

  const langCodes = computed(() => langs.value.map(l => l.code))

  const currentLangCode = computed<LangCode>(() => route.path.split('/')[1] as LangCode)

  const currentLang = computed(() => {
    return (
      langs.value.find(l => l.code === currentLangCode.value) ||
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
