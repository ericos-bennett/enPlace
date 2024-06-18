import React, { useState, ChangeEvent, FormEvent } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { createRecipe } from '../../services/recipe'
import { Recipe } from '../../types'

interface CreateRecipeFormProps {
  onCreateRecipe: (recipe: Recipe) => void
}

export const CreateRecipeForm: React.FC<CreateRecipeFormProps> = ({
  onCreateRecipe,
}) => {
  const [inputValue, setInputValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const recipe: Recipe = await createRecipe(inputValue)
      onCreateRecipe(recipe)
      setInputValue('')
    } catch (error) {
      console.log('Error creating recipe:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="Enter Recipe URL"
        variant="outlined"
        value={inputValue}
        onChange={handleInputChange}
        disabled={isSubmitting}
      />
      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Create'}
      </Button>
    </Box>
  )
}
