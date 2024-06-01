import type { LangCode, UserRole } from "../index"

interface AuthState {
  user?: User
}

interface User {
  id: number | string
  role: UserRole
}

export default function() {
  const runtimeConfig = useRuntimeConfig().public
  const auth = useState<AuthState>('auth', () => ({}))
  const isAuthenticated = computed<boolean>(() => !!auth.value.user?.id)
  const userId = computed<number | string | undefined>(() => auth.value.user?.id)

  const generateResetPasswordLink = async (
    email: string,
    captchaToken: string,
    langCode: LangCode,
  ): Promise<string> => {
    const response = await fetch(`${runtimeConfig.hcRemoteApi}/accounts/passwords/reset-links?lang_code=${langCode}`, {
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
    const response = await fetch(`${runtimeConfig.hcRemoteApi}/login`, {
      method: 'post',
      body: JSON.stringify(credentials)
    })

    const responseBody = await response.json()

    if (response.status === 200) {
      auth.value = responseBody
    } else {
      throw new Error(responseBody.message)
    }
  }

  const logout = async () => {
    const response = await fetch(`${runtimeConfig.hcRemoteApi}/logout`, {
      method: 'POST',
    })

    const responseBody = await response.json()

    if (response.status === 200) {
      auth.value = responseBody
    } else {
      throw new Error(responseBody.message)
    }

    auth.value = responseBody
  }

  return {
    isAuthenticated,
    userId,
    generateResetPasswordLink,
    login,
    logout,
  }
}