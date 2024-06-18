export type RecipeMeta = {
  Id: string
  CreatedAt: string
  UserId: number
  name: string
}

export type Recipe = RecipeMeta & {
  description: string
  author: string
  servings: number
  prepTime: number
  cookingTime: number
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
