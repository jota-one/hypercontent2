export default function () {
  const { hc } = useRuntimeConfig().public
  const { currentLangCode, defaultLang } = useHcLangs()
  const labels = useState<Record<string, string>>('labels', () => ({}))

  const _loadLabels = async () => {
    const langCode = currentLangCode.value || defaultLang.value?.code || 'en'
    const hcApiPath = `${hc.content.api.base}${hc.content.api.labels
      .replace('__langCode__', langCode)}`

    const { data: _labels } = await useAsyncData('_labels', () =>
      queryContent()
        .where({
          _partial: true,
          _id: `content:${hcApiPath}`,
        })
        .findOne(),
    )

    if (_labels.value) {
      labels.value = _labels.value
    }
  }

  const l = computed(() => (key: string, values?: object) => {
    return labels.value[key] || `{${key}}`
  })

  return { _loadLabels, l, labels }
}
