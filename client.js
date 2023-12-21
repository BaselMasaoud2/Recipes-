$(document).ready(function() {
    $('#searchBtn').on('click', function() {
        const ingredient = $('#ingredientInput').val();

        if (ingredient) {
            const request = $.get(`/recipes?ingredient=${ingredient}`);

            request
                .done(function(data) {
                    displayRecipes(data); 
                })
                .fail(function(xhr, status, error) {
                    console.error('Error:', error);
                    console.log('Status:', status);
                });
        }
    });

    function getRandomChefName() {
        return faker.name.firstName();
    }

    function getRandomRating() {
        return Math.floor(Math.random() * 5) + 1;
    }

    function getRatingStars(rating) {
        const stars = '⭐️'.repeat(rating);
        return stars;
    }

    function displayRecipes(recipes) {
        let html = '';
        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            const title = recipe.title ? recipe.title.trim() : 'No Title';
            const thumbnail = recipe.thumbnail ?? 'https://placekitten.com/300/200';
            const ingredients = recipe.ingredients ? recipe.ingredients.map(ingredient => `* ${ingredient}`).join('<br>') : 'No Ingredients';
            
            const chefName = getRandomChefName();
            const rating = getRandomRating();
            const ratingStars = getRatingStars(rating);
    
            html += `
                <div class="recipe">
                    <img src="${thumbnail}" alt="${title}">
                    <div class="recipe-details">
                        <div class="recipe-title">${title}</div>
                        <div class="recipe-label">Ingredients:</div>
                        <div class="recipe-ingredients">${ingredients}</div>
                        <div class="recipe-label">Chef: ${chefName}</div>
                        <div class="recipe-label">Rating: ${rating}${ratingStars}</div>

                    </div>
                </div>
            `;
        }
    
        $('#recipesContainer').html(html);
    }
    

    $('#sensitivityFilter').on('change', function () {
        const isChecked = $(this).prop('checked');
    });
});
