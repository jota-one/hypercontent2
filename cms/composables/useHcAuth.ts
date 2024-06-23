import type { HcLangCode } from "../types/lang"

export const useHcAuth = () => {
  const runtimeConfig = useRuntimeConfig().public
  const { $localStorage } = useNuxtApp()
  const isAuthenticated = useState('isAuthenticated', () => false)

  const checkAuth = async () => {
    const token = $localStorage.getItem(runtimeConfig.hypercontent.jwt.token.name) || ''
    const response = await fetch(`${runtimeConfig.hypercontent.remoteApi}/auth/check`, {
      method: 'HEAD',
      headers: {
        'authorization': `Bearer ${token}`
      }
    })

    isAuthenticated.value = response.status === 200
  }

  const generateResetPasswordLink = async (
    email: string,
    captchaToken: string,
    langCode: HcLangCode,
  ): Promise<string> => {
    const response = await fetch(`${runtimeConfig.hypercontent.remoteApi}/accounts/passwords/reset-links?lang_code=${langCode}`, {
      method: 'POST',
      body: JSON.stringify({ email, captchaToken })
    })

    const responseBody = await response.json()

    if (response.status === 200) {
      return responseBody
    } else {
      throw new Error(responseBody.message)
    }
  }

  const login = async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${runtimeConfig.hypercontent.remoteApi}/auth/login?static`, {
      method: 'post',
      body: JSON.stringify(credentials)
    })

    const responseBody = await response.json()

    if (response.status === 200) {
      $localStorage.setItem(runtimeConfig.hypercontent.jwt.token.name, responseBody.token)
      isAuthenticated.value = true
    } else {
      throw new Error(responseBody.message)
    }
  }

  const logout = async () => {
    const response = await fetch(`${runtimeConfig.hypercontent.remoteApi}/auth/logout`, {
      method: 'POST',
    })

    const responseBody = await response.json()

    if (response.status === 200) {
      isAuthenticated.value = false
    } else {
      throw new Error(responseBody.message)
    }
  }

  return {
    isAuthenticated,
    checkAuth,
    generateResetPasswordLink,
    login,
    logout,
  }
}