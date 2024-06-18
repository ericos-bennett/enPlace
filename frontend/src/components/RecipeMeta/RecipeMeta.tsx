import type { RecipeMeta as RecipeMetaType } from '../../types'

interface RecipeMetaProps {
  recipeMeta: RecipeMetaType
}

export const RecipeMeta: React.FC<RecipeMetaProps> = ({ recipeMeta }) => {
  return `${recipeMeta.name} - ${recipeMeta.CreatedAt}`
}
