const apiUrl = 'http://localhost:3000/api'

export default defineNuxtConfig({
  extends: '..',

  hypercontent: {
    generateContent: {
      enabled: false,
      apiUrl,
      contentRoot: './.playground/content'
    }
  },

  runtimeConfig: {
    public: {
      hcRemoteApi: apiUrl
    }
  }
})
