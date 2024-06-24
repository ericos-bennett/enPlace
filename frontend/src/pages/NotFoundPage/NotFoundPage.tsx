import { Container } from '@mui/material'
import './NotFoundPage.css'

export const NotFoundPage: React.FC = () => {
  return (
    <Container className="not-found-container">
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </Container>
  )
}
