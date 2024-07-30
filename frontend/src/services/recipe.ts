import { getIdToken, refreshIdToken } from './auth'
import { Recipe, RecipeMeta, CreateRecipeResponse } from '~/types'

const recipesEndpoint = `${import.meta.env.VITE_API_URL}/recipes`

export const getRecipe = async (recipeId: string): Promise<Recipe> => {
  const response = await fetch(`${recipesEndpoint}/${recipeId}`, {
    headers: {
      Authorization: `${getIdToken()}`,
    },
  })
  if (response.status == 401) {
    const refreshed = await refreshIdToken()
    if (refreshed) {
      getRecipe(recipeId)
    }
  }
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export const getRecipeMetas = async (): Promise<RecipeMeta[]> => {
  const response = await fetch(recipesEndpoint, {
    headers: {
      Authorization: `${getIdToken()}`,
    },
  })
  if (response.status == 401) {
    const refreshed = await refreshIdToken()
    if (refreshed) {
      getRecipeMetas()
    }
  }
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export const createRecipe = async (
  recipeUrl: string
): Promise<CreateRecipeResponse> => {
  const response = await fetch(recipesEndpoint, {
    method: 'POST',
    body: JSON.stringify({ recipeUrl }),
    headers: {
      Authorization: `${getIdToken()}`,
      'Content-Type': 'application/json',
    },
  })
  if (response.status == 409) {
    return response.json()
  }
  if (response.status == 401) {
    const refreshed = await refreshIdToken()
    if (refreshed) {
      createRecipe(recipeUrl)
    }
  }
  if (!response.ok) {
    const { errorMessage } = await response.json()
    throw new Error(errorMessage)
  }
  return response.json()
}
