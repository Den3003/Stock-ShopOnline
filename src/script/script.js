import { timer } from './modules/timer.js';
import { fetchRequest } from './modules/fetchApi.js';
import { POSTS_API, PRODUCTS_API } from './modules/variables.js';
import { 
  renderArticles, 
  renderArticleText, 
  renderBasket, 
  renderCardProduct, 
  renderCountBasket, 
  renderMenuCatalog, 
  renderProducts, 
  renderProductsCategory, 
  renderSearch
  } from './modules/render.js';
import { 
  handleScreenHeader,
  handleScreenFooter,
  navMenu, 
  setYear, 
  updateSelectAll,
  listenerCheckboxes,
  listenerBtnBasketAllDelete,
  listenerBtnOrder
  } from './modules/control.js';
import { updateCartCounter } from './modules/basket.js';
import domElements from './modules/domElements.js';
import { listenerInput } from './modules/search.js';
import { showSkeletonsCard } from './modules/createElements.js';
const mediaQueryHeaderMenu = window.matchMedia("(max-width: 610px)");
const mediaQueryFooter = window.matchMedia("(max-width: 420px)");
// console.log('mediaQuery: ', mediaQuery);
const path = window.location.pathname;
const normalized = path.replace(/\/+$/, "");
// console.log('path: ', path);
// console.log('normalized: ', normalized);


document.addEventListener('DOMContentLoaded', () => {
  renderCountBasket(domElements.basketIconCount); // Чтоб если user нажимал на стрелки браузера "назад" или "вперед" срабатывало обновление счетчика на иконке корзины
  const timerWrapper = document.querySelector('[data-timer-deadline]');

  if (timerWrapper) {
      const deadline = timerWrapper.getAttribute('data-timer-deadline');
      timer(deadline);
  } else {
      return;
  }
});


setYear();
navMenu();
renderCountBasket(domElements.basketIconCount);

mediaQueryHeaderMenu.addEventListener("change", handleScreenHeader);
handleScreenHeader(mediaQueryHeaderMenu);

mediaQueryFooter.addEventListener("change", handleScreenFooter);
handleScreenFooter(mediaQueryFooter);

listenerInput();

if (normalized === '/Stock-ShopOnline-Pages' || path.includes("index.html")) {
  showSkeletonsCard(domElements.profitableWrapper);
  renderProducts(`${PRODUCTS_API}discount`);
  renderMenuCatalog(`${PRODUCTS_API}categories`);
}

if (path.includes("blog.html")) {
  const params = new URLSearchParams(window.location.search);
  const currentPage = parseInt(params.get("page")) || 1;
  renderArticles(`${POSTS_API}?page=${currentPage}`);
  renderMenuCatalog(`${PRODUCTS_API}categories`);
}

if (path.includes("article.html")) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  renderArticleText(`${POSTS_API}/${id}`);
  renderMenuCatalog(`${PRODUCTS_API}categories`);
}

if (path.includes("card.html")) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  renderCardProduct(`${PRODUCTS_API}goods/${id}`);
  renderMenuCatalog(`${PRODUCTS_API}categories`);
}

if (path.includes("category.html")) {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");
  renderProductsCategory(`${PRODUCTS_API}goods/category/${category}`);
  renderMenuCatalog(`${PRODUCTS_API}categories`);
}

if (path.includes("basket.html")) {
  renderBasket();
  renderProducts(`${PRODUCTS_API}discount`);
  renderMenuCatalog(`${PRODUCTS_API}categories`);
  // updateCartCounter();
  renderCountBasket(domElements.basketTitleCounter);
  renderCountBasket(domElements.orderSummaryCountProduct);
  listenerCheckboxes();
  listenerBtnOrder();
  listenerBtnBasketAllDelete();
}

if (path.includes("search.html")) {
  const params = new URLSearchParams(window.location.search);
  const searchParam = params.get("search");
  const encodedSearch = encodeURIComponent(searchParam);
  renderSearch(`${PRODUCTS_API}goods?search=${encodedSearch}`, searchParam);
  // console.log('encodedSearch: ', encodedSearch);
  renderMenuCatalog(`${PRODUCTS_API}categories`);
}

