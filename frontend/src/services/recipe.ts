import { Recipe } from '../types'

export const getRecipes = async (): Promise<Recipe[]> => {
  const response = await fetch('https://4hy8n1eowd.execute-api.localhost.localstack.cloud:4566/local/recipes');
  return response.json()
}

export const createRecipe = async (recipeUrl: string): Promise<Recipe> => {
  const response = await fetch('https://4hy8n1eowd.execute-api.localhost.localstack.cloud:4566/local/recipes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ recipeUrl })
  });
  return response.json()
}