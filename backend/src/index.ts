import express, { Request, Response } from 'express'
import { getRecipes } from './recipes.js'

// Create an Express app
const app = express();

// Define a route
app.get('/recipes', (req: Request, res: Response) => {
  const recipes = getRecipes()
  res.send(recipes);
});

// Start the server
const PORT: number = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
