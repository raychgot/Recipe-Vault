import RecipeList from "../components/RecipeList";

export default function Recipes() {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">Recipes</h1>
        <p className="page-subtitle">Discover and explore your saved recipes.</p>
      </div>

      <RecipeList />
    </div>
  );
}
