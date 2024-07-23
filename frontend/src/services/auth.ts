import Cookies from 'js-cookie'
import { useAuthStore } from '~/store/auth'

const authDomain = 'auth.enplace.xyz'
const clientId = '47stqonob5ak3gkk6cl3pp3p8s'
const redirectUri = `${import.meta.env.VITE_SPA_URL}/callback`
const logoutUri = `${import.meta.env.VITE_SPA_URL}/logout`
const scope = 'openid email'

const loginUrl = `https://${authDomain}/login?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`
const logoutUrl = `https://${authDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}&scope=${scope}`

const setIdTokenCookie = (idToken: string) => {
  Cookies.set('id_token', idToken, { secure: true, sameSite: 'strict' })
}

const removeIdTokenCookie = (): void => {
  Cookies.remove('id_token')
}

export const logIn = () => {
  window.location.href = loginUrl
}

export const logOut = () => {
  useAuthStore.getState().setIsLoggedIn(false)
  removeIdTokenCookie()
  window.location.href = logoutUrl
}

export const getAuthTokensAndSave = async (authCode: string) => {
  const tokenUrl = `https://${authDomain}/oauth2/token`
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      code: authCode,
      redirect_uri: redirectUri,
    }),
  })

  if (response.ok) {
    const tokens = await response.json()
    setIdTokenCookie(tokens.id_token)
    useAuthStore.getState().setIsLoggedIn(true)
  } else {
    console.error('Failed to exchange code for tokens:', response.status)
  }
}

export const getIdTokenFromCookie = () => {
  return Cookies.get('id_token')
}
