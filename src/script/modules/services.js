import { fetchRequest } from "./fetchApi.js";
import { USERS_API } from "./variables.js";


//  Список статей
export const getArticles = (url) => fetchRequest(url);

export const getArticleById = (url) => fetchRequest(url);
export const getAuthorById = (url) => fetchRequest(url);


export const getFullArticleData = async (articleId) => {
  // Сначала получаем статью
  const article = await getArticleById(articleId);

  try {
    const author = await getAuthorById(`${USERS_API}/${article.data.user_id}`);
    console.log('author: ', author);
    // console.log('article: ', article);

    return { ...article, author };
  } catch (error) {
    console.log('author error :', error);
    console.error('author error :', error);
    return { ...article, author: 'Что-то пошло не так' };
  }
  
  

  return article;
}

//  Список товаров
export const getProducts = (url) => fetchRequest(url);

//  Выбранный товар
export const getInfoProduct = (url) => fetchRequest(url);

//  Список товаров категории
export const getProductsCategory = (url) => fetchRequest(url);

// Список категорий меню
export const getMenuCatalog = (url) => fetchRequest(url);

//  Список товаров по поиску

export const getSearchProducts = (url) => fetchRequest(url);

// // Список конкретной категории
// export const getRecommendationsProducts = (url) => fetchRequest(url);