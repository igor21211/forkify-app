import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import sideBarView from './views/sideBarView.js';
import paginationView from './views/paginationViews.js';
import bookmarksViews from './views/bookmarksViews.js';
import addRecipeView from './views/addRecipeView.js';

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    //lOADING RECIPE

    sideBarView.update(model.getSearchResultPage());
    bookmarksViews.update(model.state.bookmarks);

    await model.loadRecipe(id);
    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    sideBarView.renderSpinner();
    //
    const query = searchView.getQuery();
    if (!query) return;
    //
    await model.loadSearchResults(query);
    //
    sideBarView.render(model.getSearchResultPage());
    //

    paginationView.render(model.state.search);
  } catch (err) {
    sideBarView.renderError();
  }
};

const controlServings = function (newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);
  //Update recipe view
  recipeView.update(model.state.recipe);
};

const controlPagination = function (gotoPage) {
  //
  sideBarView.render(model.getSearchResultPage(gotoPage));
  //
  paginationView.render(model.state.search);
};

const controlAddBookMark = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookMark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  recipeView.update(model.state.recipe);

  bookmarksViews.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksViews.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();

    bookmarksViews.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarksViews.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookMark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
