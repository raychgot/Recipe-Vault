import RecipeForm from "../components/RecipeForm";

export default function AddRecipe() {
  return (
    <div className="page-wrapper page-wrapper--narrow">
      <div className="page-header">
        <h1 className="page-title">Add a Recipe</h1>
        <p className="page-subtitle">Share your culinary creation with the vault.</p>
      </div>

      <RecipeForm />
    </div>
  );
}
