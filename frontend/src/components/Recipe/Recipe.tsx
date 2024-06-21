import Container from '@mui/material/Container'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import type { Recipe as RecipeType, Ingredient } from '../../types'
import cutlery from '~assets/icons/cutlery.jpeg'
import clock from '~assets/icons/clock.jpeg'
import './Recipe.css'

interface RecipeProps {
  recipe: RecipeType
}

export const Recipe: React.FC<RecipeProps> = ({ recipe }) => {
  const formatIngredient = (ingredient: Ingredient): string => {
    return `${ingredient.ingredient} - ${ingredient.amount}${ingredient.units ? ` ${ingredient.units}` : ''}${ingredient.preparation ? `, ${ingredient.preparation}` : ''}`
  }

  return (
    <Container className="recipe-container">
      <h2>
        <a href={recipe.SourceUrl} target="_blank" rel="noopener noreferrer">
          {recipe.name}
        </a>
      </h2>
      <p>{recipe.description}</p>
      <div className="recipe-stats">
        <div>
          <img src={cutlery} height="20" alt="Servings" />
          <strong>Servings:</strong> {recipe.servings}
        </div>
        <div>
          <img src={clock} height="20" alt="Prep Time" />
          <strong>Prep Time:</strong> {recipe.prepTime}min
        </div>
        <div>
          <img src={clock} height="20" alt="Cooking Time" />
          <strong>Cooking Time:</strong> {recipe.cookingTime}min
        </div>
      </div>
      <TableContainer component={Paper} className="recipe-steps">
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Ingredients:</TableCell>
              <TableCell>Steps:</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recipe.steps.map((step, stepIndex) => {
              return (
                <TableRow key={stepIndex}>
                  <TableCell>
                    <ul>
                      {step.ingredients?.map((ingredient, ingredientIndex) => (
                        <li key={ingredientIndex}>
                          {formatIngredient(ingredient)}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>
                    {stepIndex + 1}. {step.instructions}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}
