import { Routes, Route, BrowserRouter } from "react-router-dom"
import HomePage from '../pages/HomePage'
import RecipePage from '../pages/RecipePage'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes/:recipeId" element={<RecipePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes