import { Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { CreateRecipeForm } from '~/components/CreateRecipeForm/CreateRecipeForm'
import './HomePage.css'

export const HomePage: React.FC = () => {
  const navigate = useNavigate()

  const handleCreateRecipe = (recipeId: string) => {
    navigate(`/recipes/${recipeId}`)
  }

  return (
    <>
      <Container className="home-container">
        <CreateRecipeForm onCreateRecipe={handleCreateRecipe} />
      </Container>
    </>
  )
}
