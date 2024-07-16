export type RecipeMeta = {
  Id: string
  CreatedAt: string
  UserId: number
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
  preparation?: string
  amount: number
  units?: string
}

export type CreateRecipeResponse = {
  recipeId: string
}
