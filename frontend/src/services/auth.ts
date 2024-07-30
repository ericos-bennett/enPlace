import Cookies from 'js-cookie'
import { useAuthStore } from '~/store/auth'

const authDomain = 'auth.enplace.xyz'
const clientId = '47stqonob5ak3gkk6cl3pp3p8s'
const scope = 'openid email'

const redirectUri = `${import.meta.env.VITE_SPA_URL}/callback`
const logoutUri = `${import.meta.env.VITE_SPA_URL}/logout`

const loginUrl = `https://${authDomain}/login?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`
const logoutUrl = `https://${authDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}&scope=${scope}`
const tokenUrl = `https://${authDomain}/oauth2/token`

const removeAuthCookies = (): void => {
  Cookies.remove('id_token')
  Cookies.remove('refresh_token')
}

const getRefreshToken = (): string | undefined => {
  return Cookies.get('refresh_token')
}

export const getIdToken = (): string | undefined => {
  return Cookies.get('id_token')
}

export const logIn = (): void => {
  window.location.href = loginUrl
}

export const logOut = (): void => {
  useAuthStore.getState().setIsLoggedIn(false)
  removeAuthCookies()
  window.location.href = logoutUrl
}

export const getAuthTokensAndSave = async (authCode: string): Promise<void> => {
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: redirectUri,
    }),
  })

  if (response.ok) {
    const { id_token, refresh_token } = await response.json()
    Cookies.set('id_token', id_token, { secure: true, sameSite: 'strict' })
    Cookies.set('refresh_token', refresh_token, {
      secure: true,
      sameSite: 'strict',
    })
    useAuthStore.getState().setIsLoggedIn(true)
  } else {
    console.error('Failed to exchange code for tokens:', response.status)
  }
}

export const refreshIdToken = async (): Promise<boolean> => {
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'refresh_token',
      refresh_token: getRefreshToken() || '',
    }),
  })

  if (response.ok) {
    const { id_token } = await response.json()
    Cookies.set('id_token', id_token, { secure: true, sameSite: 'strict' })
    return true
  } else {
    console.error('Failed to exchange refresh token:', response.status)
    logIn()
    return false
  }
}
