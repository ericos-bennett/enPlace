import './App.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Container } from '@mui/material'
import HomePage from '../../pages/HomePage'
import RecipePage from '../../pages/RecipePage'
import NotFoundPage from '../../pages/NotFoundPage'
import RecipesPage from '../../pages/RecipesPage'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Container maxWidth={false}>
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
