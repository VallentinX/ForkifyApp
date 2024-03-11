import View from './View.js';
import icons from 'url:../../img/icons.svg';

class previewView extends View {
  _parentEl = '';

  _generateMarkup(result) {
    const id = window.location.hash.slice(1);

    return `
<li class="preview">
  <a class="preview_link ${
    this._data.id === id ? 'preview_link-active' : ''
  }" href="#${this._data.id}">
    <figure class="preview_fig">
      <img src="${this._data.image}" alt="${this._data.title}" />
    </figure>
    <div class="preview_data">
      <h4 class="preview_title">${this._data.title}</h4>
      <p class="preview_publisher">${this._data.publisher}</p>
      <div class="preview_user-generated ${this._data.key ? '' : 'hidden'}">
        <svg>
          <use href="${icons}#icon-user"></use>
        </svg>
      </div>
    </div>
  </a>
</li>
    `;
  }
}

export default new previewView();
