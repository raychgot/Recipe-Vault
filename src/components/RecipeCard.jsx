import { Link } from "react-router-dom";
import { Clock, Utensils, Pencil, Trash2, Heart } from "lucide-react";

export default function RecipeCard({
  recipe,
  isFavorited,
  onToggleFavorite,
  onEdit,
  onDelete,
}) {
  return (
    <div className="recipe-card">
      <div className="recipe-card__header">
        <span className="recipe-card__category">{recipe.category}</span>
        <div className="recipe-card__actions">
          <button
            className={`icon-btn icon-btn--favorite${isFavorited ? " is-active" : ""}`}
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
            onClick={() => onToggleFavorite(recipe.id)}
          >
            <Heart size={15} strokeWidth={2} fill={isFavorited ? "currentColor" : "none"} />
          </button>
          {onEdit && (
            <button
              className="icon-btn icon-btn--edit"
              title="Edit recipe"
              onClick={() => onEdit(recipe)}
            >
              <Pencil size={15} strokeWidth={2} />
            </button>
          )}
          {onDelete && (
            <button
              className="icon-btn icon-btn--delete"
              title="Delete recipe"
              onClick={() => onDelete(recipe.id)}
            >
              <Trash2 size={15} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      <h3 className="recipe-card__title">{recipe.title}</h3>

      <div className="recipe-card__meta">
        <span className="recipe-card__meta-item">
          <Clock size={14} strokeWidth={2} />
          {recipe.cookTime} min
        </span>
        <span className="recipe-card__meta-item">
          <Utensils size={14} strokeWidth={2} />
          {recipe.ingredients.length} ingredient{recipe.ingredients.length !== 1 ? "s" : ""}
        </span>
      </div>

      <Link
        to={`/recipes/${recipe.id}`}
        className="btn btn-secondary btn-full recipe-card__btn"
      >
        View Recipe
      </Link>
    </div>
  );
}
