import express, { Request, Response } from 'express'
import cors from 'cors';
import { getRecipes } from './recipe.js'
import { Recipe } from "../../types/types.js";

// Create an Express app
const app = express();
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your client's origin
};
app.use(cors(corsOptions));

// Define a route
app.get('/recipes', async (req: Request, res: Response) => {
  const recipes: Recipe[] = await getRecipes()
  res.send(recipes);
});

// Start the server
const PORT: number = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
