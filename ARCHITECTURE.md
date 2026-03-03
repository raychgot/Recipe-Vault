## ARCHITECTURE OVERVIEW

### Tech Stack

- **React + Vite**  
- **React Router** for navigation  
- **localStorage** for data persistence (planned)  
- **CSS** for styling

---

### Key Files

- `src/App.jsx` — Main router setup  
- `src/pages/Home.jsx` — Landing page  
- `src/pages/Recipes.jsx` — Recipe list page  
- `src/pages/AddRecipe.jsx` — Add recipe form page  
- `src/pages/Favorites.jsx` — Favorites page  
- `src/pages/Login.jsx` — Login page  
- `src/pages/Signup.jsx` — Signup page

---

### Data Model

- **Recipe:** `{ id, title, ingredients[], instructions, cookTime, category, createdAt, userId }`  
- **Favorites:** Array of recipe IDs stored separately