import './App.css'
import { Routes, Route, BrowserRouter } from "react-router-dom"
import HomePage from '../../pages/HomePage'
import RecipePage from '../../pages/RecipePage'
import NotFoundPage from '../../pages/NotFoundPage'


const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipes/:recipeId" element={<RecipePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App