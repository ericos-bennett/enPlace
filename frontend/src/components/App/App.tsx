import './App.css'
import { useState, useEffect } from 'react'
import { Recipe } from '../Recipe/Recipe'
import { getRecipes } from '../../services/recipe'
import type { Recipe as RecipeType } from '../../../../types/types'

const App: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeType[] | null>(null);

  useEffect(() => {
    getRecipes()
      .then(data => setRecipes(data))
      .catch(error => console.error('Error fetching recipes:', error))
  }, []);

  return (
    <>
      {!recipes ? (
        <div>Loading...</div>
      ) : (
        <div id='recipe-container'>
          {recipes.map((recipe, recipeIndex) => (
            <Recipe recipe={recipe} key={recipeIndex}></Recipe>
          ))}
        </div>
      )
      }</>
  )
}

export default App