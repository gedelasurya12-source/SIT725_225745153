document.addEventListener("DOMContentLoaded", () => {
  fetchRecipes();
});

function fetchRecipes() {
  fetch("/api/recipes")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Unable to load recipes");
      }

      return response.json();
    })
    .then((recipes) => {
      displayRecipes(recipes);
    })
    .catch((error) => {
      console.error("Error:", error);

      document.getElementById("recipe-container").innerHTML = `
        <div class="col s12">
          <div class="card-panel red lighten-4 red-text text-darken-4">
            Unable to load recipes. Please try again.
          </div>
        </div>
      `;
    });
}

function displayRecipes(recipes) {
  const recipeContainer = document.getElementById("recipe-container");

  recipeContainer.innerHTML = "";

  recipes.forEach((recipe) => {
    const recipeCard = `
      <div class="col s12 m6 l4">
        <div class="card hoverable">
          <div class="card-image">
            <img src="${recipe.image}" alt="${recipe.title}">
          </div>

          <div class="card-content">
            <span class="card-title">${recipe.title}</span>
            <p>${recipe.description}</p>
          </div>
        </div>
      </div>
    `;

    recipeContainer.innerHTML += recipeCard;
  });
}