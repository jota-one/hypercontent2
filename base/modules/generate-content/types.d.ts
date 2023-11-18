interface Lang {
  id: number | string
  code: string
  label: string
  isDefault?: boolean
  sort: number
}

interface Page {
  id: number | string
  name: string
  sort: number
  show: string,
  access: string
  lang: string
  label: string
  path: string
  sortedPath: string
}

interface PageContent {
  id: number | string
  blocks: any
  lastUpdate?: string
  updated?: strings
  state: string
  editorVersion: string
}

interface PageContents {
  contents: PageContent[],
  resolved: any
}
