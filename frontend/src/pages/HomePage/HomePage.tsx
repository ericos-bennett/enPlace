import { Container, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { CreateRecipeForm } from '~/components/CreateRecipeForm/CreateRecipeForm'
import homeImage from '~/assets/images/home-image.jpeg'
import './HomePage.css'

export const HomePage: React.FC = () => {
  const navigate = useNavigate()

  const handleCreateRecipe = (recipeId: string) => {
    navigate(`/recipes/${recipeId}`)
  }

  return (
    <Container className="home-container">
      <Typography variant="h2" className="home-headline">
        Reliable recipes, no scrolling
      </Typography>
      <CreateRecipeForm onCreateRecipe={handleCreateRecipe} />
      <img
        src={homeImage}
        className="home-image"
        width="400px"
        alt="Home Image"
      />
    </Container>
  )
}
