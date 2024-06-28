import { Link } from 'react-router-dom'
import './Header.css'

export const Header: React.FC = () => {
  return (
    <header>
      <Link to="/">Menu</Link>
      <nav>
        <Link to="/recipes">My Recipes</Link>
        <Link to="/">Login</Link>
      </nav>
    </header>
  )
}
