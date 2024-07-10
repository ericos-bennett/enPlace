import { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import {
  loginUrl,
  logoutUrl,
  getAuthTokensAndSave,
  removeIdTokenCookie,
} from '~/services/auth'

export const LoginButton: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  const handleLogin = () => {
    window.location.href = loginUrl
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    removeIdTokenCookie()
    window.location.href = logoutUrl
  }

  useEffect(() => {
    const handleCallback = async () => {
      const searchParams = new URLSearchParams(window.location.search)
      const authCode = searchParams.get('code')

      if (authCode) {
        await getAuthTokensAndSave(authCode)
        setIsLoggedIn(true)
      }
    }

    handleCallback()
  }, [])

  return (
    <>
      {isLoggedIn ? (
        <Button onClick={handleLogout}>Log Out</Button>
      ) : (
        <Button onClick={handleLogin}>Log In</Button>
      )}
    </>
  )
}
