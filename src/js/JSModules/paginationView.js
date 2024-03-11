import View from './views.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  handlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn-inline');

      if (!btn) return;

      const gotoPage = +btn.dataset.goto;

      handler(gotoPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resaultsPerPage
    );

    const prevBtn = `
    <button data-goto="${
      currentPage - 1
    }" class="btn-inline pagination_btn-prev">
      <svg class="search_icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${currentPage - 1}</span>
    </button>
    `;
    const nextBtn = `
    <button data-goto="${
      currentPage + 1
    }" class="btn-inline pagination_btn-next">
      <span>Page ${currentPage + 1}</span>
      <svg class="search_icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
    `;

    /** Page 1+ */
    if (currentPage === 1 && numPages > 1) {
      return nextBtn;
    }

    /** Last Page */
    if (currentPage === numPages && numPages > 1) {
      return prevBtn;
    }

    /** Other Page */
    if (currentPage < numPages) {
      return `${prevBtn}${nextBtn}`;
    }

    /** Only One Page */
    return ``;
  }
}

export default new PaginationView();
