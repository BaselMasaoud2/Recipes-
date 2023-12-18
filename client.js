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

    function displayRecipes(recipes) {
        let html = '';
        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            const title = recipe.title ? recipe.title.trim() : 'No Title';
            const thumbnail = recipe.thumbnail ?? 'https://placekitten.com/300/200';
            const ingredients = recipe.ingredients ? recipe.ingredients.map(ingredient => `* ${ingredient}`).join('<br>') : 'No Ingredients';

            html += `
                <div class="recipe">
                    <img src="${thumbnail}" alt="${title}">
                    <div class="recipe-details">
                        <div class="recipe-title">${title}</div>
                        <div class="recipe-label">Ingredients:</div>
                        <div class="recipe-ingredients">${ingredients}</div>
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



