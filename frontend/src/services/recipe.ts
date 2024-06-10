import { Recipe } from "../types";

export const getRecipes = async (): Promise<Recipe[]> => {
  const response = await fetch('http://localhost:3000/recipes');
  return response.json()
}

export const createRecipe = async (recipeUrl: string): Promise<Recipe> => {
  const response = await fetch('http://localhost:3000/recipes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ recipeUrl })
  });
  return response.json()
}