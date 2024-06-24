import { useState, useEffect } from 'react'
import { RecipeMeta } from '~/components/RecipeMeta/RecipeMeta'
import { getRecipeMetas } from '~/services/recipe'
import type { RecipeMeta as RecipeMetaType } from '~/types'
import './MyRecipesPage.css'

export const MyRecipesPage: React.FC = () => {
  const [recipeMetas, setRecipeMetas] = useState<RecipeMetaType[] | null>(null)

  useEffect(() => {
    getRecipeMetas()
      .then((recipeMetas) => setRecipeMetas(recipeMetas))
      .catch((error) => console.error('Error fetching recipes:', error))
  }, [])

  return (
    <>
      <div className="my-recipes-container">
        <h1>My Recipes</h1>
        {recipeMetas && (
          <div>
            {recipeMetas.map((recipeMeta, index) => (
              <RecipeMeta recipeMeta={recipeMeta} key={index}></RecipeMeta>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
