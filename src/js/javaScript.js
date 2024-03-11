import * as modal from './model.js';
import {CLOSE_MODAL_TIME} from './config.js';
import recipeView from './JSModules/recipeView.js';
import searchView from './JSModules/searchView.js';
import resaultView from './JSModules/resaultView.js';
import PaginationView from './JSModules/paginationView.js';
import bookmarksView from './JSModules/bookmarks.js';
import addRecipe from './JSModules/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import paginationView from './JSModules/paginationView.js';

if (module.hot) {
  module.hot.accept();
}

const recipeAPI = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.spinner();

    resaultView.update(modal.getSearchResaults());

    bookmarksView.update(modal.state.bookmarks);

    await modal.loadRecipe(id);

    recipeView.render(modal.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

const searchRecipe = async function () {
  try {
    resaultView.spinner();

    const query = searchView.getQuery();

    if (!query) return;

    await modal.loadSearchRecipe(query);

    resaultView.render(modal.getSearchResaults());

    PaginationView.render(modal.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (goToPage) {
  resaultView.render(modal.getSearchResaults(goToPage));

  PaginationView.render(modal.state.search);
};

const controlServings = function (servings) {
  modal.updateServings(servings);

  // recipeView.render(modal.state.recipe);
  recipeView.update(modal.state.recipe);
};

const addBookmark = function () {
  if (!modal.state.recipe.bookmarked) {
    modal.bookmark(modal.state.recipe);
  } else {
    modal.removeBookmark(modal.state.recipe.id);
  }

  recipeView.update(modal.state.recipe);

  bookmarksView.render(modal.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(modal.state.bookmarks);
};

const uploadedRecipe = async function (newRecipe) {
  try {
    addRecipe.spinner();

    await modal.uploadRecipe(newRecipe);

    recipeView.render(modal.state.recipe);

    addRecipe.renderMessage();

    bookmarksView.render(modal.state.bookmarks);

    window.history.pushState(null, '', `#${modal.state.recipe.id}`);

    setTimeout(function () {
      addRecipe.toggleWindow();
    }, CLOSE_MODAL_TIME * 1000);
  } catch (error) {
    addRecipe.renderError(error.message);
    console.error(error);
  }
};

const init = function () {
  bookmarksView.handlerRender(controlBookmarks);

  recipeView.renderHandler(recipeAPI);

  recipeView.handlerUpdateServings(controlServings);

  recipeView.handlerBookmark(addBookmark);

  searchView.handlerSearch(searchRecipe);

  paginationView.handlerClick(controlPagination);

  addRecipe.handlerUpload(uploadedRecipe);
};

init();
