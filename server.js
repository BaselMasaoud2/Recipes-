// server.js
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const dairyIngredients = ["milk", "cheese", "butter", ];
const glutenIngredients = ["wheat", "barley", "rye", ];
 
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

app.get('/recipes', async (req, res) => {
    const ingredient = req.query.ingredient;
    try {
        const response = await axios.get(`${recipeApiUrl}/${encodeURIComponent(ingredient)}`);
        const data = response.data.results || [];
        const filteredData = data.filter(recipe => !containsSensitiveIngredients(recipe.ingredients));
        res.json(filteredData);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message || 'Internal Server Error');
    }
});

function containsSensitiveIngredients(ingredients) {
    return ingredients.some(ingredient => dairyIngredients.includes(ingredient) || glutenIngredients.includes(ingredient));
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
