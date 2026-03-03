import { useNavigate } from 'react-router-dom'
import { BookOpen, PenLine, Search, Bookmark } from 'lucide-react'

const features = [
  {
    Icon: BookOpen,
    title: 'Browse Recipes',
    description: 'Explore a curated collection of recipes from every cuisine and skill level.',
  },
  {
    Icon: PenLine,
    title: 'Add Your Own',
    description: 'Contribute your personal recipes and share them with the community.',
  },
  {
    Icon: Search,
    title: 'Search & Filter',
    description: 'Instantly find recipes by ingredient, category, cooking time, or dietary need.',
  },
  {
    Icon: Bookmark,
    title: 'Save Favorites',
    description: 'Bookmark the recipes you love and build your personal cookbook.',
  },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">Recipe Management Made Simple</div>
          <h1 className="hero-title">
            Your Personal <em>Recipe Vault</em>
          </h1>
          <p className="hero-description">
            Recipe Vault is a recipe management app designed to make cooking easier and more
            enjoyable. Browse a rich collection of recipes, add and store your own creations,
            search and filter by ingredient or category, and save your favorites for quick
            access — all in one beautifully simple place.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => navigate('/signup')}>
              Get Started
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/recipes')}>
              Browse Recipes
            </button>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="features-inner">
          <p className="features-eyebrow">What's inside</p>
          <h2 className="features-heading">Everything you need to cook with confidence</h2>
          <p className="features-subheading">
            From discovering new dishes to organizing your own recipes, Recipe Vault keeps your
            kitchen life in one place.
          </p>
          <div className="feature-grid">
            {features.map(({ Icon, title, description }) => (
              <div className="feature-card" key={title}>
                <div className="feature-icon-wrap">
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <h3 className="feature-title">{title}</h3>
                <p className="feature-description">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
