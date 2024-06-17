import { useState, useEffect } from 'react'
import { Recipe } from '../components/Recipe/Recipe'
import { getRecipes } from '../services/recipe'
import { CreateRecipeForm } from '../components/CreateRecipeForm/CreateRecipeForm'
import type { Recipe as RecipeType } from '../types'

const HomePage: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeType[] | null>(null);

  useEffect(() => {
    getRecipes()
      .then(data => setRecipes(data))
      .catch(error => console.error('Error fetching recipes:', error))
  }, []);

  const handleCreateRecipe = (recipe: RecipeType) => {
    setRecipes(prevRecipes => {
      if (prevRecipes === null) {
        return [recipe];
      } else {
        return [...prevRecipes, recipe];
      }
    })
  }

  return (
    <>
      <CreateRecipeForm onCreateRecipe={handleCreateRecipe} />
      {!recipes ? (
        <div>Loading...</div>
      ) : (
        <div id='recipe-container'>
          {recipes.map((recipe, recipeIndex) => (
            <Recipe recipe={recipe} key={recipeIndex}></Recipe>
          ))}
        </div>
      )}
    </>
  )
}

export default HomePage