import { Heart } from 'lucide-react'

export default function Favorites() {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">Favorites</h1>
        <p className="page-subtitle">Recipes you've saved for quick access.</p>
      </div>

      <div className="empty-state">
        <div className="empty-icon">
          <Heart size={48} strokeWidth={1.25} />
        </div>
        <h2 className="empty-title">No favorites yet</h2>
        <p className="empty-text">
          Tap the heart on any recipe to save it here. Your personal cookbook starts now.
        </p>
        <a href="/recipes" className="btn btn-primary">
          Browse Recipes
        </a>
      </div>
    </div>
  )
}
