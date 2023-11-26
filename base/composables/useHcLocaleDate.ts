import dayjs, { Dayjs } from 'dayjs'
import type { LangCode } from '../index'

export default function() {
  const { currentLangCode } = useHcLangs()
  const dayjsLocales = useState('dayjsLocales', () => ref<Partial<Record<LangCode, any>>>({}))
  const currentDayjsLocale = useState('currentDayjsLocale', () => ref<any>())

  const loadLocale = async (langCode?: LangCode): Promise<any> => {
    const code = langCode || currentLangCode.value

    if (dayjsLocales.value && dayjsLocales.value[code]) {
      return
    }

    switch (code) {
      case 'de':
        dayjsLocales.value[code] = await import('dayjs/locale/de')
        break
      case 'fr':
        dayjsLocales.value[code] = await import('dayjs/locale/fr')
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
      throw new Error('Dayjs locale is not set. Please call loadDateLocale() first.')
    }

    // eslint-disable-next-line import/no-named-as-default-member
    return (dayjs.isDayjs(date) ? date : dayjs(date)).locale(currentDayjsLocale.value)
  }

  return { currentDayjsLocale, dayjsLocales, getLocaleDate, loadLocale }
}
