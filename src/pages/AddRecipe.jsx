export default function AddRecipe() {
  return (
    <div className="page-wrapper page-wrapper--narrow">
      <div className="page-header">
        <h1 className="page-title">Add a Recipe</h1>
        <p className="page-subtitle">Share your culinary creation with the community.</p>
      </div>

      <form className="recipe-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label className="form-label">Recipe Title</label>
          <input className="form-input" type="text" placeholder="e.g. Classic Margherita Pizza" disabled />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" disabled>
              <option>Select a category…</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Prep Time</label>
            <input className="form-input" type="text" placeholder="e.g. 30 mins" disabled />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Ingredients</label>
          <textarea
            className="form-input form-textarea"
            placeholder="List each ingredient on a new line…"
            disabled
          />
        </div>

        <div className="form-group">
          <label className="form-label">Instructions</label>
          <textarea
            className="form-input form-textarea form-textarea--lg"
            placeholder="Step-by-step instructions…"
            disabled
          />
        </div>

        <div className="form-group">
          <label className="form-label">Photo URL</label>
          <input className="form-input" type="url" placeholder="https://…" disabled />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" disabled>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled>Save Recipe</button>
        </div>

        <p className="form-note">Form functionality coming soon.</p>
      </form>
    </div>
  )
}
