export type ContentApiEndpointDynamicPageResolver = (response: any) => any[]

export interface ContentApiEndpointDef {
  path: string
  queryParams?: Record<string, string>
  dynamicPageResolver?: {
    entityName: string
    resolve: ContentApiEndpointDynamicPageResolver
  }
}

export const HC_ENDPOINTS = {
  city: {
    list: {
      path: '/cities',
      queryParams: { lang_id: '{lang.id}' },
    },
    detail: {
      path: '/cities/{city.id}',
      queryParams: { lang_id: '{lang.id}' },
    },
  },
  content: {
    detail: {
      path: '/collections/HcPagesLang/records?expand=Content&filter=(id = "{page.id}")',
      // queryParams: { lang_id: '{lang.id}', resolve_slug: '{resolvedSlug}' },
    },
  },
  event: {
    list: {
      path: '/events',
      queryParams: { lang_id: '{lang.id}' },
    },
    detail: {
      path: '/events/{event.id}',
      queryParams: { lang_id: '{lang.id}' },
    },
  },
  label: {
    list: { path: '/collections/HcLabels/records?filter=(Lang="{lang.id}")' },
  },
  lang: {
    list: { path: '/collections/HcLangs/records' },
  },
  location: {
    list: {
      path: '/locations',
      queryParams: { lang_id: '{lang.id}' },
    },
    detail: {
      path: '/locations/{location.id}',
      queryParams: { lang_id: '{lang.id}' },
    },
  },
  navigation: {
    list: {
      path: '/collections/HcNavigation/records?filter=(langCode="{lang.code}")',
    },
  },
  teaser: {
    list: {
      path: '/teasers',
      queryParams: { lang_id: '{lang.id}' },
    },
    detail: {
      path: '/teasers/{teaser.id}',
      queryParams: { lang_id: '{lang.id}' },
    },
  },
  sponsor: {
    list: {
      path: '/sponsors',
      queryParams: { lang_id: '{lang.id}' },
    },
    detail: {
      path: '/sponsor/{sponsor.id}',
      queryParams: { lang_id: '{lang.id}' },
    },
  },
}
