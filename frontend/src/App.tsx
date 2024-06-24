import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Box, Container } from '@mui/material'
import { HomePage } from '~/pages/HomePage/HomePage'
import { RecipePage } from '~/pages/RecipePage/RecipePage'
import { MyRecipesPage } from '~/pages/MyRecipesPage/MyRecipesPage'
import { NotFoundPage } from '~/pages/NotFoundPage/NotFoundPage'
import { Header } from '~/components/Header/Header'
import { Footer } from '~/components/Footer/Footer'
import './App.css'

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Box id="page-header">
        <Header />
      </Box>
      <Container maxWidth={false} id="page-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipes" element={<MyRecipesPage />} />
          <Route path="/recipes/404" element={<NotFoundPage />} />
          <Route path="/recipes/:recipeId" element={<RecipePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
      <Box id="page-footer">
        <Footer />
      </Box>
    </BrowserRouter>
  )
}
