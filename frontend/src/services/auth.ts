import Cookies from 'js-cookie'

const authDomain = 'auth.enplace.xyz'
const clientId = '47stqonob5ak3gkk6cl3pp3p8s'
const redirectUri = `${import.meta.env.VITE_SPA_URL}/callback`
const scope = 'openid email'

const setIdTokenCookie = (idToken: string) => {
  Cookies.set('id_token', idToken, { secure: true, sameSite: 'strict' })
}

export const authorizationUrl = `https://${authDomain}/login?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`

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
  } else {
    console.error('Failed to exchange code for tokens:', response.status)
  }
}

export const getIdTokenFromCookie = () => {
  return Cookies.get('id_token')
}
