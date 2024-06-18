import { useNavigate } from 'react-router-dom'
import { CreateRecipeForm } from '../components/CreateRecipeForm/CreateRecipeForm'
import type { Recipe as RecipeType } from '../types'

const HomePage: React.FC = () => {
  const navigate = useNavigate()

  const handleCreateRecipe = (recipe: RecipeType) => {
    console.log(recipe)
  }

  return (
    <>
      <CreateRecipeForm onCreateRecipe={handleCreateRecipe} />
    </>
  )
}

export default HomePage
