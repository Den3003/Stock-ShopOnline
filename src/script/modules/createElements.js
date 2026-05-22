import { addToCart, getCart, saveCart } from "./basket.js";
import { changeQuantityProduct, updateSelectAll } from "./control.js";
import domElements from "./domElements.js";
import { renderBasket, renderCountBasket } from "./render.js";
import { escapeHtml } from "./utils.js";
import { IMAGE_BASE, sizeImage } from "./variables.js";

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

// export const createAuthorDetails = (details) => (`
//       <p class="author-text author__name">Имя Автора: ${details.data.name}</p>
//       <p class="author-text author__gender">Пол: ${details.data.gender}</p>
//       <p class="author-text author__status">Статус: ${details.data.status}</p>
//       <a class="author-text author__email" href="mailto:${details.data.email}">Email: ${details.data.email}</a>
//     `
// );

//    Создание карточки товара

{/* <source media="(max-width: 992px)" srcset="images/profitable/futbolka-768.jpg"></source> */}
{/* <source media="(max-width: 1200px)" srcset="images/profitable/futbolka-1024.jpg"></source> */}

export const createProductCard = (classItem, data, index) => {
  console.log("index :", index);
  
  const productWrapper = document.createElement('li');
  productWrapper.classList.add("product-grid__item", `${classItem}`); 
  productWrapper.setAttribute('tabindex', '0');
  const classDiscount = data.discount ? "" : " product-card__discount_hidden";
  const classDiscountPrice = data.discount ? " product-card__price-old_visible" : "";
  const price = data.discount ? data.price - (data.price * (data.discount / 100)) : data.price;

  //  Добавление атрибутов картинкам

  const isFirstRows = index < 4;
  const loadingAttr = isFirstRows ? 'eager' : 'lazy';
  const priorityAttr = isFirstRows ? 'fetchpriority="high"' : '';

  const article = `
    <article class="product-card" data-id="${escapeHtml(data.id)}">
      <h3 class="visually-hidden product-card__title-hidden">${escapeHtml(data.title)}</h3>
      <div class="product-card__image-wrapper">
        <picture>
          
          
          <img data-index="${index}" class="product-card__image" src="https://3aa4815d-4ee1-4789-99ce-c7187262f6f5-00-1cfe07zl84xve.janeway.replit.dev:3000/${escapeHtml(data.image)}" alt="${escapeHtml(data.title)}" width="420" height="295" loading="${loadingAttr}"
            ${priorityAttr}>
        </picture>
        <span class="product-card__discount${classDiscount}">-${data.discount}%</span>
      </div>

      <div class="product-card__price-group">
        <span class="product-card__price">
          <span class="visually-hidden">
            Новая цена:
          </span>
          ${price} ₽
        </span>

        <del class="product-card__price-old${classDiscountPrice}">
          <span class="visually-hidden">
            Старая цена:
          </span>
          ${data.price} ₽
        </del>
      </div>

      <a class="product-card__title" href="card.html?id=${escapeHtml(data.id)}" tabindex="-1">
        ${escapeHtml(data.title)}
      </a>
    </article>
  `;

  productWrapper.innerHTML = article;
  return productWrapper;
};

//     Описание товара

