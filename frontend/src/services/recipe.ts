import { getIdTokenFromCookie } from './auth'
import { Recipe, RecipeMeta, CreateRecipeResponse } from '~/types'

const recipesEndpoint = `${import.meta.env.VITE_API_URL}/recipes`
const headers = {
  Authorization: `${getIdTokenFromCookie()}`,
}

export const getRecipe = async (recipeId: string): Promise<Recipe> => {
  const response = await fetch(`${recipesEndpoint}/${recipeId}`, { headers })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export const getRecipeMetas = async (): Promise<RecipeMeta[]> => {
  const response = await fetch(recipesEndpoint, { headers })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export const createRecipe = async (
  recipeUrl: string
): Promise<CreateRecipeResponse> => {
  const response = await fetch(recipesEndpoint, {
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipeUrl }),
  })
  if (response.status == 409) {
    return response.json()
  }
  if (!response.ok) {
    const { errorMessage } = await response.json()
    throw new Error(errorMessage)
  }
  return response.json()
}
