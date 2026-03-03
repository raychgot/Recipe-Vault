import { Utensils } from 'lucide-react'

const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks', 'Vegetarian']

export default function Recipes() {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">Recipes</h1>
        <p className="page-subtitle">Discover and explore recipes from around the world.</p>
      </div>

      <div className="recipes-toolbar">
        <input
          className="search-input"
          type="search"
          placeholder="Search by name or ingredient…"
          disabled
        />
        <select className="filter-select" disabled>
          <option>Sort by: Newest</option>
        </select>
      </div>

      <div className="category-chips">
        {categories.map((cat) => (
          <button key={cat} className={`chip${cat === 'All' ? ' chip--active' : ''}`} disabled>
            {cat}
          </button>
        ))}
      </div>

      <div className="empty-state">
        <div className="empty-icon">
          <Utensils size={48} strokeWidth={1.25} />
        </div>
        <h2 className="empty-title">No recipes yet</h2>
        <p className="empty-text">
          Recipes you add or browse will appear here. Check back soon!
        </p>
        <a href="/add-recipe" className="btn btn-primary">
          Add the First Recipe
        </a>
      </div>
    </div>
  )
}
