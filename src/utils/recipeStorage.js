import supabase from "../lib/supabase";

// ── Column mapping ─────────────────────────────────────────────
// DB uses snake_case; the app uses camelCase.

function toClient(row) {
  let ingredients = row.ingredients;
  if (typeof ingredients === "string") {
    try {
      ingredients = JSON.parse(ingredients);
    } catch {
      ingredients = ingredients.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  if (!Array.isArray(ingredients)) ingredients = [];

  return {
    id:           row.id,
    title:        row.title,
    ingredients,
    instructions: row.instructions,
    cookTime:     row.cook_time,
    category:     row.category,
    createdAt:    row.created_at,
  };
}

function toServer(recipe) {
  return {
    title:        recipe.title,
    ingredients:  recipe.ingredients,
    instructions: recipe.instructions,
    cook_time:    recipe.cookTime,
    category:     recipe.category,
  };
}

// ── Recipes ────────────────────────────────────────────────────

async function getRecipes(userId) {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toClient);
}

async function getRecipeById(id) {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return toClient(data);
}

async function saveRecipe(fields) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error("You must be logged in to save a recipe.");

  // Use raw fetch so the Authorization header is set explicitly from the
  // active session token, bypassing any Supabase JS client header-injection issues.
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/recipes`,
    {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "apikey":        import.meta.env.VITE_SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${session.access_token}`,
        "Prefer":        "return=representation",
      },
      body: JSON.stringify({
        title:        fields.title,
        ingredients:  fields.ingredients,
        instructions: fields.instructions,
        cook_time:    fields.cookTime,
        category:     fields.category,
        user_id:      session.user.id,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.hint || `Request failed (${res.status})`);
  }

  const rows = await res.json();
  return toClient(rows[0]);
}

async function updateRecipe(recipe) {
  const { data, error } = await supabase
    .from("recipes")
    .update(toServer(recipe))
    .eq("id", recipe.id)
    .select()
    .single();
  if (error) throw error;
  return toClient(data);
}

async function deleteRecipe(id) {
  const { error } = await supabase.from("recipes").delete().eq("id", id);
  if (error) throw error;
}

// ── Favorites (localStorage) ───────────────────────────────────

const FAVORITES_KEY = "favorites";

function getFavorites() {
  const data = localStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
}

function toggleFavorite(id) {
  const favs = getFavorites();
  const updated = favs.includes(id)
    ? favs.filter((f) => f !== id)
    : [...favs, id];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
}

// ── AI Tags (localStorage) ────────────────────────────────────

const TAGS_KEY = "recipe_tags";

function getAllTags() {
  const data = localStorage.getItem(TAGS_KEY);
  return data ? JSON.parse(data) : {};
}

function getTags(id) {
  return getAllTags()[id] ?? [];
}

function saveTags(id, tags) {
  const all = getAllTags();
  all[id] = tags;
  localStorage.setItem(TAGS_KEY, JSON.stringify(all));
}

function deleteTags(id) {
  const all = getAllTags();
  delete all[id];
  localStorage.setItem(TAGS_KEY, JSON.stringify(all));
}

// ── AI Descriptions (localStorage) ────────────────────────────

const DESCRIPTIONS_KEY = "recipe_descriptions";

function getDescriptions() {
  const data = localStorage.getItem(DESCRIPTIONS_KEY);
  return data ? JSON.parse(data) : {};
}

function getDescription(id) {
  return getDescriptions()[id] ?? "";
}

function saveDescription(id, description) {
  const all = getDescriptions();
  all[id] = description;
  localStorage.setItem(DESCRIPTIONS_KEY, JSON.stringify(all));
}

function deleteDescription(id) {
  const all = getDescriptions();
  delete all[id];
  localStorage.setItem(DESCRIPTIONS_KEY, JSON.stringify(all));
}

export {
  getRecipes,
  getRecipeById,
  saveRecipe,
  updateRecipe,
  deleteRecipe,
  getFavorites,
  toggleFavorite,
  getDescription,
  saveDescription,
  deleteDescription,
  getTags,
  saveTags,
  deleteTags,
};
