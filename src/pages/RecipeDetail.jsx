import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Clock, Tag, ChevronLeft, Utensils } from "lucide-react";
import { getRecipeById } from "../utils/recipeStorage";
import { useAuth } from "../context/AuthContext";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading: authLoading } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    async function load() {
      const data = await getRecipeById(id);
      if (!cancelled) {
        setRecipe(data);
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id, authLoading]);

  if (loading) {
    return (
      <div className="page-wrapper page-wrapper--narrow">
        <div className="loading-state"><div className="spinner" /></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="page-wrapper page-wrapper--narrow">
        <div className="empty-state">
          <div className="empty-icon"><Utensils size={48} strokeWidth={1.25} /></div>
          <h2 className="empty-title">Recipe not found</h2>
          <p className="empty-text">This recipe may have been deleted or the link is invalid.</p>
          <Link to="/recipes" className="btn btn-primary">Back to Recipes</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper page-wrapper--narrow">
      <button className="back-link" onClick={() => navigate(-1)}>
        <ChevronLeft size={18} strokeWidth={2} />
        Back
      </button>

      <div className="recipe-detail">
        <div className="recipe-detail__meta-row">
          <span className="recipe-card__category">{recipe.category}</span>
          <span className="recipe-detail__meta-item">
            <Clock size={15} strokeWidth={2} />
            {recipe.cookTime} min cook time
          </span>
          <span className="recipe-detail__meta-item">
            <Tag size={15} strokeWidth={2} />
            {recipe.ingredients.length} ingredients
          </span>
        </div>

        <h1 className="recipe-detail__title">{recipe.title}</h1>

        <div className="recipe-detail__body">
          <section className="recipe-detail__section">
            <h2 className="recipe-detail__section-title">
              <Utensils size={18} strokeWidth={2} />
              Ingredients
            </h2>
            <ul className="ingredient-list">
              {recipe.ingredients.map((item, i) => (
                <li key={i} className="ingredient-list__item">{item}</li>
              ))}
            </ul>
          </section>

          <section className="recipe-detail__section">
            <h2 className="recipe-detail__section-title">
              <Clock size={18} strokeWidth={2} />
              Instructions
            </h2>
            <p className="recipe-detail__instructions">{recipe.instructions}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
