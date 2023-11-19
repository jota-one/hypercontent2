import type { Page } from '~'

export type ShowPage = 'always' | 'active' | 'never'

export interface Pages {
  [id: string]: Page
}

type NavigationItem = {
  pageId: number
  path: string
  label: string
  sort: number
  show: ShowPage
  children?: NavigationItem[]
}

export default function() {
  const { api } = useRuntimeConfig().public
  const route = useRoute()
  const { currentLang } = useHcLangs()

  const homePage = useState('homePage', () => ref<NavigationItem | null>(null))
  const navigation = useState('navigation', () => ref<NavigationItem[]>([]))
  const pages = useState('pages', () => ref<Pages>({}))

  const loadNavigation = async (langId?: number) => {
    if (!langId && Object.keys(pages.value).length) {
      return
    }

    const { data: pageList } = await useFetch<Page[]>(
      `${api.prefix}/navigation?lang_id=${langId || currentLang.value?.id}`,
    )

    if (!pageList.value) {
      navigation.value = []
      pages.value = {}
      return
    }

    // Set homepasge
    homePage.value = {
      ...pageList.value[0],
      pageId: pageList.value[0].id,
    }

    // Build pages
    for (const page of pageList.value) {
      pages.value[page.id] = page
    }

    // Build naviagtion
    const hasChild = (page: Page, next: Page) =>
      next.path !== page.path &&
      next.path.length > page.path.length &&
      next.path.includes(page.path)

    const isFirstLevel = (page: Page) => {
      // Homepage path is /<lang> => split('/') has length 2
      // => first level pages have path with 2 slashes /<lang>/<page>
      // thus split('/').length = 3
      return page.path.split('/').length === 3
    }

    const _navigation = []
    let parent: NavigationItem | null = null

    // Backend returns a flat list of pages ordered by path,
    // so we can avoid recursive looping.
    for (let index = 1; index < pageList.value.length; index++) {
      const page = pageList.value[index]
      const next = index < pageList.value.length && pageList.value[index + 1]

      if (isFirstLevel(page)) {
        parent = null
      }

      if (parent) {
        if (!parent.children) {
          parent.children = []
        }

        parent.children.push({ ...page, pageId: page.id })
      } else {
        _navigation.push({ ...page, pageId: page.id })
      }

      if (next && hasChild(page, next)) {
        parent = { ...page, pageId: page.id }
      }
    }

    navigation.value = _navigation
  }

  const getPage = (path: string) => {
    const stripTrailingSlash = (path: string) => path.replace(/(.*)\/$/, '$1')

    return Object.values(pages.value).find(
      page => stripTrailingSlash(page.path || '') === stripTrailingSlash(path),
    )
  }

  const currentPage = computed(() => {
    const staticPage = getPage(route.path)

    if (staticPage) {
      return staticPage
    }

    const stripPathDown = (path: string) =>
      path.substring(0, path.lastIndexOf('/')) + '/:'

    const resolveDynamicPage = (path: string, page: Page) => {
      const match = page.path.match(/:([^/]+)/)

      if (
        match &&
        match.index &&
        stripPathDown(path) === page.path.replace(match[0], ':')
      ) {
        return { key: match[1], value: path.substring(match.index) }
      }

      return {}
    }

    for (const page of Object.values(pages.value)) {
      const { key, value } = resolveDynamicPage(route.path, page)

      if (key && value) {
        return { ...page, resolveSlug: `${key}=${value}`, label: value }
      }
    }
  })

  return {
    currentPage,
    homePage,
    navigation,
    pages,
    getPage,
    loadNavigation,
  }
}
