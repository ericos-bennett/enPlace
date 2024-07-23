import { Button } from '@mui/material'
import { logIn, logOut } from '~/services/auth'
import { useAuthStore } from '~/store/auth'

export const LoginButton: React.FC = () => {
  const { isLoggedIn } = useAuthStore()

  return (
    <>
      {isLoggedIn ? (
        <Button onClick={logOut}>Log Out</Button>
      ) : (
        <Button onClick={logIn}>Log In</Button>
      )}
    </>
  )
}
