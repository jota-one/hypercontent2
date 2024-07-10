import type { HcLangCode } from "../types/lang"
import type { HcUserRole } from "../types/user"

export const useHcAuth = () => {
  const isAuthenticated = useState('hcIsAuthenticated', () => false)
  const userRole = useState<HcUserRole | null>('hcUserRole', () => null)

  const runtimeConfig = useRuntimeConfig().public
  const { $localStorage } = useNuxtApp()

  const getToken = () => $localStorage.getItem(runtimeConfig.hypercontent.jwt.token.name) || ''

  const fetchUser = async () => {
    const response = await fetch(`${runtimeConfig.hypercontent.remoteApi}/auth/user`, {
      headers: {
        'authorization': `Bearer ${getToken()}`
      }
    })

    const responseBody = await response.json()
    userRole.value = responseBody.role
  }

  const checkAuth = async () => {
    const response = await fetch(`${runtimeConfig.hypercontent.remoteApi}/auth/check`, {
      method: 'HEAD',
      headers: {
        'authorization': `Bearer ${getToken()}`
      }
    })

    isAuthenticated.value = response.status === 200

    if (isAuthenticated.value) {
      await fetchUser()
    }
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
      await fetchUser()
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
      $localStorage.removeItem(runtimeConfig.hypercontent.jwt.token.name)
      isAuthenticated.value = false
      userRole.value = null
    } else {
      throw new Error(responseBody.message)
    }
  }

  return {
    isAuthenticated,
    userRole,
    checkAuth,
    generateResetPasswordLink,
    getToken,
    login,
    logout,
  }
}