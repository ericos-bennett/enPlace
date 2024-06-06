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
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>{recipe.name}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{recipe.description}</TableCell>
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
            </TableBody>
          </Table >
        </TableContainer >)}
    </>
  )
}

export default App
