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

  const generateResetPasswordLink = (
    email: string,
    captchaToken: string,
    langCode: LangCode,
  ): Promise<string> => {
    return $fetch(`${runtimeConfig.hcRemoteApi}/accounts/passwords/reset-links`, {
      method: 'POST',
      body: { email, captchaToken },
      params: { lang_code: langCode },
    })
  }
  
  const login = async (credentials: { email: string; password: string }) => {
    const result = await $fetch<AuthState>(`${runtimeConfig.hcRemoteApi}/login`, {
      method: 'post',
      body: JSON.stringify(credentials)
    })

    auth.value = result
  }

  const logout = async () => {
    const result = await $fetch<AuthState>(`${runtimeConfig.hcRemoteApi}/logout`, {
      method: 'POST',
    })

    auth.value = result
  }

  return {
    isAuthenticated,
    userId,
    generateResetPasswordLink,
    login,
    logout,
  }
}