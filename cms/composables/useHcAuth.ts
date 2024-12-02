import { HC_ENDPOINTS } from '../common/config'
import { resolveEndpointDefPlaceholders } from '../common/helpers'
import type { UsersResponse } from '../types'
import type { HcLangCode } from '../types/lang'
import type { HcUserRole } from '../types/user'

export default function useHcAuth() {
  const isAuthenticated = useState('hcIsAuthenticated', () => false)
  const userRole = useState<HcUserRole | null>('hcUserRole', () => null)
  const user = useState<UsersResponse | null>('hcUser', () => null)

  const runtimeConfig = useRuntimeConfig().public
  const { $localStorage } = useNuxtApp()

  const getToken = () =>
    $localStorage.getItem(runtimeConfig.hypercontent.jwt?.token.name) || ''

  const fetchRoleById = async (id: string) => {
    const response = await fetch(
      resolveEndpointDefPlaceholders(
        runtimeConfig.hypercontent.remoteApi + HC_ENDPOINTS.role.one,
        { id }
      ),
      {
        method: 'GET',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }
    )
    const role = await response.json()
    userRole.value = role.name
  }

  const checkAuth = async () => {
    const response = await fetch(
      `${runtimeConfig.hypercontent.remoteApi}/collections/users/auth-refresh`,
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }
    )

    isAuthenticated.value = response.status === 200
    const responseBody = await response.json()

    if (isAuthenticated.value) {
      user.value = responseBody.record
      await fetchRoleById(responseBody.record.Role)
    }
  }

  const generateResetPasswordLink = async (
    email: string,
    captchaToken: string,
    langCode: HcLangCode
  ): Promise<string> => {
    const response = await fetch(
      `${runtimeConfig.hypercontent.remoteApi}/accounts/passwords/reset-links?lang_code=${langCode}`,
      {
        method: 'POST',
        body: JSON.stringify({ email, captchaToken }),
      }
    )

    const responseBody = await response.json()

    if (response.status === 200) {
      return responseBody
    } else {
      throw new Error(responseBody.message)
    }
  }

  const login = async (credentials: { identity: string; password: string }) => {
    const response = await fetch(
      runtimeConfig.hypercontent.remoteApi + HC_ENDPOINTS.auth.login,
      {
        method: 'post',
        body: JSON.stringify(credentials),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const responseBody = await response.json()

    if (response.status === 200) {
      $localStorage.setItem(
        runtimeConfig.hypercontent.jwt.token.name,
        responseBody.token
      )
      isAuthenticated.value = true
      user.value = responseBody.record
      await fetchRoleById(responseBody.record.Role)
    } else {
      throw new Error(responseBody.message)
    }
  }

  const logout = () => {
    $localStorage.removeItem(runtimeConfig.hypercontent.jwt.token.name)
    isAuthenticated.value = false
    userRole.value = null
  }

  return {
    isAuthenticated,
    userRole,
    user,
    checkAuth,
    generateResetPasswordLink,
    getToken,
    login,
    logout,
  }
}
