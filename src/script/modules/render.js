import {controlArrow, controlLoader, getCurrentPageFromURL, getVisiblePages} from "./control.js";
import {
  createArticle, 
  createPaginationItem,
  createAuthorDetails,
} from "./createElements.js";
import domElements from "./domElements.js";
import {loadGoods} from "./fetchApi.js";
import {POSTS_API, USERS_API} from "./variables.js";

const renderPagination = (data) => {
  const totalPages = data.meta.pagination.pages;
  let currentPage = getCurrentPageFromURL();

  controlArrow(currentPage, totalPages);

  const pageNumbers = getVisiblePages(currentPage, totalPages);
  pageNumbers.forEach(num => {
    let href;
    let linkActive = false;
    if (num === 1) {
      href = "blog.html";
    } else {
      href = `blog.html?page=${num}`;
    }
    if (num === currentPage) linkActive = true;
    domElements.pageNavigationList.appendChild(createPaginationItem(num, href, linkActive)); 
  });
};

export const renderArticles = async () => {
  const params = new URLSearchParams(window.location.search);
  const currentPage = parseInt(params.get("page")) || 1;
  controlLoader(true);
  const data = await loadGoods(`${POSTS_API}?page=${currentPage}`);
  if (data) {
    setTimeout(() => {
      controlLoader(false);
    }, 2500);
  };
  const articles = data.data.map((item, index) => createArticle(item, ++index));
  renderPagination(data);

  domElements.articlesWrapper.append(...articles);
};

export const renderArticleText = async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  controlLoader(true);
  const data = await loadGoods(`${POSTS_API}/${id}`);
  if (data) {
    setTimeout(() => {
      controlLoader(false);
    }, 2500);
  };
  const userId = data.data.user_id;
  let authorDetailsText;

  domElements.breadCrumpArticleTitle.textContent = data.data.title;
  domElements.articleTitle.textContent = data.data.title;
  domElements.articleBody.textContent = data.data.body;

  const fetchAuthorDetails = `${USERS_API}/${userId}`;
  const authorDetails = await loadGoods(fetchAuthorDetails);
  if (authorDetails.code === 200) {
    authorDetailsText = createAuthorDetails(authorDetails);
  } else {
    authorDetailsText = `<p class="author-text">Автор не указан.</p>`;
  }
  domElements.authorDetailsBlock.insertAdjacentHTML('beforeend', authorDetailsText);
};