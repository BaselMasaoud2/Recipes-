

$(document).ready(function() {
    let currentPage = 1;
    let totalPages = 1;
    let data;

    const recipesPerPage = 5;

    function applyFilter() {
        const ingredient = $('#ingredientInput').val();
        const sensitivityType = $('#sensitivityFilter').prop('checked') ? 'dairy' : '';
    
        if (ingredient) {
            const request = $.get(`/recipes?ingredient=${ingredient}&sensitivity=${sensitivityType}&page=${currentPage}&limit=${recipesPerPage}`);
    
            request
            .done(function (responseData) {
                console.log('Data received from server:', responseData);
                data = responseData;
                totalPages = Math.ceil(data.totalRecipes / recipesPerPage);
                displayRecipes(data);
            })
            .fail(function (xhr, status, error) {
                console.error('Error receiving data from server:', error);
                console.log('Status:', status);
            });
        }
    }

   

    $('#searchBtn').on('click', function() {
        currentPage = 1;
        applyFilter();
    });

    $('#sensitivityFilter').on('change', function () {
        currentPage = 1;
        applyFilter();
    });

 $('#nextPageBtn').on('click', function() {
    if (currentPage < totalPages) {
        currentPage++;
        applyFilter(); 
    }
});
    $('#prevPageBtn').on('click', function() {
        if (currentPage > 1) {
            currentPage--;
            applyFilter();
        }
    });

    $(document).on('click', '.video-button', function () {
        const videoHref = $(this).data('href');
        window.open(videoHref, '_blank');
    });


    function generateDummyInfo(recipe) {
        recipe.chefName = faker.name.firstName();
        recipe.chefLastName = faker.name.lastName();
        recipe.rating = Math.floor(Math.random() * 5) + 1;
    }

    function getRatingStars(rating) {
        const stars = '⭐️'.repeat(rating);
        return stars;
    }
    function createVideoButton(href) {
        return `<button class="video-button" data-href="${href}">Watch Video</button>`;
    }
    function displayRecipes(data) {
        console.log('Data from server:', data);

        let html = '';
        const startIndex = (currentPage - 1) * recipesPerPage;
        const endIndex = startIndex + recipesPerPage;

        for (let i = startIndex; i < endIndex && i < data.recipes.length; i++) {
            const recipe = data.recipes[i];
            const title = recipe.title ? recipe.title.trim() : 'No Title';
            const thumbnail = recipe.thumbnail ?? 'https://placekitten.com/300/200';
            const ingredients = recipe.ingredients ? recipe.ingredients.map(ingredient => `* ${ingredient}`).join('<br>') : 'No Ingredients';

            generateDummyInfo(recipe);

            const chefName = recipe.chefName ? `Chef: ${recipe.chefName} ${recipe.chefLastName}` : 'Chef: Unknown';
            const starsRating = recipe.rating ? getRatingStars(recipe.rating) : 'Not rated';
            const rating = recipe.rating ? `Rating: ${recipe.rating} stars ${getRatingStars(recipe.rating)}` : 'Rating: Not available';
            const videoButtonHtml = createVideoButton(recipe.href);

            html += `
                <div class="recipe">
                    <image src="${thumbnail}" alt="${title}"></image>
                    <div class="recipe-details">
                        <div class="recipe-title">${title}</div>
                        <div class="recipe-label">Ingredients:</div>
                        <div class="recipe-ingredients">${ingredients}</div>
                        <div class="recipe-label">${chefName}</div>
                        <div class="recipe-label">${rating}</div>
                        <div>    ${videoButtonHtml} <!-- הוספת הכפתור --> </div>

                        <a href="mailto:johndoe@fakeemail.com, janedoe@fakeemail.com?cc=jackdoe@fakeemail.com &bcc=jennydoe@fakeemail.com &subject=check out this recipe${title} &body=this is an a vido ${recipe.href}">
                            Email Us
                        </a>

                    </div>
                </div>
            `;
        }

        $('#recipesContainer').html(html);

        const paginationButtons = `
            <div class="pagination">
                <button id="prevPageBtn" ${currentPage === 1 ? 'disabled' : ''}>Previous Page</button>
                <button id="nextPageBtn" ${currentPage === totalPages ? 'disabled' : ''}>Next Page</button>
            </div>
        `;

        $('#paginationContainer').html(paginationButtons);
    }
});
