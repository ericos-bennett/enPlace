import express, { Request, Response } from 'express'
import cors from 'cors';
import { createRecipe, getRecipes } from './recipe.js'
import { Recipe } from "../../types/types.js";

// Create an Express app
const app = express();
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your client's origin
};
app.use(cors(corsOptions));
app.use(express.json());


app.get('/recipes', async (req: Request, res: Response) => {
  const recipes: Recipe[] = await getRecipes()
  res.send(recipes);
});

app.post('/recipes', async (req: Request, res: Response) => {
  const { recipeUrl } = req.body
  const recipe: Recipe = await createRecipe(recipeUrl)
  res.send(recipe)
})

// Start the server
const PORT: number = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
