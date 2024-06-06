export type Recipe = {
  name: string;
  description: string;
  author: string;
  servings: number;
  prepTime: number;
  cookingTime: number;
  steps: Step[]
};

export type Step = {
  ingredients: Ingredient[];
  instructions: string;
};

export type Ingredient = {
  ingredient: string;
  preparation: string;
  amount: number;
  units?: string;
};