export const createCardInfo = (data) => {
  const classDiscount = data.discount ? "" : " card__percentage_hidden";
  const price = data.discount ? data.price - (data.price * (data.discount / 100)) : data.price;
  const classDiscountPrice = data.discount ? " card__old-price_visible" : "";

  const card = `
    <div class="container">
      <h1 class="card__title">${escapeHtml(data.title)}</h1>
      <hr class="card__line">
    </div>
      <div class="container container_mobile_display">
        <div class="card__content card-content">
          <div class="card-content__container">
            <div class="card__media">
              <img class="card__image" width="757" height="427" src="https://3aa4815d-4ee1-4789-99ce-c7187262f6f5-00-1cfe07zl84xve.janeway.replit.dev:3000/${escapeHtml(data.image)}" alt="${escapeHtml(data.title)}">
              <p class="card__percentage${classDiscount}">-${data.discount}%</p>
            </div>
          </div>
          <div class="card__meta meta-card">
            <div class="meta-card__container">
              <div class="card__prices">
                <p class="card__price">${price} ₽</p>
                <p class="card__old-price${classDiscountPrice}">${data.price} ₽</p>
              </div>
              <p class="card__credit-price">В кредит от 5600 ₽</p>
              <div class="card__controls">
                <button class="card__button-basket" type="button">Добавить в корзину</button>
                <button class="card__button-favorite" type="button">
                  <svg class="card__button-favorite-icon" width="29" height="26" viewBox="0 0 29 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.6875 0.125C18.295 0.125 15.9987 1.23875 14.5 2.99875C13.0012 1.23875 10.705 0.125 8.3125 0.125C4.0775 0.125 0.75 3.4525 0.75 7.6875C0.75 12.885 5.425 17.12 12.5062 23.555L14.5 25.3563L16.4937 23.5413C23.575 17.12 28.25 12.885 28.25 7.6875C28.25 3.4525 24.9225 0.125 20.6875 0.125ZM14.6375 21.5062L14.5 21.6437L14.3625 21.5062C7.8175 15.58 3.5 11.6613 3.5 7.6875C3.5 4.9375 5.5625 2.875 8.3125 2.875C10.43 2.875 12.4925 4.23625 13.2212 6.12H15.7925C16.5075 4.23625 18.57 2.875 20.6875 2.875C23.4375 2.875 25.5 4.9375 25.5 7.6875C25.5 11.6613 21.1825 15.58 14.6375 21.5062Z" fill="#3670C7"/>
                  </svg>
                </button>
              </div>
              <div class="card__delivery-description">
                <div class="card__delivery delivery-card">
                  <p class="card__text card__delivery-description-title">Доставка</p>
                  <p class="card__text delivery-card__description">1-3 января</p>
                </div>
                <div class="card__vendor vendor-card">
                  <p class="card__text card__delivery-description-title">Продавец</p>
                  <p class="card__text vendor-card__description">ShopOnline</p>
                </div>
              </div>
              <button class="card__button-price-cut card-button-price-cut" type="button">
                <svg class="card-button-price-cut__icon" width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 11.586V8C16 4.783 13.815 2.073 10.855 1.258C10.562 0.52 9.846 0 9 0C8.154 0 7.438 0.52 7.145 1.258C4.185 2.074 2 4.783 2 8V11.586L0.293001 13.293C0.199958 13.3857 0.126171 13.4959 0.0758854 13.6172C0.0256001 13.7386 -0.000189449 13.8687 1.04767e-06 14V16C1.04767e-06 16.2652 0.105358 16.5196 0.292894 16.7071C0.480431 16.8946 0.734785 17 1 17H17C17.2652 17 17.5196 16.8946 17.7071 16.7071C17.8946 16.5196 18 16.2652 18 16V14C18.0002 13.8687 17.9744 13.7386 17.9241 13.6172C17.8738 13.4959 17.8 13.3857 17.707 13.293L16 11.586ZM16 15H2V14.414L3.707 12.707C3.80004 12.6143 3.87383 12.5041 3.92412 12.3828C3.9744 12.2614 4.00019 12.1313 4 12V8C4 5.243 6.243 3 9 3C11.757 3 14 5.243 14 8V12C14 12.266 14.105 12.52 14.293 12.707L16 14.414V15ZM9 20C9.6193 20.0008 10.2235 19.8086 10.7285 19.4502C11.2335 19.0917 11.6143 18.5849 11.818 18H6.182C6.38566 18.5849 6.76648 19.0917 7.27151 19.4502C7.77654 19.8086 8.3807 20.0008 9 20Z" fill="currentColor"/>
                </svg>
                Узнать о снижении цены
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <p class="card__description-title">Описание:</p>
        <p class="card__description-text">${data.description}</p>
      </div>
  `;

  domElements.cardWrapper.innerHTML = card;

  //   Кнопка добавления товара в корзину

  const btnAddBasket = domElements.cardWrapper.querySelector('.card__button-basket');

  btnAddBasket.addEventListener('click', (e) => {
    const basket = getCart();
    const itemBasket = basket.filter(item => item.id === data.id);
    addToCart(data);
  });

  
};


//    Создание элемента в меню каталог


export const createCatalogItem = (data, classMenu) => {
  const catalogItem = document.createElement('li');
  catalogItem.classList.add(`${classMenu}__item`);
  const catalogLink = `
    <a class="${classMenu}__link" href="category.html?category=${data}">${data}</a>
  `;

  catalogItem.innerHTML = catalogLink;
  return catalogItem;
};


//     Создание элемента на странице корзины 

