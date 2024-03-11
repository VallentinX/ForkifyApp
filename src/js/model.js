import {async} from 'regenerator-runtime';
import {API_URL, RecipesPerPage, API_KEY} from './config.js';
import {AJAX} from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resaultsPerPage: RecipesPerPage,
  },
  bookmarks: [],
};

const createRecipeObj = function (data) {
  const {recipe} = data.data;
  return {
    /** Properties  */
    id: recipe.id,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    title: recipe.title,
    /** Properties Name Changed  */
    cookingTime: recipe.cooking_time,
    image: recipe.image_url,
    sourceURL: recipe.source_url,
    ...(recipe.key && {key: recipe.key}),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

    state.recipe = createRecipeObj(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;
  } catch (error) {
    throw error;
  }
};

export const loadSearchRecipe = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map(recipe => {
      return {
        /** Properties  */
        id: recipe.id,
        publisher: recipe.publisher,
        title: recipe.title,
        /** Properties Name Changed  */
        image: recipe.image_url,
        ...(recipe.key && {key: recipe.key}),
      };
    });

    state.search.page = 1;
  } catch (error) {
    throw error;
  }
};

export const getSearchResaults = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resaultsPerPage;
  const end = page * state.search.resaultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (sarve) {
  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity = ingredient.quantity * (sarve / state.recipe.servings);
  });

  state.recipe.servings = sarve;
};

const localStorageBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const bookmark = function (recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  localStorageBookmark();
};

export const removeBookmark = function (id) {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);

  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  localStorageBookmark();

  // if (state.id === '65eee32bf15ca00014cdc4ac') delete ;
  console.log(id);
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');

  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

const clearStorage = function () {
  localStorage.clear('bookmarks');
};
// /* /* clearStorage(); */ */

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ingredient => {
        const ingredientArr = ingredient[1].split(',').map(ing => ing.trim());

        if (ingredientArr.length !== 3)
          throw new Error(
            'Wrong Ingredient Format! Please use the correct format!'
          );

        const [quantity, unit, description] = ingredientArr;

        return {quantity: quantity ? +quantity : null, unit, description};
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

    state.recipe = createRecipeObj(data);

    bookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};
