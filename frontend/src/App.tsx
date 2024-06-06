import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const testRecipePath = '/src/testRecipe.json'

  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    fetch(testRecipePath)
      .then(response => response.json())
      .then(data => setRecipe(data))
      .catch(error => console.error('Error loading JSON:', error));
  }, []);

  return (
    <>
      <pre>{JSON.stringify(recipe, null, 2)}</pre>
    </>
  )
}

export default App
