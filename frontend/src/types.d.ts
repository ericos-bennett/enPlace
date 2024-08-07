export type RecipeMeta = {
  Id: string
  CreatedAt: string
  UserId: string
  SourceUrl: string
  name: string
}

export type Recipe = RecipeMeta & {
  description: string
  servings: number
  totalTime: number
  steps: Step[]
}

export type Step = {
  instructions: string
  ingredients?: Ingredient[]
}

export type Ingredient = {
  ingredient: string
  amount?: string
  units?: string
  preparation?: string
}

export type DeleteRecipeResponse = {
  message: string
}

export type CreateRecipeResponse = {
  recipeId: string
}
