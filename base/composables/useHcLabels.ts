export default function () {
  const { currentLangCode, defaultLang } = useHcLangs()
  const labels = useState('labels', () => ref<Record<string, string>>({}))

  const _loadLabels = async () => {
    const langCode = currentLangCode.value || defaultLang.value.code
    const { data: _labels } = await useAsyncData('_labels', () =>
      queryContent()
        .where({
          _partial: true,
          _id: `content:_hc:api:${langCode}:labels.json`,
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
