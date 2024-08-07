import { useState } from 'react'
import {
  Button,
  Container,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from '@mui/material'
import type { Recipe as RecipeType, Ingredient } from '~/types'
import cutlery from '~/assets/icons/cutlery.svg'
import clock from '~/assets/icons/clock.svg'
import copy from '~/assets/icons/copy.svg'
import './Recipe.css'

interface RecipeProps {
  recipe: RecipeType
}

export const Recipe: React.FC<RecipeProps> = ({ recipe }) => {
  const [copiedTooltipOpen, setCopiedTooltipOpen] = useState(false)

  const formatIngredient = (ingredient: Ingredient): string => {
    return `${ingredient.ingredient}${ingredient.amount ? ` - ${ingredient.amount}` : ''}${ingredient.units ? ` ${ingredient.units}` : ''}${ingredient.preparation ? `, ${ingredient.preparation}` : ''}`
  }

  const handleCopy = async () => {
    const formattedIngredients = recipe.steps
      .flatMap((step) => step.ingredients || [])
      .map(
        ({ ingredient, amount, units }) =>
          `${ingredient} - ${amount} ${units || ''}`
      )
      .join('\n')

    try {
      await navigator.clipboard.writeText(formattedIngredients)
      setCopiedTooltipOpen(true)
      setTimeout(() => setCopiedTooltipOpen(false), 2000)
    } catch (error) {
      console.error('Failed to copy text: ', error)
    }
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
        <Tooltip title="Copied!" placement="left" open={copiedTooltipOpen}>
          <Button
            className="copy-ingredients-button"
            variant="outlined"
            startIcon={<img alt="copy" src={copy} height={20} width={20} />}
            onClick={handleCopy}
          >
            Copy Ingredients to Clipboard
          </Button>
        </Tooltip>
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
                        <li key={ingredientIndex} className="ingredient-item">
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
