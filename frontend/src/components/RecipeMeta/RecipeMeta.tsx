import { ListItemButton, ListItemText, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { RecipeMeta as RecipeMetaType } from '~/types'
import garbage from '~/assets/icons/garbage.svg'
import { deleteRecipe } from '~/services/recipe'

interface RecipeMetaProps {
  recipeMeta: RecipeMetaType
}

export const RecipeMeta: React.FC<RecipeMetaProps> = ({ recipeMeta }) => {
  const navigate = useNavigate()

  const handleClick = (): void => {
    navigate(`/recipes/${recipeMeta.Id}`)
  }

  const handleDelete = async (event: React.MouseEvent): Promise<void> => {
    event.stopPropagation()
    const response = await deleteRecipe(recipeMeta.Id)
  }

  return (
    <ListItemButton onClick={handleClick}>
      <ListItemText primary={`${recipeMeta.name}`} />
      <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
        <img alt="copy" src={garbage} height={20} width={20} />
      </IconButton>
    </ListItemButton>
  )
}
