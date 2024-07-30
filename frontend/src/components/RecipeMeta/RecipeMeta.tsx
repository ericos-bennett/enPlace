import { ListItemButton, ListItemText, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { RecipeMeta as RecipeMetaType } from '~/types'
import garbage from '~/assets/icons/garbage.svg'

interface RecipeMetaProps {
  recipeMeta: RecipeMetaType
  onDelete: (recipeId: string) => Promise<void>
}

export const RecipeMeta: React.FC<RecipeMetaProps> = ({
  recipeMeta,
  onDelete,
}) => {
  const navigate = useNavigate()

  const handleClick = (): void => {
    navigate(`/recipes/${recipeMeta.Id}`)
  }

  const handleDelete = (event: React.MouseEvent): void => {
    event.stopPropagation()
    onDelete(recipeMeta.Id)
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
