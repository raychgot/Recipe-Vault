## ARCHITECTURE OVERVIEW

### Tech Stack

- **React + Vite** for the frontend framework
- **React Router** for client-side navigation
- **Supabase** for authentication and cloud database
- **Supabase JS Client** for database communication
- **CSS** for styling
- **Netlify** for deployment

---

### Application Structure

The application is a single-page React application that uses React Router to navigate between pages. Users can create, browse, search, and manage recipes while authenticated.

Supabase provides authentication and persistent cloud storage for recipes.

---

### Key Files

- `src/App.jsx` — Main router configuration
- `src/lib/supabase.js` — Supabase client setup
- `src/pages/Home.jsx` — Landing page
- `src/pages/Recipes.jsx` — Recipe list with search and filtering
- `src/pages/AddRecipe.jsx` — Form for creating recipes
- `src/pages/Favorites.jsx` — Displays user’s favorite recipes
- `src/pages/Login.jsx` — User login page
- `src/pages/Signup.jsx` — User signup page

---

### Database Model

Recipes are stored in a Supabase table called `recipes`.

Recipe structure:
{
id,
title,
ingredients[],
instructions,
cook_time,
category,
created_at,
user_id
}

Each recipe belongs to a user through the `user_id` field.

---

### Data Flow

1. User authenticates using Supabase authentication
2. User submits a recipe through the Add Recipe form
3. The frontend sends the recipe data to Supabase
4. Supabase stores the recipe in the `recipes` table
5. Recipes are retrieved from the database and displayed on the Recipes page
