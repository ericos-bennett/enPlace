import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'
import { SignUpButton } from '../SignUpButton/SignUpButton'
import './Header.css'

export const Header: React.FC = () => {
  return (
    <header>
      <Typography variant="body1" className="nav-link">
        <Link to="/">enPlace</Link>
      </Typography>
      <nav>
        <Typography variant="body1" className="nav-link">
          <Link to="/recipes">My Recipes</Link>
        </Typography>
        <SignUpButton />
      </nav>
    </header>
  )
}
