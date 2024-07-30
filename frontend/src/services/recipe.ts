import { callApi } from '~/services/api'
import { Recipe, RecipeMeta, CreateRecipeResponse } from '~/types'

const resource = 'recipes'

export const getRecipe = async (recipeId: string): Promise<Recipe> => {
  return await callApi(`${resource}/${recipeId}`, 'GET')
}

export const getRecipeMetas = async (): Promise<RecipeMeta[]> => {
  return await callApi(resource, 'GET')
}

export const createRecipe = async (
  recipeUrl: string
): Promise<CreateRecipeResponse> => {
  return await callApi(resource, 'POST', JSON.stringify({ recipeUrl }))
}
