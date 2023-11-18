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

export const SISI_ENDPOINTS = {
  cities: {
    path: '/cities',
    queryParams: { lang_id: '{lang.id}' },
  },
}

export const CUSTOM_ENDPOINTS = [
  {
    path: '/sponsors',
    queryParams: { lang_id: '{lang.id}' },
  },
]
