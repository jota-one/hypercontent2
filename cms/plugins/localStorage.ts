export default defineNuxtPlugin(() => {
  return {
    provide: {
      localStorage: {
        getItem(item: string) {
          if (import.meta.client && localStorage) {
            return localStorage.getItem(item)
          } else {
            return undefined
          }
        },
        removeItem(item: string) {
          if (import.meta.client && localStorage) {
            return localStorage.removeItem(item)
          }
        },
        setItem(item: string, value: string) {
          if (import.meta.client && localStorage) {
            return localStorage.setItem(item, value)
          }
        },
      },
    },
  }
})
