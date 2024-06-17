import { useState, useEffect } from 'react'
import { Recipe } from '../components/Recipe/Recipe'
import { getRecipe } from '../services/recipe'
import type { Recipe as RecipeType } from '../types'
import { useParams } from 'react-router-dom'

const RecipePage = () => {
  const { recipeId } = useParams() as { recipeId: string };
  const [recipe, setRecipe] = useState<RecipeType | null>(null);

  useEffect(() => {
    getRecipe(recipeId)
      .then(recipe => setRecipe(recipe))
      .catch(error => console.error('Error fetching recipe:', error))
  }, []);

  return (
    <>
      {!recipe ? (
        <div>Loading...</div>
      ) : (
        <Recipe recipe={recipe}></Recipe >
      )}
    </>
  )
}

export default RecipePage