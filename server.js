const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const faker = require('faker'); 
const port = process.env.PORT || 3000;
const dairyIngredients = ["milk", "cheese", "butter"];
const glutenIngredients = ["wheat", "barley", "rye"];

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/client.js', function (req, res) {
    res.sendFile(path.join(__dirname, 'client.js'));
});

app.get('/style.css', function (req, res) {
    res.sendFile(path.join(__dirname, 'style.css'));
});

const recipeApiUrl = 'https://recipes-goodness-elevation.herokuapp.com/recipes/ingredient';

const sensitivitiesMap = {
    dairy: ["Cream", "Cheese", "Milk", "Butter", "Creme", "Ricotta", "Mozzarella", "Custard", "Cream Cheese"],
    gluten: ["Flour", "Bread", "spaghetti", "Biscuits", "Beer"]
};


function generateDummyInfo(recipe) {
    recipe.chefName = faker.name.firstName();
    recipe.chefLastName = faker.name.lastName();
    recipe.rating = Math.floor(Math.random() * 5) + 1;
}

app.get('/recipes', async (req, res) => {
    try {
        const ingredient = req.query.ingredient;
        const sensitivityType = req.query.sensitivity || '';
        const sensitivityArray = sensitivitiesMap[sensitivityType] || [];

        const response = await axios.get(`${recipeApiUrl}/${encodeURIComponent(ingredient)}`);
        const data = response.data.results || [];

        data.forEach(recipe => generateDummyInfo(recipe));

        const filteredData = data.filter(recipe => !containsSensitiveIngredients(recipe.ingredients, sensitivityArray));

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const slicedData = filteredData.slice(startIndex, endIndex);

        const totalRecipes = filteredData.length;
        const totalPages = Math.ceil(totalRecipes / limit);

        res.json({ recipes: slicedData, totalRecipes, totalPages });
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).send(error.message || 'Internal Server Error');
    }
});


// Modify the existing function to accept sensitivityArray as an argument
function containsSensitiveIngredients(ingredients, sensitivityArray) {
    return ingredients.some(ingredient => sensitivityArray.includes(ingredient));
}






app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
