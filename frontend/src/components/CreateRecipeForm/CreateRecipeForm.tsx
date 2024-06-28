import React, { useState, ChangeEvent, FormEvent } from 'react'
import { Box, Button, TextField, Alert } from '@mui/material'
import { createRecipe } from '~/services/recipe'
import './CreateRecipeForm.css'

interface CreateRecipeFormProps {
  onCreateRecipe: (recipeId: string) => void
}

export const CreateRecipeForm: React.FC<CreateRecipeFormProps> = ({
  onCreateRecipe,
}) => {
  const [inputValue, setInputValue] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null) // State to hold error message

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    setError(null)

    try {
      const { recipeId } = await createRecipe(inputValue)
      onCreateRecipe(recipeId)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setInputValue('')
      setIsSubmitting(false)
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="create-recipe-form"
    >
      {error && (
        <Alert severity="warning" className="create-recipe-alert">
          {error}
        </Alert>
      )}
      <TextField
        label="Enter Recipe URL"
        value={inputValue}
        onChange={handleInputChange}
        disabled={isSubmitting}
        autoComplete="off"
        variant="outlined"
        className="create-recipe-form-input"
      />
      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting' : 'Create'}
      </Button>
    </Box>
  )
}
