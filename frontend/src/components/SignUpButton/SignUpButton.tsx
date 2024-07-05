import { useEffect } from 'react'
import { Button } from '@mui/material'
import { authorizationUrl, getAuthTokensAndSave } from '~/services/auth'

export const SignUpButton: React.FC = () => {
  const handleSignUp = () => {
    window.location.href = authorizationUrl
  }

  useEffect(() => {
    const handleCallback = async () => {
      const searchParams = new URLSearchParams(window.location.search)
      const authCode = searchParams.get('code')

      if (authCode) {
        await getAuthTokensAndSave(authCode)
      }
    }

    handleCallback()
  }, [])

  return <Button onClick={handleSignUp}>Sign Up</Button>
}
