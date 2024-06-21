import { ListItemButton, ListItemText } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import type { RecipeMeta as RecipeMetaType } from '~/types'

interface RecipeMetaProps {
  recipeMeta: RecipeMetaType
}

export const RecipeMeta: React.FC<RecipeMetaProps> = ({ recipeMeta }) => {
  const navigate = useNavigate()

  const handleClick = (): void => {
    navigate(`/recipes/${recipeMeta.Id}`)
  }

  const formatCreatedAt = (createdAt: string): string => {
    return moment(createdAt).format('MMM DD, YYYY, h:mm:ss A')
  }

  return (
    <ListItemButton onClick={handleClick}>
      <ListItemText
        primary={`${recipeMeta.name} - Saved at ${formatCreatedAt(recipeMeta.CreatedAt)}`}
      />
    </ListItemButton>
  )
}
