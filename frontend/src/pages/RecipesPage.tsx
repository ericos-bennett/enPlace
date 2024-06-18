import { useState, useEffect } from 'react'
import { RecipeMeta } from '../components/RecipeMeta/RecipeMeta'
import { getRecipeMetas } from '../services/recipe'
import type { RecipeMeta as RecipeMetaType } from '../types'

const RecipesPage: React.FC = () => {
  const [recipeMetas, setRecipeMetas] = useState<RecipeMetaType[] | null>(null)

  useEffect(() => {
    getRecipeMetas()
      .then((recipeMetas) => setRecipeMetas(recipeMetas))
      .catch((error) => console.error('Error fetching recipes:', error))
  }, [])

  return (
    <>
      {!recipeMetas ? (
        <div>Loading...</div>
      ) : (
        <div id="recipe-container">
          {recipeMetas.map((recipeMeta, index) => (
            <RecipeMeta recipeMeta={recipeMeta} key={index}></RecipeMeta>
          ))}
        </div>
      )}
    </>
  )
}

export default RecipesPage
