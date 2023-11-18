export default defineAppConfig({
  myLayer: {
    name: 'Hello from Nuxt layer'
  }
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    myLayer?: {
      /** Project name */
      name?: string
    }
    labels?: { [Key in hc.content.LangCode]?: Record<string, string> }
  }
}
