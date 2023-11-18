import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import sideBarView from './views/sideBarView.js';
import paginationView from './views/paginationViews.js';

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    //lOADING RECIPE

    sideBarView.update(model.getSearchResultPage());

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

const init = function () {
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
