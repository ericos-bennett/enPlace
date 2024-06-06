import './App.css'
import { useState, useEffect } from 'react'
import { Recipe } from '../Recipe/Recipe'
import type { Recipe as RecipeType } from '../../types'

const App: React.FC = () => {
  const testRecipePath: string = '/src/assets/testRecipe3.json'

  const [recipe, setRecipe] = useState<RecipeType | null>(null);

  useEffect(() => {
    fetch(testRecipePath)
      .then(response => response.json())
      .then(data => setRecipe(data))
      .catch(error => console.error('Error loading JSON:', error))
  }, []);

  return (
    <>
      {!recipe ? (
        <div>Loading...</div>
      ) : <Recipe recipe={recipe}></Recipe>
      }</>
  )
}

export default App