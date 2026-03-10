import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { getRecipes, deleteRecipe, getFavorites, toggleFavorite } from "../utils/recipeStorage";
import { useAuth } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";
import RecipeForm from "../components/RecipeForm";

export default function Favorites() {
  const { user } = useAuth();
  const [recipes, setRecipes]             = useState([]);
  const [favorites, setFavorites]         = useState(() => new Set(getFavorites()));
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getRecipes(user.id);
        if (!cancelled) setRecipes(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [user.id]);

  const favoriteRecipes = recipes.filter((r) => favorites.has(r.id));

  function handleToggleFavorite(id) {
    toggleFavorite(id);
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this recipe? This cannot be undone.")) return;
    try {
      await deleteRecipe(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEditSave(updatedRecipe) {
    if (updatedRecipe) {
      setRecipes((prev) => prev.map((r) => r.id === updatedRecipe.id ? updatedRecipe : r));
    }
    setEditingRecipe(null);
  }

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="page-header">
          <h1 className="page-title">Favorites</h1>
          <p className="page-subtitle">Recipes you've saved for quick access.</p>
        </div>
        <div className="loading-state"><div className="spinner" /></div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">Favorites</h1>
        <p className="page-subtitle">Recipes you've saved for quick access.</p>
      </div>

      {error && <div className="form-error" style={{ marginBottom: "1.5rem" }}>{error}</div>}

      {favoriteRecipes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Heart size={48} strokeWidth={1.25} /></div>
          <h2 className="empty-title">No favorites yet</h2>
          <p className="empty-text">
            Tap the heart on any recipe to save it here. Your personal cookbook starts now.
          </p>
          <Link to="/recipes" className="btn btn-primary">Browse Recipes</Link>
        </div>
      ) : (
        <div className="recipe-grid">
          {favoriteRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorited={favorites.has(recipe.id)}
              onToggleFavorite={handleToggleFavorite}
              onEdit={setEditingRecipe}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {editingRecipe && (
        <div
          className="modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setEditingRecipe(null); }}
        >
          <div className="modal">
            <div className="modal__header">
              <h2 className="modal__title">Edit Recipe</h2>
              <button className="icon-btn" title="Close" onClick={() => setEditingRecipe(null)}>✕</button>
            </div>
            <RecipeForm initialRecipe={editingRecipe} onSave={handleEditSave} />
          </div>
        </div>
      )}
    </div>
  );
}
