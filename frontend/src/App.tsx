import { useState, useEffect } from 'react'
import './App.css'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Recipe } from './types'

function App() {
  const testRecipePath = '/src/testRecipe.json'

  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    fetch(testRecipePath)
      .then(response => response.json())
      .then(data => setRecipe(data))
      .catch(error => console.error('Error loading JSON:', error))
  }, []);

  return (
    <>
      {!recipe ? (
        <div>Loading...</div>
      ) :
        (<TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell colSpan={2}>{recipe.name}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={2}>{recipe.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Author: </TableCell>
                <TableCell>{recipe.author}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Servings: </TableCell>
                <TableCell>{recipe.servings}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Prep Time: </TableCell>
                <TableCell>{recipe.prepTime}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Serving Time: </TableCell>
                <TableCell>{recipe.cookingTime}</TableCell>
              </TableRow>
              {recipe.steps.map((step) => {
                const ingredientCount = step.ingredients.length
                return (
                  <TableRow>
                    {step.ingredients.map((ingredient) => (
                      <TableRow>
                        <TableCell>{ingredient.ingredient} - {ingredient.amount} {ingredient.units}, {ingredient.preparation}</TableCell>
                      </TableRow>
                    ))}
                    <TableCell rowSpan={ingredientCount}>{step.instructions}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table >
        </TableContainer >)}
    </>
  )
}

export default App
