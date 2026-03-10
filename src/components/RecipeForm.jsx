import { useState } from "react";
import { saveRecipe, updateRecipe } from "../utils/recipeStorage";

const CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Drink"];

const EMPTY_FORM = {
  title: "",
  ingredients: "",
  instructions: "",
  cookTime: "",
  category: "",
};

function recipeToFields(recipe) {
  return {
    title:        recipe.title,
    ingredients:  recipe.ingredients.join(", "),
    instructions: recipe.instructions,
    cookTime:     String(recipe.cookTime),
    category:     recipe.category,
  };
}

export default function RecipeForm({ initialRecipe = null, onSave = null }) {
  const isEditing = initialRecipe !== null;

  const [fields, setFields] = useState(
    isEditing ? recipeToFields(initialRecipe) : EMPTY_FORM
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (error)   setError("");
    if (success) setSuccess(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const parsed = {
      title:        fields.title.trim(),
      ingredients:  fields.ingredients.split(",").map((s) => s.trim()).filter(Boolean),
      instructions: fields.instructions.trim(),
      cookTime:     Number(fields.cookTime),
      category:     fields.category,
    };

    try {
      if (isEditing) {
        const updated = await updateRecipe({ id: initialRecipe.id, ...parsed });
        if (onSave) onSave(updated);
      } else {
        await saveRecipe(parsed);
        setFields(EMPTY_FORM);
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      {error   && <div className="form-error">{error}</div>}
      {success && <div className="form-success">Recipe saved! You can add another below.</div>}

      <div className="form-group">
        <label className="form-label" htmlFor="title">Recipe Title</label>
        <input
          id="title" name="title" type="text"
          className="form-input"
          placeholder="e.g. Classic Margherita Pizza"
          value={fields.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="category">Category</label>
          <select
            id="category" name="category"
            className="form-input"
            value={fields.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category…</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cookTime">Cook Time (minutes)</label>
          <input
            id="cookTime" name="cookTime" type="number"
            className="form-input"
            placeholder="e.g. 30"
            min="1"
            value={fields.cookTime}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="ingredients">Ingredients</label>
        <textarea
          id="ingredients" name="ingredients"
          className="form-input form-textarea"
          placeholder="e.g. 2 cups flour, 1 tsp salt, 3 eggs"
          value={fields.ingredients}
          onChange={handleChange}
          required
        />
        <span className="form-hint">Separate each ingredient with a comma.</span>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="instructions">Instructions</label>
        <textarea
          id="instructions" name="instructions"
          className="form-input form-textarea form-textarea--lg"
          placeholder="Step-by-step instructions…"
          value={fields.instructions}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          disabled={submitting}
          onClick={() => {
            if (isEditing && onSave) { onSave(null); }
            else { setFields(EMPTY_FORM); setError(""); setSuccess(false); }
          }}
        >
          {isEditing ? "Cancel" : "Clear"}
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting
            ? (isEditing ? "Saving…" : "Adding…")
            : (isEditing ? "Save Changes" : "Save Recipe")}
        </button>
      </div>
    </form>
  );
}
