import 'dayjs/locale/ur'

import dayjs, { Dayjs } from 'dayjs'

import type { HcLangCode } from '../types/lang'

export const useHcLocalDate = () => {
  const dayjsLocales = useState('hcDayjsLocales', () =>
    ref<Partial<Record<HcLangCode, any>>>({})
  )
  const currentDayjsLocale = useState('hcCurrentDayjsLocale', () => ref<any>())

  const { currentLangCode } = useHcLangs()

  const _loadLocale = async (langCode?: HcLangCode): Promise<any> => {
    const code: HcLangCode = langCode || currentLangCode.value

    if (dayjsLocales.value && dayjsLocales.value[code]) {
      return
    }

    switch (code) {
      case 'br':
        dayjsLocales.value[code] = await import('dayjs/locale/br')
        break
      case 'cs':
        dayjsLocales.value[code] = await import('dayjs/locale/cs')
        break
      case 'da':
        dayjsLocales.value[code] = await import('dayjs/locale/da')
        break
      case 'de':
        dayjsLocales.value[code] = await import('dayjs/locale/de')
        break
      case 'es':
        dayjsLocales.value[code] = await import('dayjs/locale/es')
        break
      case 'fi':
        dayjsLocales.value[code] = await import('dayjs/locale/fi')
        break
      case 'fr':
        dayjsLocales.value[code] = await import('dayjs/locale/fr')
        break
      case 'hu':
        dayjsLocales.value[code] = await import('dayjs/locale/hu')
        break
      case 'it':
        dayjsLocales.value[code] = await import('dayjs/locale/it')
        break
      case 'nl':
        dayjsLocales.value[code] = await import('dayjs/locale/nl')
        break
      case 'pl':
        dayjsLocales.value[code] = await import('dayjs/locale/pl')
        break
      case 'pt':
        dayjsLocales.value[code] = await import('dayjs/locale/pt')
        break
      case 'ro':
        dayjsLocales.value[code] = await import('dayjs/locale/ro')
        break
      case 'ru':
        dayjsLocales.value[code] = await import('dayjs/locale/ru')
        break
      case 'se':
        dayjsLocales.value[code] = await import('dayjs/locale/se')
        break
      case 'tk':
        dayjsLocales.value[code] = await import('dayjs/locale/tk')
        break
      case 'en':
      default:
        dayjsLocales.value[code] = await import('dayjs/locale/en')
        break
    }

    currentDayjsLocale.value = dayjsLocales.value[code]
    return currentDayjsLocale.value
  }

  const getLocaleDate = (date: Dayjs | Date) => {
    if (!currentDayjsLocale.value) {
      throw new Error(
        'Dayjs locale is not set. Please call _loadDateLocale() first.'
      )
    }

    return (dayjs.isDayjs(date) ? date : dayjs(date)).locale(
      currentDayjsLocale.value
    )
  }

  return { currentDayjsLocale, dayjsLocales, getLocaleDate, _loadLocale }
}
