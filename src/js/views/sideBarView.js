import icons from 'url:../../img/icons.svg';
import Views from './Views';
import previewView from './previewView';

class SideBarViews extends Views {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe found for your query! Please try again ;)';
  _message = '';

  _generateMarkUp() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new SideBarViews();
