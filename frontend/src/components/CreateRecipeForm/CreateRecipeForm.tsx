import React, { useState, ChangeEvent, FormEvent } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { createRecipe } from '../../services/recipe';
import { Recipe } from '../../../../types/types';

interface ChildComponentProps {
  onCreateRecipe: (recipe: Recipe) => void;
}

export const CreateRecipeForm: React.FC<ChildComponentProps> = ({ onCreateRecipe }) => {


  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createRecipe(inputValue)
      .then(recipe => onCreateRecipe(recipe))
      .catch(error => console.error('Error creating recipe:', error))
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
    >
      <TextField
        label="Enter Recipe URL"
        variant="outlined"
        value={inputValue}
        onChange={handleInputChange}
      />
      <Button variant="contained" color="primary" type="submit">
        Create
      </Button>
    </Box>
  );
}