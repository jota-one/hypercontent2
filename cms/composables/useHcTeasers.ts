import dayjs from 'dayjs'
import type { Teaser } from '../index'

export const useHcTeasers = () => {
  const { hypercontent } = useRuntimeConfig().public
  const { currentLang } = useHcLangs()
  const { currentPage } = useHcNavigation()

  const getTeasers = async () => {
    const response = await fetch(`${hypercontent.remoteApi}/teasers?lang_id=${currentLang.value?.id}`)
    const teasers = await response.json()

    return (teasers || []).filter((teaser: Teaser) => {
      const matchesTarget = teaser.displayTargets.some(
        (target: any) =>
          target.pageId === currentPage.value?.id &&
          (target.slugValue
            ? target.slugValue ===
              (currentPage.value?.resolveSlug || '=').split('=')[1]
            : true),
      )
      const matchesTime =
        (teaser.activeFrom
          ? dayjs(teaser.activeFrom).isBefore(dayjs())
          : true) &&
        (teaser.activeUntil
          ? dayjs(teaser.activeUntil).isAfter(dayjs())
          : true)

      return matchesTarget && matchesTime
    })
  }

  return { getTeasers }
}
