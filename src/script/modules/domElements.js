const headerMenu = document.querySelector('.js-header-button');
const navigation = document.querySelector('.js-navigation');
const menuLines = document.querySelector('.js-lines');
const articlesWrapper = document.querySelector('.articles__items');
const breadCrumpArticleTitle = document.querySelector('.js-breadcrumb-article-title');
const articleTitle = document.querySelector('.page__title');
const articleBody = document.querySelector('.page__text');
const articleAuthor = document.querySelector('.page__author');
const pageNavigationList = document.querySelector('.pagination-number__list');
const authorDetailsBlock = document.querySelector('.author');
const paginationArrowLeft = document.querySelector('.pagination__arrow_orientation_left');
const paginationArrowRight = document.querySelector('.pagination__arrow_orientation_right');
const loaderWrapper = document.querySelector('.loader-wrapper');
const footer = document.querySelector('footer');
const footerWrapperList = document.querySelectorAll('.footer__wrapper-list');
const footerLists = document.querySelectorAll('.footer__list');
const footerBtns = document.querySelectorAll('.footer__button');

export default {
  headerMenu,
  navigation,
  menuLines,
  articlesWrapper,
  breadCrumpArticleTitle,
  articleTitle,
  articleBody,
  articleAuthor,
  pageNavigationList,
  authorDetailsBlock,
  paginationArrowLeft,
  paginationArrowRight,
  loaderWrapper,
  footer,
  footerWrapperList,
  footerLists,
  footerBtns,
};