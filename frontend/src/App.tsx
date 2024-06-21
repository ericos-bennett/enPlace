import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Container } from '@mui/material'
import HomePage from '~/pages/HomePage/HomePage'
import RecipePage from '~/pages/RecipePage/RecipePage'
import RecipesPage from '~/pages/RecipesPage/RecipesPage'
import NotFoundPage from '~/pages/NotFoundPage/NotFoundPage'
import Header from '~/components/Header/Header'
import Footer from '~/components/Footer/Footer'
import './App.css'

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Container maxWidth={false} className="pageContainer">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipes" element={<RecipesPage />} />
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

export default App
