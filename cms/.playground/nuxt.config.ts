const apiBaseUrl = 'http://localhost:3000/api'

export default defineNuxtConfig({
  extends: '..',

  hypercontent: {
    generateContent: {
      enabled: false,
      apiBaseUrl,
      contentRootFolder: './.playground/content'
    }
  },

  runtimeConfig: {
    public: {
      hypercontent: {
        remoteApi: apiBaseUrl,
        jwt: {
          token: {
            name: '',
          },
        },
      }
    }
  }
})
