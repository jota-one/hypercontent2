export default defineNuxtConfig({
  extends: '..',

  hypercontent: {
    generateContent: {
      enabled: false,
      apiUrl: 'http://localhost:3000/api',
      contentRoot: './.playground/content'
    }
  },
})
