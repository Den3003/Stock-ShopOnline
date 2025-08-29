const articlesWrapper = document.querySelector('.articles__items');
const breadCrumpArticleTitle = document.querySelector('.js-breadcrumb-article-title');
const articleTitle = document.querySelector('.page__title');
const articleBody = document.querySelector('.page__text');
const articleAuthor = document.querySelector('.page__author');
const pageNavigationList = document.querySelector('.pagination-number__list');
const authorDetailsBlock = document.querySelector('.author');
const paginationArrowLeft = document.querySelector('.pagination__arrow_orientation_left');
const paginationArrowRight = document.querySelector('.pagination__arrow_orientation_right');
const loader = document.querySelector('.loader');
const loaderUp = document.querySelector('.loader__up');
const loaderDown = document.querySelector('.loader__down');

export default {
  articlesWrapper,
  breadCrumpArticleTitle,
  articleTitle,
  articleBody,
  articleAuthor,
  pageNavigationList,
  authorDetailsBlock,
  paginationArrowLeft,
  paginationArrowRight,
  loader,
  loaderUp,
  loaderDown,
};