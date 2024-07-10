import { computeLabel } from './i36n'

export const useHcLabels = () => {
  const labels = useState<Record<string, Record<string, string>>>('hcLabels', () => ({}))

  const { hypercontent } = useRuntimeConfig().public
  const { currentLangCode, defaultLang } = useHcLangs()

  const langCode = computed(() => currentLangCode.value || defaultLang.value?.code || 'en')

  const _loadLabels = async () => {
    const hcApiPath = `${hypercontent.content.api.base}${hypercontent.content.api.labels
      .replace('__langCode__', langCode.value)}`

    const { data: _labels } = await useAsyncData('_labels', () =>
      queryContent()
        .where({
          _partial: true,
          _id: `content:${hcApiPath}`,
        })
        .findOne(),
    )

    if (_labels.value) {
      labels.value = {
        [langCode.value]: _labels.value as Record<string, string>
      }
    }
  }

  const l = computed(() => (key: string, values?: Record<string, string>) => {
    return computeLabel(' ', labels.value, langCode.value)(key, values || {}, null, false) || `{${key}}`
  })

  return { _loadLabels, l, labels }
}
