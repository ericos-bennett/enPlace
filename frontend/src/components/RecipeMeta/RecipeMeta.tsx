import { ListItemButton, ListItemText } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { RecipeMeta as RecipeMetaType } from '~/types'

interface RecipeMetaProps {
  recipeMeta: RecipeMetaType
}

export const RecipeMeta: React.FC<RecipeMetaProps> = ({ recipeMeta }) => {
  const navigate = useNavigate()

  const handleClick = (): void => {
    navigate(`/recipes/${recipeMeta.Id}`)
  }

  return (
    <ListItemButton onClick={handleClick}>
      <ListItemText primary={`${recipeMeta.name}`} />
    </ListItemButton>
  )
}
