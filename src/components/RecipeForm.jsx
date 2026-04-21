import { useState } from "react";
import { saveRecipe, updateRecipe, saveDescription, getDescription, saveTags, getTags, saveCreatedAt } from "../utils/recipeStorage";

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

async function generateTags(fields) {
  const prompt =
    `Generate 3 to 5 short descriptive tags for the following recipe. ` +
    `Tags should describe dietary type (e.g. vegetarian, vegan, gluten-free, keto, dairy-free), ` +
    `effort level (e.g. beginner-friendly, intermediate, advanced), ` +
    `or nutrition/style (e.g. high-protein, low-sugar, low-carb, high-fiber). ` +
    `Do not use the recipe category as a tag. ` +
    `Return only the tags as a comma-separated list with no extra text, punctuation, or explanation.\n\n` +
    `Title: ${fields.title}\n` +
    `Category: ${fields.category || "N/A"}\n` +
    `Cook Time: ${fields.cookTime ? fields.cookTime + " minutes" : "N/A"}\n` +
    `Ingredients: ${fields.ingredients || "N/A"}\n` +
    `Instructions: ${fields.instructions || "N/A"}`;

  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gemma4:e2b", prompt, stream: false }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Ollama returned ${res.status}`);
  }

  const data = await res.json();
  const raw = data.response?.trim() ?? "";
  return raw
    .split(",")
    .map((t) => t.trim().toLowerCase().replace(/^[#\-\s]+|[.!?]+$/g, ""))
    .filter(Boolean)
    .slice(0, 5);
}

async function generateDescription(fields) {
  const prompt =
    `Write a short 2 to 3 sentence description for the following recipe. ` +
    `Be concise, appetizing, and informative. Do not include any headers or labels — just the description.\n\n` +
    `Title: ${fields.title}\n` +
    `Category: ${fields.category || "N/A"}\n` +
    `Cook Time: ${fields.cookTime ? fields.cookTime + " minutes" : "N/A"}\n` +
    `Ingredients: ${fields.ingredients || "N/A"}\n` +
    `Instructions: ${fields.instructions || "N/A"}`;

  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gemma4:e2b", prompt, stream: false }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Ollama returned ${res.status}`);
  }

  const data = await res.json();
  return data.response?.trim() ?? "";
}

export default function RecipeForm({ initialRecipe = null, onSave = null }) {
  const isEditing = initialRecipe !== null;

  const [fields, setFields] = useState(
    isEditing ? recipeToFields(initialRecipe) : EMPTY_FORM
  );
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState(false);
  const [description, setDescription] = useState(
    isEditing ? getDescription(initialRecipe.id) : ""
  );
  const [generating, setGenerating]   = useState(false);
  const [genError, setGenError]       = useState("");
  const [tags, setTags]               = useState(
    isEditing ? getTags(initialRecipe.id) : []
  );
  const [generatingTags, setGeneratingTags] = useState(false);
  const [tagsError, setTagsError]           = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (error)   setError("");
    if (success) setSuccess(false);
  }

  async function handleGenerateDescription() {
    if (!fields.title.trim()) {
      setGenError("Please enter a recipe title before generating a description.");
      return;
    }
    setGenError("");
    setGenerating(true);
    try {
      const result = await generateDescription(fields);
      setDescription(result);
    } catch (err) {
      setGenError(
        err.message.includes("Failed to fetch")
          ? "Could not reach Ollama. Make sure it is running at http://localhost:11434."
          : err.message || "Failed to generate description."
      );
    } finally {
      setGenerating(false);
    }
  }

  async function handleGenerateTags() {
    if (!fields.title.trim()) {
      setTagsError("Please enter a recipe title before generating tags.");
      return;
    }
    setTagsError("");
    setGeneratingTags(true);
    try {
      const result = await generateTags(fields);
      setTags(result);
    } catch (err) {
      setTagsError(
        err.message.includes("Failed to fetch")
          ? "Could not reach Ollama. Make sure it is running at http://localhost:11434."
          : err.message || "Failed to generate tags."
      );
    } finally {
      setGeneratingTags(false);
    }
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
        if (description) saveDescription(updated.id, description);
        if (tags.length) saveTags(updated.id, tags);
        if (onSave) onSave(updated);
      } else {
        const saved = await saveRecipe(parsed);
        saveCreatedAt(saved.id, new Date().toISOString());
        if (description) saveDescription(saved.id, description);
        if (tags.length) saveTags(saved.id, tags);
        setFields(EMPTY_FORM);
        setDescription("");
        setTags([]);
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

      <div className="ai-description-section">
        <button
          type="button"
          className="btn btn-secondary btn-full"
          disabled={generating || submitting}
          onClick={handleGenerateDescription}
        >
          {generating ? (
            <>
              <span className="btn-spinner" />
              Generating…
            </>
          ) : (
            "✨ Generate Description"
          )}
        </button>

        {genError && <div className="form-error ai-description-error">{genError}</div>}

        {description && !genError && (
          <div className="ai-description-box">
            <p className="ai-description-label">AI-Generated Description</p>
            <p className="ai-description-text">{description}</p>
          </div>
        )}
      </div>

      <div className="ai-description-section">
        <button
          type="button"
          className="btn btn-secondary btn-full"
          disabled={generatingTags || submitting}
          onClick={handleGenerateTags}
        >
          {generatingTags ? (
            <>
              <span className="btn-spinner" />
              Generating…
            </>
          ) : (
            "🏷️ Generate Tags"
          )}
        </button>

        {tagsError && <div className="form-error ai-description-error">{tagsError}</div>}

        {tags.length > 0 && !tagsError && (
          <div className="ai-description-box">
            <p className="ai-description-label">AI-Generated Tags</p>
            <div className="ai-tags-list">
              {tags.map((tag) => (
                <span key={tag} className="ai-tag">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          disabled={submitting}
          onClick={() => {
            if (isEditing && onSave) { onSave(null); }
            else { setFields(EMPTY_FORM); setError(""); setSuccess(false); setDescription(""); setGenError(""); setTags([]); setTagsError(""); }
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
