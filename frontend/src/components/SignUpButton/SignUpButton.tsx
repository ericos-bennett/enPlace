import { Button } from '@mui/material'

export const SignUpButton: React.FC = () => {
  const authDomain = 'auth.enplace.xyz'
  const clientId = '6r38inae6oc2mgt8m98di5b5m5'
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
