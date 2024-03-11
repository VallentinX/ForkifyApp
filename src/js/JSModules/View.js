import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  render(data, rander = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    const markup = this._generateMarkup();

    if (!rander) return markup;

    this._clear();

    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;

    const updateMarkup = this._generateMarkup();

    const newDom = document
      .createRange()
      .createContextualFragment(updateMarkup);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const currElms = Array.from(this._parentEl.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const currEl = currElms[i];

      if (
        !newEl.isEqualNode(currEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      )
        currEl.textContent = newEl.textContent;

      if (!newEl.isEqualNode(currEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          currEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  spinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
    `;

    this._clear();

    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorRecipe) {
    const markup = `
    <div class="error">
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

  _clear() {
    this._parentEl.innerHTML = '';
  }
}
