import {
  Container,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material'
import type { Recipe as RecipeType, Ingredient } from '~/types'
import cutlery from '~/assets/icons/cutlery.jpeg'
import clock from '~/assets/icons/clock.jpeg'
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
          <img src={clock} height="20" alt="Total Time" />
          <strong>Total Time:</strong> {recipe.totalTime}min
        </div>
      </div>
      <TableContainer className="recipe-steps">
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className="ingredients-column">Ingredients:</TableCell>
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
