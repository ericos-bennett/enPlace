import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import type { Recipe as RecipeType, Ingredient } from '../../types'
import './Recipe.css'

interface RecipeProps {
  recipe: RecipeType
}

export const Recipe: React.FC<RecipeProps> = ({ recipe }) => {
  const formatIngredient = (ingredient: Ingredient): string => {
    return `${ingredient.ingredient} - ${ingredient.amount}${ingredient.units ? ` ${ingredient.units}` : ''}${ingredient.preparation ? `, ${ingredient.preparation}` : ''}`
  }

  return (
    <TableContainer component={Paper} className="recipe-container">
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
            <TableCell colSpan={2}>
              <a
                href={recipe.SourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {recipe.SourceUrl}
              </a>
            </TableCell>
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
            <TableCell>{recipe.prepTime} minutes</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Cooking Time:</TableCell>
            <TableCell>{recipe.cookingTime} minutes</TableCell>
          </TableRow>
          {recipe.steps.map((step, stepIndex) => {
            return (
              <TableRow key={stepIndex}>
                {step.ingredients?.map((ingredient, ingredientIndex) => (
                  <TableRow key={ingredientIndex}>
                    <TableCell>{formatIngredient(ingredient)}</TableCell>
                  </TableRow>
                ))}
                <TableCell>
                  {stepIndex + 1}. {step.instructions}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
