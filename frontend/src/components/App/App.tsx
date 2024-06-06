import './App.css'
import { useState, useEffect } from 'react'
import { Recipe } from '../Recipe/Recipe'
import type { Recipe as RecipeType } from '../../types'

const App: React.FC = () => {
  const testRecipePath: string = '/src/assets/testRecipes.json'

  const [recipes, setRecipes] = useState<RecipeType[] | null>(null);

  useEffect(() => {
    fetch(testRecipePath)
      .then(response => response.json())
      .then(data => setRecipes(data))
      .catch(error => console.error('Error loading JSON:', error))
  }, []);

  return (
    <>
      {!recipes ? (
        <div>Loading...</div>
      ) : (
        <div>
          {recipes.map((recipe, recipeIndex) => (
            <Recipe recipe={recipe} key={recipeIndex}></Recipe>
          ))}
        </div>
      )
      }</>
  )
}

export default App