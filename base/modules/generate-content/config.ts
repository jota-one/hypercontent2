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
  langs: { path: '/settings' },
  labels: { path: '/labels/{lang.code}' },
  navigation: {
    path: '/navigation',
    queryParams: { lang_id: '{lang.id}', static: 'true' },
  },
  contents: {
    path: '/contents/{page.id}',
    queryParams: { lang_id: '{lang.id}', resolve_slug: '{resolvedSlug}' },
  },
  teasers: {
    path: '/teasers',
    queryParams: { lang_id: '{lang.id}' },
  },
}
