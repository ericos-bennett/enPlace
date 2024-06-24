import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Container } from '@mui/material'
import { HomePage } from '~/pages/HomePage/HomePage'
import { RecipePage } from '~/pages/RecipePage/RecipePage'
import { MyRecipesPage } from '~/pages/MyRecipesPage/MyRecipesPage'
import { NotFoundPage } from '~/pages/NotFoundPage/NotFoundPage'
import { Header } from '~/components/Header/Header'
import { Footer } from '~/components/Footer/Footer'
import './App.css'

export const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Container maxWidth={false} className="page-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipes" element={<MyRecipesPage />} />
            <Route path="/recipes/404" element={<NotFoundPage />} />
            <Route path="/recipes/:recipeId" element={<RecipePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Container>
        <Footer />
      </BrowserRouter>
    </div>
  )
}
