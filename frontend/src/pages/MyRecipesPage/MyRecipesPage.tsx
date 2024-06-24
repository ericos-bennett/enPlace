import { useState, useEffect } from 'react'
import { TextField } from '@mui/material'
import { RecipeMeta } from '~/components/RecipeMeta/RecipeMeta'
import { getRecipeMetas } from '~/services/recipe'
import type { RecipeMeta as RecipeMetaType } from '~/types'
import './MyRecipesPage.css'

export const MyRecipesPage: React.FC = () => {
  const [recipeMetas, setRecipeMetas] = useState<RecipeMetaType[] | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    getRecipeMetas()
      .then((recipeMetas) => setRecipeMetas(recipeMetas))
      .catch((error) => console.error('Error fetching recipes:', error))
  }, [])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredRecipeMetas = (
    recipeMetas: RecipeMetaType[]
  ): RecipeMetaType[] => {
    return recipeMetas.filter((recipeMeta) =>
      recipeMeta.name
        .toLocaleLowerCase()
        .includes(searchTerm.toLocaleLowerCase())
    )
  }

  return (
    <>
      <div className="my-recipes-container">
        <div className="my-recipes-title">
          <h1>My Recipes</h1>
          <TextField
            label="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            autoComplete="off"
            variant="outlined"
            margin="normal"
            fullWidth
          />
        </div>
        {recipeMetas && (
          <div className="recipe-metas">
            {filteredRecipeMetas(recipeMetas).map((recipeMeta, index) => (
              <RecipeMeta recipeMeta={recipeMeta} key={index}></RecipeMeta>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
