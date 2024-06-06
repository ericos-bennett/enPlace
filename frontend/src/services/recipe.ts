import { Recipe } from "../types";

const testRecipePath: string = '/src/assets/testRecipes.json'

export const getRecipes = (): Promise<Recipe[]> => {
  return fetch(testRecipePath)
    .then(response => response.json())
}