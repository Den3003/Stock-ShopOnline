const headerMenu = document.querySelector('.js-header-button');
const headerCatalog = document.querySelector('.js-header-catalog');
const navigation = document.querySelector('.js-navigation');
const headerDropdownWrapperList = document.querySelectorAll('.header-arrow-dropdown__wrapper-list');
const navigationMenuList = document.querySelectorAll('.navigation-menu__list');
const btnArrow = document.querySelectorAll('.button-arrow');
const menuLines = document.querySelector('.js-lines');
const basketList = document.querySelector('.basket__list');
const articlesWrapper = document.querySelector('.articles__items');
const breadCrumpArticleTitle = document.querySelector('.js-breadcrumb-article-title');
const breadCrumpCardTitle = document.querySelector('.js-breadcrumb-card-title');
const breadCrumpCardCategory = document.querySelector('.js-breadcrumb-card-category');
const articleSpanTitle = document.querySelector('.page__span-title');
const articleTitle = document.querySelector('.page__title');
const articleBody = document.querySelector('.page__text');
const articleAuthor = document.querySelector('.page__author');
const pageNavigationList = document.querySelector('.pagination__list');
const authorDetailsBlock = document.querySelector('.author');
const cardWrapper = document.querySelector('.card');
const recommendationsList = document.querySelector('.recommendations__list');
const categoryTitle = document.querySelector('.js-category-title');
const categoryTitleHidden = document.querySelector('.js-category-title-hidden');
const categoryList = document.querySelector('.category__list');
const paginationArrowLeft = document.querySelector('.pagination__arrow-link_orientation_left');
const paginationArrowRight = document.querySelector('.pagination__arrow-link_orientation_right');
const loaderWrapper = document.querySelector('.loader-wrapper');
const profitableWrapper = document.querySelector('.profitable__list'); 
const profitableSection = document.querySelector('.profitable'); 
const footer = document.querySelector('footer');
const footerDropdownWrapperList = document.querySelectorAll('.footer-arrow-dropdown__wrapper-list');
const footerCatalog = document.querySelector('.js-footer-catalog');
// const footerWrapperList = document.querySelectorAll('.footer__wrapper-list');
// const footerLists = document.querySelectorAll('.footer__list');
const footerBtns = document.querySelectorAll('.footer__button');
const footerYear = document.querySelector('.footer__copyright-year');


//  Страница корзины

const basketIconCount = document.querySelector('.profile-basket__counter');
const basketTitleCounter = document.querySelector('.basket__title-counter');
const basketBtnDeleteAll = document.querySelector('.basket__products-delete');
const basketDeliveryImageList = document.querySelector('.delivery__images-wrapper');

const orderSummaryCountProduct = document.querySelector('.order-summary__product-counter');
const orderSummaryTotalDiscountPriceSpan = document.querySelector('.order-summary__total-span');
const orderSummaryTotalPriceSpan = document.querySelector('.order-summary__product-summary-span');
const orderSummaryTotalDiscountSpan = document.querySelector('.order-summary__discount-span');
const btnOrder = document.querySelector('.order-summary__submit');

//   Поиск товаров

const searchForm = document.querySelector('.search-box');
const searchInput = document.querySelector('.search-box__input');
const suggestionsWrapper = document.querySelector('.search-box__suggestions-wrapper');
const suggestionsList = document.querySelector('.search-box__suggestions-list');
const suggestionsItem = document.querySelector('.search-box__suggestions-item');

//    Страница поиска

const searchBreadcrumb = document.querySelector('.js-breadcrumb-search');
const searchTitleSpan = document.querySelector('.js-search-title-hidden');
const searchList = document.querySelector('.search__list');

export default {
  headerMenu,
  headerCatalog,
  navigation,
  headerDropdownWrapperList,
  navigationMenuList,
  btnArrow,
  menuLines,
  basketIconCount,
  basketList,
  articlesWrapper,
  breadCrumpArticleTitle,
  breadCrumpCardTitle,
  breadCrumpCardCategory,
  articleSpanTitle,
  articleTitle,
  articleBody,
  articleAuthor,
  pageNavigationList,
  authorDetailsBlock,
  cardWrapper,
  recommendationsList,
  categoryTitle,
  categoryTitleHidden,
  categoryList,
  paginationArrowLeft,
  paginationArrowRight,
  loaderWrapper,
  profitableWrapper,
  profitableSection,
  footer,
  footerDropdownWrapperList,
  footerCatalog,
  // footerWrapperList,
  // footerLists,
  footerBtns,
  footerYear,

  basketTitleCounter,
  basketBtnDeleteAll,
  basketDeliveryImageList,
  orderSummaryCountProduct,
  orderSummaryTotalDiscountPriceSpan,
  orderSummaryTotalPriceSpan,
  orderSummaryTotalDiscountSpan,
  btnOrder,

  searchForm,
  searchInput,
  suggestionsWrapper,
  suggestionsList,
  suggestionsItem,

  searchBreadcrumb,
  searchTitleSpan,
  searchList,
};