import {sizeImage} from "./variables.js";
import { IMAGE_BASE } from "./variables.js";

const createArticleImage = (index) => {
  const articleImage = document.createElement('img');
  articleImage.classList.add('article-section__image');
  articleImage.setAttribute('src', `${IMAGE_BASE}random=${index}`);
  articleImage.setAttribute('width', `${sizeImage}`);
  articleImage.setAttribute('height', `${sizeImage}`);

  return articleImage;
};

const createArticleLink = (arr) => {
  const articleLink = document.createElement('a');
  articleLink.setAttribute('href', `article.html?id=${arr.id}`)
  articleLink.classList.add('article-section__title');
  articleLink.textContent = `${arr.title}`;

  return articleLink;
};

export const createArticle = (arr, index) => {
  const articleWrapper = document.createElement('li');
  articleWrapper.classList.add('article-section');

  articleWrapper.append(createArticleImage(index));
  articleWrapper.append(createArticleLink(arr));

  return articleWrapper;
};

const createPaginationLink = (number, link) => {
  const paginationLink = document.createElement('a');
  paginationLink.classList.add('pagination-number__link');
  paginationLink.setAttribute('href', link)
  paginationLink.textContent = number;

  return paginationLink;
};

export const createPaginationItem = (num, link, linkActive) => {
  const paginationItem = document.createElement('li');
  paginationItem.classList.add('pagination-number__item');
  if (linkActive) {
    paginationItem.classList.add('pagination-number__item_page_active');
  }
  paginationItem.append(createPaginationLink(num, link));

  return paginationItem;
};

export const createAuthorDetails = (details) => (`
      <p class="author-text author__name">Имя Автора: ${details.data.name}</p>
      <p class="author-text author__gender">Пол: ${details.data.gender}</p>
      <p class="author-text author__status">Статус: ${details.data.status}</p>
      <a class="author-text author__email" href="mailto:${details.data.email}">Email: ${details.data.email}</a>
    `
);



