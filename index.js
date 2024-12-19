// Fetch Recipes From API
document.getElementById("fetch-button").addEventListener("click", () => {
  const query = document.getElementById("api-search-bar").value.trim().toLowerCase();
  const results = document.getElementById("api-results");
  const msg = document.getElementById("msg");

  results.innerHTML = ""; // Clear previous results
  msg.style.display = "none"; // Hide 'no results' message initially

  // Fetch data from TheMealDB API
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (!data.meals) {
        msg.style.display = "block"; // Show 'no results' message if no meals found
        return;
      }

      // Render fetched meals
      data.meals.forEach((meal) => {
        const div = document.createElement("div");
        div.className = "card";
        div.style.width = "18rem";
        div.innerHTML = `
          <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
          <div class="card-body">
            <h5 class="card-title">${meal.strMeal}</h5>
            <button class="btn btn-primary details-btn" data-id="${meal.idMeal}">View Details</button>
          </div>
        `;
        results.appendChild(div);
      });
    })
    .catch((error) => {
      console.error("Error fetching recipes:", error);
      alert("An error occurred while fetching recipes. Please try again later.");
    });
});

// Show Recipe Details
document.getElementById("api-results").addEventListener("click", (e) => {
  if (e.target.classList.contains("details-btn")) {
    const mealId = e.target.getAttribute("data-id");
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
      .then((response) => response.json())
      .then((data) => {
        const meal = data.meals[0];
        const details = document.getElementById("details");

        details.innerHTML = `
          <h3>${meal.strMeal}</h3>
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <p><strong>Category:</strong> ${meal.strCategory}</p>
          <p><strong>Area:</strong> ${meal.strArea}</p>
          <h4>Ingredients:</h4>
          <ul>
            ${Object.keys(meal)
              .filter((key) => key.startsWith("strIngredient") && meal[key])
              .map((key) => `<li>${meal[key]}</li>`)
              .join("")}
          </ul>
          <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
        `;
      })
      .catch((error) => {
        console.error("Error fetching meal details:", error);
        alert("An error occurred while fetching meal details. Please try again later.");
      });
  }
});

// Add Recipe
document.getElementById("add-recipe").addEventListener("click", () => {
  const recipeTitle = document.getElementById("recipe-title").value.trim();
  const recipeDetails = document.getElementById("recipe-details").value.trim();

  if (!recipeTitle || !recipeDetails) {
    alert("Please fill in both the recipe title and details.");
    return;
  }

  const recipeList = document.getElementById("recipe-list");

  // Create new recipe item
  const recipeItem = document.createElement("li");
  recipeItem.className = "list-group-item d-flex justify-content-between align-items-center";
  recipeItem.innerHTML = `
    <span>
      <strong>${recipeTitle}</strong>
      <p>${recipeDetails}</p>
    </span>
    <div>
      <button class="btn btn-warning btn-sm edit-recipe">Edit</button>
      <button class="btn btn-danger btn-sm delete-recipe">Delete</button>
    </div>
  `;

  recipeList.appendChild(recipeItem);

  // Clear input fields
  document.getElementById("recipe-title").value = "";
  document.getElementById("recipe-details").value = "";
});

// Edit Recipe
document.getElementById("recipe-list").addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-recipe")) {
    const recipeItem = e.target.closest(".list-group-item");
    const recipeTitle = recipeItem.querySelector("strong").textContent;
    const recipeDetails = recipeItem.querySelector("p").textContent;

    // Populate the form with the recipe data
    document.getElementById("recipe-title").value = recipeTitle;
    document.getElementById("recipe-details").value = recipeDetails;

    // Remove the recipe from the list for updating
    recipeItem.remove();
  }
});

// Delete Recipe
document.getElementById("recipe-list").addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-recipe")) {
    e.target.closest(".list-group-item").remove();
  }
});

// Local Search Recipes
document.getElementById("search-button").addEventListener("click", () => {
  const query = document.getElementById("search-bar").value.trim().toLowerCase();
  const recipes = document.querySelectorAll("#recipe-list .list-group-item");

  recipes.forEach((recipe) => {
    const title = recipe.querySelector("strong").textContent.toLowerCase();
    if (title.includes(query)) {
      recipe.style.display = "block"; // Show recipe if it matches search
    } else {
      recipe.style.display = "none"; // Hide recipe if it doesn't match
    }
  });
});