export const createItemBasket = (itemBasket) => {
  const basketItemWrapper = document.createElement('li');
  basketItemWrapper.classList.add('basket__item', 'basket-item');
  const classDiscountPrice = itemBasket.discount ? " basket-item__price-old_visible" : "";
  const price = itemBasket.discount ? itemBasket.price - (itemBasket.price * (itemBasket.discount / 100)) : itemBasket.price; 

  const item = `
    <div class="basket-item__checkbox-image-wrapper">
      <input class="basket__checkbox-input basket-item__checkbox" type="checkbox" data-id="${itemBasket.id}">
                      
      <!-- ЭЛЕМЕНТ: обёртка изображения для управления размером/обрезкой -->
      <div class="basket-item__image-wrapper">
        <img class="basket-item__image" src="https://3aa4815d-4ee1-4789-99ce-c7187262f6f5-00-1cfe07zl84xve.janeway.replit.dev:3000/${escapeHtml(itemBasket.image)}" alt="${escapeHtml(itemBasket.title)}">
      </div>
    </div>

    <!-- ЭЛЕМЕНТ: информационный блок товара -->
    <div class="basket-item__info">
      <p class="basket-item__name">${escapeHtml(itemBasket.title)}</p>
                      
      <!-- ЭЛЕМЕНТ: список атрибутов товара (цвет, память и т.д.) -->
      <ul class="basket-item__attrs">
        <li class="basket-item__attr">
          <span class="basket-item__attr-label">Цвет:</span>
          <span class="basket-item__attr-value">чёрный</span>
        </li>
        <li class="basket-item__attr">
          <span class="basket-item__attr-label">Оперативная память:</span>
          <span class="basket-item__attr-value">16 ГБ</span>
        </li>
      </ul>
    </div>

    <!-- ЭЛЕМЕНТ + БЛОК quantity-control (пере используемый счётчик количества) -->
    <div class="basket-item__quantity quantity-control">
      <button class="quantity-control__btn quantity-control__btn_minus" data-id="${itemBasket.id}">-</button>
      <span class="quantity-control__value">${itemBasket.quantity}</span>
      <button class="quantity-control__btn quantity-control__btn_plus" data-id="${itemBasket.id}">+</button>
    </div>
                    
    <!-- ЭЛЕМЕНТ: ценовая группа товара -->
    <div class="basket-item__pricing">
      <span class="basket-item__price">
        <span class="visually-hidden">
          Цена:
        </span>
        ${price} ₽
      </span>

      <!-- ЭЛЕМЕНТ: старая (зачёркнутая) цена -->
      <del class="basket-item__price-old${classDiscountPrice}">
        <span class="visually-hidden">
          Старая цена:
        </span>
        ${itemBasket.price} ₽
      </del>

      <a class="basket-item__credit" href="#">В кредит от 5600 ₽</a>
    </div>
    <button class="basket-item__remove" type="button" aria-label="Удалить товар" data-id="${itemBasket.id}">
      <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z" fill="#C9C9C9" />
      </svg>
    </button>
  `;

  basketItemWrapper.innerHTML = item;

  const btnsWrapper = basketItemWrapper.querySelector('.quantity-control');
  const quantityProduct = basketItemWrapper.querySelector('.quantity-control__value');
  const btnMinus = basketItemWrapper.querySelector('.quantity-control__btn_minus');
  const btnPlus = basketItemWrapper.querySelector('.quantity-control__btn_plus');
  const btnRemoveItem = basketItemWrapper.querySelector('.basket-item__remove');

  
  if (itemBasket.count === itemBasket.quantity) {
    btnPlus.setAttribute('disabled', 'true');
  } else {
    btnPlus.removeAttribute('disabled');
  }

  btnRemoveItem.addEventListener('click', (e) => {
    const parent = e.target.closest('.basket-item');
    const inputItem = parent.querySelector('.basket-item__checkbox');
    if (inputItem.checked) {
      const products = getCart();
      const newBasket = products.filter(item => item.id !== inputItem.dataset.id);
      saveCart(newBasket);
      renderBasket();
      renderCountBasket(domElements.basketIconCount);
      renderCountBasket(domElements.basketTitleCounter);
      renderCountBasket(domElements.orderSummaryCountProduct);
      updateSelectAll();
    }
    
  });
  
  
  //   Если товара количества один блокируем кнопку плюс и кнопку минус
  
  if (itemBasket.count === 1) {
    basketItemWrapper.querySelectorAll('.quantity-control__btn').forEach(item => item.setAttribute('disabled', 'true'));
  }


  //   Если товара выбран один блокируем кнопку минус

  if (itemBasket.quantity === 1) {
    btnMinus.setAttribute('disabled', 'true');
  }


  //   Навешиваем события на кнопки количества товара

  btnsWrapper.addEventListener('click', e => {
    const target = e.target;
    
    if (target.classList.contains('quantity-control__btn_minus')) {
      const idItem = target.dataset.id;
      changeQuantityProduct(idItem, -1, quantityProduct, target, btnMinus, btnPlus);
    }

    if (target.classList.contains('quantity-control__btn_plus')) {
      const idItem = target.dataset.id;
      changeQuantityProduct(idItem, 1, quantityProduct, target, btnMinus, btnPlus);
    }
  });


  return basketItemWrapper;
};



//     Создание картинки на странице корзины в блоке delivery

export const createImageDelivery = (item) => {
  const imgWrapper = document.createElement('div');
  imgWrapper.classList.add('delivery__image-wrapper'); 
  const img = `
    <img class="delivery__preview-img" src="https://3aa4815d-4ee1-4789-99ce-c7187262f6f5-00-1cfe07zl84xve.janeway.replit.dev:3000/${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">
  `;
  imgWrapper.innerHTML = img;

  return imgWrapper;
};



//   Показать скелетоны карточки товаров

export const showSkeletonsCard = (container, count = 8) => {
  const skeletonProducts = Array(count)
    .fill()
    .map(
      () => `
    <div class="skeleton">
      <div class="skeleton__image"></div>
      <div class="skeleton__prices">
        <span class="skeleton__price"></span>
        <span class="skeleton__price skeleton__price_old"></span>
      </div>
      <div class="skeleton__text"></div>
    </div>
    `
    )
    .join('');

  container.innerHTML = skeletonProducts;
  container.setAttribute('aria-busy', 'true');
};


//    Показать скелетон текста

