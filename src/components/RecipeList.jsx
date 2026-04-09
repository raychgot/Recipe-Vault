import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Utensils, Search } from "lucide-react";
import { getRecipes, deleteRecipe, getFavorites, toggleFavorite, deleteDescription, deleteTags } from "../utils/recipeStorage";
import { useAuth } from "../context/AuthContext";
import RecipeCard from "./RecipeCard";
import RecipeForm from "./RecipeForm";

export default function RecipeList() {
  const { user, loading: authLoading } = useAuth();
  const [recipes, setRecipes]           = useState([]);
  const [favorites, setFavorites]       = useState(() => new Set(getFavorites()));
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [query, setQuery]               = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function load() {
      setError("");
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
  }, [user, authLoading]);

  const categories = ["All", ...Array.from(new Set(recipes.map((r) => r.category))).sort()];

  const needle = query.trim().toLowerCase();
  const filteredRecipes = recipes.filter((r) => {
    const matchesCategory = activeCategory === "All" || r.category === activeCategory;
    const matchesQuery =
      !needle ||
      r.title.toLowerCase().includes(needle) ||
      r.ingredients.some((i) => i.toLowerCase().includes(needle));
    return matchesCategory && matchesQuery;
  });

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
      deleteDescription(id);
      deleteTags(id);
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
      <div className="loading-state">
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <p className="empty-title">Something went wrong</p>
        <p className="empty-text">{error}</p>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon"><Utensils size={48} strokeWidth={1.25} /></div>
        <h2 className="empty-title">No recipes yet</h2>
        <p className="empty-text">Recipes you add will appear here. Start by adding your first one!</p>
        <Link to="/add-recipe" className="btn btn-primary">Add the First Recipe</Link>
      </div>
    );
  }

  return (
    <>
      <div className="recipes-toolbar">
        <div className="search-wrapper">
          <Search className="search-icon" size={16} strokeWidth={2} />
          <input
            className="search-input search-input--icon"
            type="search"
            placeholder="Search by title or ingredient…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="category-chips">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`chip${activeCategory === cat ? " chip--active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Search size={48} strokeWidth={1.25} /></div>
          <h2 className="empty-title">No matches found</h2>
          <p className="empty-text">Try a different search term or category.</p>
          <button
            className="btn btn-secondary"
            onClick={() => { setQuery(""); setActiveCategory("All"); }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="recipe-grid">
          {filteredRecipes.map((recipe) => (
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
    </>
  );
}
