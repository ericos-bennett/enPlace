import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { TextField } from '@mui/material'
import { RecipeMeta } from '~/components/RecipeMeta/RecipeMeta'
import { getRecipeMetas, deleteRecipe } from '~/services/recipe'
import type { RecipeMeta as RecipeMetaType } from '~/types'
import './MyRecipesPage.css'

export const MyRecipesPage: React.FC = () => {
  const [recipeMetas, setRecipeMetas] = useState<RecipeMetaType[] | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const titleRef = useRef<HTMLDivElement>(null)
  const [titleHeight, setTitleHeight] = useState(0)

  useEffect(() => {
    getRecipeMetas()
      .then((recipeMetas) => setRecipeMetas(recipeMetas))
      .catch((error) => console.error('Error fetching recipes:', error))
  }, [])

  useLayoutEffect(() => {
    const updateTitleHeight = () => {
      if (titleRef.current) {
        setTitleHeight(titleRef.current.offsetHeight)
      }
    }
    updateTitleHeight()
    window.addEventListener('resize', updateTitleHeight)
    return () => window.removeEventListener('resize', updateTitleHeight)
  }, [])

  const onDelete = async (recipeId: string): Promise<void> => {
    await deleteRecipe(recipeId)
    setRecipeMetas(
      (prevRecipes) =>
        prevRecipes?.filter((recipe) => recipe.Id !== recipeId) || null
    )
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredRecipeMetas = (
    recipeMetas: RecipeMetaType[]
  ): RecipeMetaType[] => {
    return recipeMetas
      .filter((recipeMeta) =>
        recipeMeta.name
          .toLocaleLowerCase()
          .includes(searchTerm.toLocaleLowerCase())
      )
      .sort(
        (a, b) =>
          new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime()
      )
  }

  return (
    <>
      <div className="my-recipes-container">
        <div className="my-recipes-title" ref={titleRef}>
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
          <div className="recipe-metas" style={{ paddingTop: titleHeight }}>
            {filteredRecipeMetas(recipeMetas).map((recipeMeta, index) => (
              <RecipeMeta
                recipeMeta={recipeMeta}
                onDelete={onDelete}
                key={index}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
