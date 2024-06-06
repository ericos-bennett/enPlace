import './App.css'
import { useState, useEffect } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Recipe, Ingredient } from './types'

const App: React.FC = () => {
  const testRecipePath: string = '/src/assets/testRecipe3.json'

  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    fetch(testRecipePath)
      .then(response => response.json())
      .then(data => setRecipe(data))
      .catch(error => console.error('Error loading JSON:', error))
  }, []);

  const formatIngredient = (ingredient: Ingredient): string => {
    return `${ingredient.ingredient} - ${ingredient.amount}${ingredient.units ? ` ${ingredient.units}` : ''}${ingredient.preparation ? `, ${ingredient.preparation}` : ''}`
  }

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
                <TableCell>Author:</TableCell>
                <TableCell>{recipe.author}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Servings:</TableCell>
                <TableCell>{recipe.servings}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Prep Time:</TableCell>
                <TableCell>{recipe.prepTime}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Serving Time:</TableCell>
                <TableCell>{recipe.cookingTime}</TableCell>
              </TableRow>
              {recipe.steps.map((step, stepIndex) => {
                return (
                  <TableRow key={stepIndex}>
                    {step.ingredients?.map((ingredient, ingredientIndex) => (
                      <TableRow key={ingredientIndex}>
                        <TableCell>{formatIngredient(ingredient)}</TableCell>
                      </TableRow>
                    ))}
                    <TableCell>{stepIndex + 1}. {step.instructions}</TableCell>
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
