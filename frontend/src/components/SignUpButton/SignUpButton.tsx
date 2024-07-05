import { Button } from '@mui/material'

export const SignUpButton: React.FC = () => {
  const authDomain = 'auth.enplace.xyz'
  const clientId = '47stqonob5ak3gkk6cl3pp3p8s'
  const redirectUri = import.meta.env.PROD
    ? 'https://enplace.xyz/callback'
    : 'http://localhost:5173/callback'
  const scope = 'openid email'

  const authorizationUrl = `https://${authDomain}/signup?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`
  console.log({ authorizationUrl })

  const handleSignUp = () => {
    window.location.href = authorizationUrl
  }

  return <Button onClick={handleSignUp}>Sign Up</Button>
}
