import { promises as fs } from 'fs';
import { Recipe } from "../../types/types.js";

export const getRecipes = async (): Promise<Recipe[]> => {
  const testRecipesPath: string = './test/testRecipes.json'

  try {
    const data: string = await fs.readFile(testRecipesPath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading file:', error)
    throw error
  }
}

export const createRecipe = async (recipeUrl: string): Promise<Recipe> => {
  const testRecipePath: string = './test/testRecipe.json'
  console.log(`Creating recipe from URL: ${recipeUrl}`)

  try {
    const data: string = await fs.readFile(testRecipePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error creating recipe:', error)
    throw error
  }
}
