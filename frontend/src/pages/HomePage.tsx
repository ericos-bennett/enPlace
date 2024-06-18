import { useNavigate } from 'react-router-dom'
import { CreateRecipeForm } from '../components/CreateRecipeForm/CreateRecipeForm'

const HomePage: React.FC = () => {
  const navigate = useNavigate()

  const handleCreateRecipe = (recipeId: string) => {
    navigate(`/recipes/${recipeId}`)
  }

  return (
    <>
      <CreateRecipeForm onCreateRecipe={handleCreateRecipe} />
    </>
  )
}

export default HomePage
