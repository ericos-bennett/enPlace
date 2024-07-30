import { useEffect } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Box, Container } from '@mui/material'
import { getAuthTokensAndSave, getIdToken } from '~/services/auth'
import { useAuthStore } from '~/store/auth'
import { HomePage } from '~/pages/HomePage/HomePage'
import { RecipePage } from '~/pages/RecipePage/RecipePage'
import { MyRecipesPage } from '~/pages/MyRecipesPage/MyRecipesPage'
import { NotFoundPage } from '~/pages/NotFoundPage/NotFoundPage'
import { Header } from '~/components/Header/Header'
import '~/App.css'

export const App: React.FC = () => {
  const { setIsLoggedIn } = useAuthStore()

  useEffect(() => {
    if (getIdToken()) {
      setIsLoggedIn(true)
    }
  }, [])

  useEffect(() => {
    const handleCallback = async () => {
      const searchParams = new URLSearchParams(window.location.search)
      const authCode = searchParams.get('code')

      if (authCode) {
        getAuthTokensAndSave(authCode)
      }
    }

    handleCallback()
  }, [])

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
          <Route path="/callback" element={<HomePage />} />
          <Route path="/logout" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  )
}
