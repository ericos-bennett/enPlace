import { Link } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { LoginButton } from '../LoginButton/LoginButton'
import { useAuthStore } from '~/store/auth'
import logo from '~/assets/logo.png'
import './Header.css'

export const Header: React.FC = () => {
  const { isLoggedIn } = useAuthStore()

  return (
    <header>
      <Link to="/" className="nav-link">
        <Box component="img" src={logo}></Box>
        <Typography variant="body1">enPlace</Typography>
      </Link>
      <nav>
        {isLoggedIn && (
          <Typography variant="body1" className="nav-link">
            <Link to="/recipes">My Recipes</Link>
          </Typography>
        )}
        <LoginButton />
      </nav>
    </header>
  )
}
