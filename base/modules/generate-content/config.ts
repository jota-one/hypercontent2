export interface ContentApiEndpointDef {
  path: string
  queryParams?: Record<string, string>
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
    queryParams: { lang_id: '{lang.id}' },
  },
  teasers: {
    path: '/teasers',
    queryParams: { lang_id: '{lang.id}' },
  },
}
