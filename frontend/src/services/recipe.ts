import { callApi } from '~/services/api'
import { Recipe, RecipeMeta, CreateRecipeResponse } from '~/types'

const recipesEndpoint = `${import.meta.env.VITE_API_URL}/recipes`

export const getRecipe = async (recipeId: string): Promise<Recipe> => {
  return await callApi(`${recipesEndpoint}/${recipeId}`, 'GET')
}

export const getRecipeMetas = async (): Promise<RecipeMeta[]> => {
  return await callApi(recipesEndpoint, 'GET')
}

export const createRecipe = async (
  recipeUrl: string
): Promise<CreateRecipeResponse> => {
  return await callApi(recipesEndpoint, 'POST', JSON.stringify({ recipeUrl }))
}
