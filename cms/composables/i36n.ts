import md from 'snarkdown'
import type { App } from 'vue'
import { computed, inject, provide, reactive, ref, watch } from 'vue'

import { extractPlaceholders, replace } from './replacer'

type LangLabels = Record<string, string>
type Labels = Record<string, LangLabels>
type LoadFn = (language: string) => Promise<LangLabels>
type $Label = ComputedRef<
  | ((
      keyOrArgsObj: any,
      _params: Record<string, string>,
      _lang?: string | null,
      _markdown?: boolean
    ) => string | string[] | undefined)
  | ((key: string) => string | string[] | undefined)
>

interface I36n {
  language: Ref<string>
  showKey: Ref<boolean>
  $label: $Label
  $labels: $Label
  loadTranslations: (language: string) => Promise<void>
}

const i36nSymbol = Symbol()
const i36n = {} as I36n

const _key = (labels: Labels, language: string, key: string) => {
  if (!labels[language]) {
    return `{${key}}`
  }

  const label = labels[language][key]

  if (Array.isArray(label)) {
    return label.map((item, index) => {
      const placeholders = extractPlaceholders(item)
      let plh = ''

      if (placeholders.length > 0) {
        plh = ', [' + placeholders.join(',') + ']'
      }

      return `{${key}[${index}]${plh}}`
    })
  }

  const placeholders = extractPlaceholders(label)
  let plh = ''

  if (placeholders.length > 0) {
    plh = ', [' + placeholders.join(',') + ']'
  }

  return `{${key}${plh}}`
}

const _format = (
  value: string,
  params: Record<string, string>,
  source: Record<string, string>,
  markdown = true
) => {
  const mdFn = markdown ? md : (a: string): string => a

  if (Array.isArray(value)) {
    return value.map(v => mdFn(replace(v, params, source)))
  }

  return mdFn(replace(value, params, source))
}

export const computeLabel = (
  defaultValue: string | string[],
  labels: Labels,
  language: string
) => {
  const langLabels = labels[language]

  return langLabels
    ? (
        keyOrArgsObj: any,
        _params: Record<string, string>,
        _lang: string | null = null,
        _markdown = true
      ) => {
        const isObjectArgMode =
          typeof keyOrArgsObj === 'object' && !(keyOrArgsObj instanceof Array)

        const key = isObjectArgMode ? keyOrArgsObj.key : keyOrArgsObj
        const params = isObjectArgMode ? keyOrArgsObj.params : _params
        const lang = isObjectArgMode ? keyOrArgsObj.lang : _lang
        const markdown = isObjectArgMode ? keyOrArgsObj.markdown : _markdown

        const refLabels = lang ? labels[lang] : langLabels
        return (
          _format(refLabels[key], params, refLabels, markdown) || `{${key}}`
        )
      }
    : () => defaultValue
}

export const getI36n = function () {
  return i36n
}

export const initI36n = function (
  language: string,
  { load, showKey = ref(false) }: { load: LoadFn; showKey: Ref<boolean> }
) {
  const loaded = ref(0)
  const labels = reactive<Labels>({})
  const currentLanguage = ref(language)

  const _label = (
    defaultValue: string | string[],
    labels: Labels,
    currentLanguage: string,
    showKey: boolean
  ) => {
    if (loaded.value === 0) {
      return () => defaultValue
    }

    if (showKey) {
      return (key: string) => _key(labels, currentLanguage, key)
    }

    return computeLabel(defaultValue, labels, currentLanguage)
  }

  const $label = computed(() =>
    _label(' ', labels, currentLanguage.value, showKey.value)
  )
  const $labels = computed(() =>
    _label([], labels, currentLanguage.value, showKey.value)
  )

  const loadTranslations = async (language: string) => {
    labels[language] = await load(language)
    loaded.value += 1
  }

  let _switching = false

  watch(
    () => currentLanguage.value,
    async ln => {
      if (ln && !_switching) {
        _switching = true

        if (!labels[ln]) {
          await loadTranslations(ln)
        }

        _switching = false
      }
    },
    { immediate: true }
  )

  i36n.language = currentLanguage
  i36n.showKey = showKey
  i36n.$label = $label
  i36n.$labels = $labels
  i36n.loadTranslations = loadTranslations
}

export const provideI36n = function (
  language: string,
  { load, showKey = ref(false) }: { load: LoadFn; showKey: Ref<boolean> },
  app: App
) {
  initI36n(language, { load, showKey })

  if (app) {
    app.provide(i36nSymbol, i36n)
  } else {
    provide(i36nSymbol, i36n)
  }
}

export const useI36n = function () {
  return inject(i36nSymbol)
}
