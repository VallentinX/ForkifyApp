import View from './views.js';
import icons from 'url:../../img/icons.svg';

class AddRecipe extends View {
  _parentEl = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpenWindow = document.querySelector('.nav_btn-add-recipe');
  _btnCloseWindow = document.querySelector('.btn-close-modal');
  _message = 'Recepi uploaded. 🙃';

  constructor() {
    super();
    this._openWindow();
    this._closeWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _openWindow() {
    this._btnOpenWindow.addEventListener('click', this.toggleWindow.bind(this));
  }

  _closeWindow() {
    this._btnCloseWindow.addEventListener(
      'click',
      this.toggleWindow.bind(this)
    );
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  handlerUpload(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();

      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);

      handler(data);
    });
  }

  _generateMarkup() {}

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;

    this._clear();

    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}

export default new AddRecipe();
