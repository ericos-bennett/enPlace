import { Box, Container, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { CreateRecipeForm } from '~/components/CreateRecipeForm/CreateRecipeForm'
import cutlery from '~/assets/icons/cutlery.svg'
import clock from '~/assets/icons/clock.svg'
import copy from '~/assets/icons/copy.svg'
import './HomePage.css'

const STEPS = [
  {
    title: 'Paste a link',
    description: 'Drop in the URL of any recipe blog or site.',
  },
  {
    title: 'We do the reading',
    description:
      'Our AI skips the life story and ads, and pulls out just the recipe.',
  },
  {
    title: 'Cook without the scroll',
    description: 'Get ingredients and steps in one clean, printable view.',
  },
]

export const HomePage: React.FC = () => {
  const navigate = useNavigate()

  const handleCreateRecipe = (recipeId: string) => {
    navigate(`/recipes/${recipeId}`)
  }

  return (
    <Box className="home-page">
      <Box className="hero-section">
        <Container className="hero-container">
          <Typography variant="h2" component="h1" className="hero-headline">
            Reliable recipes, no scrolling
          </Typography>
          <Typography variant="h6" component="p" className="hero-subhead">
            Paste any recipe link and get a clean, ad-free recipe card in
            seconds &mdash; just the ingredients and steps, nothing else.
          </Typography>
          <CreateRecipeForm onCreateRecipe={handleCreateRecipe} />
        </Container>
      </Box>

      <Container className="demo-section">
        <div className="demo-comparison">
          <div className="mock-window mock-window-before">
            <div className="mock-window-bar">
              <span className="mock-dot" />
              <span className="mock-dot" />
              <span className="mock-dot" />
              <span className="mock-window-label">yourfavoriteblog.com</span>
            </div>
            <div className="mock-window-body mock-blog">
              <div className="mock-line mock-line-title" />
              <div className="mock-line" />
              <div className="mock-line" />
              <div className="mock-line mock-line-short" />
              <div className="mock-ad">Advertisement</div>
              <div className="mock-line" />
              <div className="mock-line" />
              <div className="mock-line mock-line-short" />
              <div className="mock-fade" />
            </div>
            <p className="demo-caption">1,400 words before the recipe</p>
          </div>

          <div className="demo-arrow" aria-hidden="true">
            &rarr;
          </div>

          <div className="mock-window mock-window-after">
            <div className="mock-window-bar">
              <span className="mock-dot" />
              <span className="mock-dot" />
              <span className="mock-dot" />
              <span className="mock-window-label">enPlace</span>
            </div>
            <div className="mock-window-body mock-recipe">
              <div className="mock-recipe-title">Weeknight Skillet Pasta</div>
              <div className="mock-recipe-stats">
                <span>
                  <img src={cutlery} height={14} alt="" /> Serves 4
                </span>
                <span>
                  <img src={clock} height={14} alt="" /> 25 min
                </span>
                <span className="mock-recipe-copy">
                  <img src={copy} height={12} alt="" /> Copy
                </span>
              </div>
              <table className="mock-recipe-table">
                <thead>
                  <tr>
                    <th>Ingredients:</th>
                    <th>Steps:</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <ul>
                        <li>Pasta - 12 oz</li>
                        <li>Cherry tomatoes - 2 cups</li>
                      </ul>
                    </td>
                    <td>1. Boil pasta in salted water until al dente.</td>
                  </tr>
                  <tr>
                    <td>
                      <ul>
                        <li>Garlic - 3 cloves, minced</li>
                      </ul>
                    </td>
                    <td>2. Saut&eacute; garlic in olive oil until fragrant.</td>
                  </tr>
                  <tr>
                    <td>
                      <ul>
                        <li>Parmesan - &frac14; cup, grated</li>
                      </ul>
                    </td>
                    <td>3. Toss together and top with parmesan.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="demo-caption">Just the recipe</p>
          </div>
        </div>
      </Container>

      <Container className="steps-section">
        <Typography variant="h4" component="h2" className="section-heading">
          How it works
        </Typography>
        <div className="steps-grid">
          {STEPS.map((step, index) => (
            <div className="step-card" key={step.title}>
              <div className="step-number">{index + 1}</div>
              <Typography variant="h6" component="h3">
                {step.title}
              </Typography>
              <Typography variant="body2" className="step-description">
                {step.description}
              </Typography>
            </div>
          ))}
        </div>
      </Container>
    </Box>
  )
}
