import { getCart, updateTotalPrice } from "./basket.js";
import {
  controlArrow, 
  controlLoader, 
  getCurrentPageFromURL, 
  getVisiblePages
} from "./control.js";
import {
  createArticle, 
  createCardInfo, 
  createCatalogItem, 
  createImageDelivery, 
  createItemBasket, 
  createPaginationItem,
  createProductCard,
  showSkeletons,
} from "./createElements.js";
import domElements from "./domElements.js";
import { fetchRequest } from "./fetchApi.js";
import { 
  getArticles,
  getFullArticleData,
  getInfoProduct,
  getMenuCatalog,
  getProducts,
  getProductsCategory,
  getRecommendationsProducts,
  getSearchProducts
} from "./services.js";
import { PRODUCTS_API, USERS_API } from "./variables.js";


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

export const renderArticles = async (url) => {
  controlLoader(true);
  try {
    const data = await getArticles(url);

    const articles = data.data.map((item, index) => createArticle(item, ++index));
    renderPagination(data);
    domElements.articlesWrapper.append(...articles);
  } catch (error) {
    if (error.message === 'Failed to fetch' && window.navigator.onLine) {
      domElements.articlesWrapper.innerHTML = `<li class="article-section__title-error">Сервер не отвечает или не правильный адрес сервера!</li>`;

    }
    console.log('error :', error.name);
    console.log('error :', error.message);
    console.log('window.navigator.onLine: ', window.navigator.onLine);
    setTimeout(() => {
      controlLoader(false);
    }, 2500);
  }
  setTimeout(() => {
    controlLoader(false);
  }, 2500)
};


export const renderArticleText = async (url) => {
  controlLoader(true);
  try {
    const data = await getFullArticleData(url);
    const userId = data.data.user_id;
    domElements.breadCrumpArticleTitle.textContent = data.data.title;
    domElements.articleSpanTitle.textContent = data.data.title;
    domElements.articleTitle.textContent = data.data.title;
    domElements.articleBody.textContent = data.data.body;

    let authorDetailsText;
    console.log('data :', data);
    

    if (data.author !== 'Что-то пошло не так') {
      authorDetailsText = `<p class="author-text author__name">${data.author.data.name}</p>`;
    } else {
      authorDetailsText = `<p class="author-text">Автор не указан.</p>`;
    }

    domElements.authorDetailsBlock.insertAdjacentHTML('beforeend', authorDetailsText);

    setTimeout(() => {
      controlLoader(false);
    }, 2500);
  } catch (error) {
    domElements.articleBody.textContent = error;
    setTimeout(() => {
      controlLoader(false);
    }, 2500);
  }
};

//     Рендер товаров секции "Это выгодно!" на главной странице и на странице корзины

export const renderProducts = async (url) => {
  // showSkeletons(domElements.profitableWrapper);

  try {
    const data = await getProducts(url);
    const products = data.map((item, index) => createProductCard('profitable__item', item, index));
    domElements.profitableWrapper.innerHTML = '';
    domElements.profitableWrapper.append(...products);
    // domElements.profitableSection.style.display = 'block';
  } catch (error) {
    /* if ((error.name !== 'TypeError' && error.message !== 'Failed to fetch') || error.message !== 'Not Found') {
      console.log('error: ', error.name);
      console.log('error: ', error.message);
    } 
     */
    if (error) {
      console.log('error: ', error.name);
        console.log('error: ', error.message);
      
      }
    
  }
};


//   Рендер товаров на странице карточки товара в секции "Рекомендуем также"

export const renderRecommendationsProducts = async (url, idProduct) => {
  
  try {
    console.log('idProduct: ', idProduct);
    const data = await getProductsCategory(url);
    const newData = data.filter(item => item.id !== idProduct);
    const products = newData.map((item, index) => createProductCard('recommendations__item', item, index));


    domElements.recommendationsList.append(...products);
  } catch (error) {
    
  }

};

export const renderCardProduct = async (url) => {

  try {
    const data = await getInfoProduct(url);
    createCardInfo(data);
    domElements.breadCrumpCardTitle.textContent = data.title;
    domElements.breadCrumpCardCategory.textContent = data.category;
    domElements.breadCrumpCardCategory.href = `category.html?category=${data.category}`;
    renderRecommendationsProducts(`${PRODUCTS_API}goods/category/${data.category}`, data.id);
  } catch (error) {
    console.log(error);
    
  }

};


export const renderProductsCategory = async (url) => {
  
  try {
    const data = await getProductsCategory(url);
    const products = data.map(item => createProductCard('category__item', item));
    domElements.categoryTitle.textContent = data[0].category;
    domElements.categoryTitleHidden.textContent = data[0].category;

    domElements.categoryList.append(...products);

  } catch (error) {
    
  }

};

export const renderMenuCatalog = async (url) => {

  try {
    const data = await getMenuCatalog(url);
    const categoriesHeader = data.map(item => createCatalogItem(item, 'navigation'));
    domElements.headerCatalog.append(...categoriesHeader);
    const categoriesFooter = data.map(item => createCatalogItem(item, 'footer'));
    domElements.footerCatalog.append(...categoriesFooter);

  } catch (error) {
    
  }

};


//   Рендер способа доставки на странице корзины

export const renderDeliveryBasket = (item) => {
  const images = item.map(elem => createImageDelivery(elem));

  domElements.basketDeliveryImageList.innerHTML = '';
  domElements.basketDeliveryImageList.append(...images);
};


//    Обновление отображения корзины

export const renderBasket = () => {
  const basketItems = getCart();
  // console.log('basketItems: ', !basketItems.length);

  if (basketItems.length) {
    const products = basketItems.map(item => createItemBasket(item));
    domElements.basketList.innerHTML = '';
    domElements.basketList.append(...products);
    renderDeliveryBasket(basketItems);
    domElements.btnOrder.removeAttribute('disabled');
  } else {
    domElements.basketList.innerHTML = `
    <li class="basket-item_not-item">
    🛒 Корзина пуста. Добавьте товары из каталога.
    </li>
    `;
    domElements.btnOrder.setAttribute('disabled', 'true');
    renderDeliveryBasket(basketItems);
  }
  updateTotalPrice(basketItems);
};

//   Обновление количества товара в иконке корзины

export const renderCountBasket = (element) => {
  const basket = getCart();
  const totalItems = basket.reduce((sum, item) => sum + item.quantity, 0);
  
  if (totalItems > 0) {
    element.textContent = totalItems;
  } else {
    element.textContent = '0';
  }
};


//    Рендер страницы поиска и хлебных крошек в ней

export const renderSearch = async (url, value) => {

  try {
    const searchProducts = await getSearchProducts(url);
    const products = searchProducts.goods.map(item => createProductCard('search__item', item));
    domElements.searchList.append(...products);
    domElements.searchBreadcrumb.textContent = value;
    domElements.searchTitleSpan.textContent = `Результаты поиска "${value}"`;
    if (searchProducts.goods.length === 0) {
      domElements.searchList.innerHTML = `
    <li class="search__item_not-item">
      По запросу "${value}" ничего не найдено.
    </li>
    `;
    }
    renderProducts(`${PRODUCTS_API}discount`);
  } catch (error) {
    console.log('error: ', error);
    
  }
};



