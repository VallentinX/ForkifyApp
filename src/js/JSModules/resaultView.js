import View from './views.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResaultView extends View {
  _parentEl = document.querySelector('.results');
  _errorRecipe =
    "Recipe couldn't be found. Please make sure your type is right or try anothe one!";
  _errorMsg;

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResaultView();
