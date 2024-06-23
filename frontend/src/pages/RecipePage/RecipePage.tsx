import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Recipe } from '~/components/Recipe/Recipe'
import { getRecipe } from '~/services/recipe'
import type { Recipe as RecipeType } from '~/types'

const RecipePage: React.FC = () => {
  const navigate = useNavigate()
  const { recipeId } = useParams() as { recipeId: string }
  const [recipe, setRecipe] = useState<RecipeType | null>(null)

  useEffect(() => {
    getRecipe(recipeId)
      .then((recipe) => setRecipe(recipe))
      .catch((error) => {
        if (error.message.includes('404')) {
          navigate('/recipes/404')
        } else {
          console.error('Error fetching recipe:', error)
        }
      })
  }, [recipeId, navigate])

  return <>{recipe && <Recipe recipe={recipe}></Recipe>}</>
}

export default RecipePage
