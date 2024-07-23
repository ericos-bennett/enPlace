import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'
import { LoginButton } from '../LoginButton/LoginButton'
import { useAuthStore } from '~/store/auth'
import './Header.css'

export const Header: React.FC = () => {
  const { isLoggedIn } = useAuthStore()

  return (
    <header>
      <Typography variant="body1" className="nav-link">
        <Link to="/">enPlace</Link>
      </Typography>
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
