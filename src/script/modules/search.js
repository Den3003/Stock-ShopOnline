import domElements from "./domElements.js";
import { renderSearch } from "./render.js";
import { getSearchProducts } from "./services.js";
import { debounce, escapeHtml } from "./utils.js";
import { productNames } from "./variables.js";

const path = window.location.pathname;
let activeIndex = -1;

//    Функция очищения списка подсказок

export const clearSuggestions = () => {
  domElements.suggestionsWrapper.hidden = true;
  domElements.suggestionsList.innerHTML = '';
  activeIndex = -1;
};

//  Функция проверки совпадения подсказок и рендер списка

export const getSuggestions = (query) => {
  if (!query || query.length < 2) {
    return [];
  }
  const lowerQuery = query.toLowerCase();
  console.log('productNames: ', productNames);
  return productNames
    .filter(name => name.title.toLowerCase().includes(lowerQuery))
    .slice(0, 8);
};


//   Подсветка частей совпадений в подсказках синим цветом

function highlightMatch(text, query) {
  if (!query) {
    return escapeHtml(text);
  }

  const escapedQuery = escapeHtml(query);
  const regex = new RegExp(`(${escapedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return escapeHtml(text).replace(regex, '<strong class="search-box__suggestions-item-strong-active">$1</strong>');
}

//    Рендерим подсказки если они есть

export const renderSuggestions = (suggestions, query) => {
  console.log('suggestions: ', suggestions);
  if (!suggestions.length) {
    domElements.suggestionsWrapper.hidden = true;
    return;
  }

  const html = suggestions.map(elem => `
    <li class="search-box__suggestions-item" data-id="${escapeHtml(elem.id)}" data-value="${escapeHtml(elem.title)}">${highlightMatch(elem.title, query)}</li>
  `).join('');
  domElements.suggestionsList.innerHTML = html;
  domElements.suggestionsWrapper.hidden = false;
}; 

//   Через debounce вызываем функцию совпадения совпадения подсказок и если есть вызываем функцию рендера подсказок

const debounceRender = debounce((query) => {
  const suggestions = getSuggestions(query);
  console.log('suggestions: ', suggestions);
  renderSuggestions(suggestions, query);
}, 200);

//    Делегирование кликов на контейнере подсказок

function onSuggestionsClick(e) {
  const item = e.target.closest('.search-box__suggestions-item');
  if (item) {
    const value = item.dataset.value;
    if (value) {
      domElements.searchInput.value = value;
      console.log('value: ', value);
      console.log('item.dataset.id: ', item.dataset.id);
      window.location.href = `card.html?id=${item.dataset.id}`;
    }
  }
}

//   Функция чтоб обновить активный элемент при навигации клавиатурой

function updateActiveItem(direction) {
  const items = document.querySelectorAll('.search-box__suggestions-item');
  if (items.length === 0) return;

  if (direction === 'down') {
    activeIndex = (activeIndex + 1) % items.length;
  } else if (direction === 'up') {
    activeIndex = (activeIndex - 1 + items.length) % items.length;
  }

  items.forEach((item, idx) => {
    if (idx === activeIndex) {
      item.classList.add('search-box__suggestions-item_active');
      
    } else {
      item.classList.remove('search-box__suggestions-item_active');
    }
  });

}

//    Выбрать текущую подсказку через Enter (заполнить поле и отправить форму)

// function selectCurrentSuggestion() {
//   const activeItem = document.querySelector('.search-box__suggestions-item_active');

//   if (activeItem) {
//     const value = activeItem.dataset.value;
//     if (value) {
//       domElements.searchInput.value = value;
//       console.log('activeItem.dataset.id: ',typeof activeItem.dataset.id);
//       console.log('value: ', value);
//       window.location.href = `card.html?id=${activeItem.dataset.id}`;
//     } else {
//       console.log('нет значения');
      
//     }
//   } else {
//     console.log('domElements.searchInput.value: ', domElements.searchInput.value);
//   }
// }



//   Функция для перемещения в контейнере с подсказками

function onKeyDown(e) {
  const isExpanded = !domElements.suggestionsWrapper.hidden;
  const itemsCount = document.querySelectorAll('.search-box__suggestions-item').length;

  if (isExpanded && itemsCount > 0) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        updateActiveItem('down');
        console.log('e.key: ', e.key);
        break;
      case 'ArrowUp':
        e.preventDefault();
        updateActiveItem('up');
        console.log('e.key: ', e.key);
        break;
      case 'Escape':
        e.preventDefault();
        // domElements.searchForm.reset();
        clearSuggestions();
        console.log('e.key: ', e.key);
        break;
      case 'Tab':
        e.preventDefault();
        console.log('e.key: ', e.key);
        clearSuggestions();
        break;
    }
  }
}

//    Запускаем слушатель на input search

export const listenerInput = () => {
  domElements.searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    console.log('query: ', query);
    if (query.length >= 2) {
      debounceRender(query);
    } else {
      clearSuggestions();
    }
  });

  domElements.searchInput.addEventListener('keydown', onKeyDown);
  domElements.searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const searchValue = formData.get('search');
    const activeItem = document.querySelector('.search-box__suggestions-item_active');

    if (activeItem) {
      window.location.href = `card.html?id=${activeItem.dataset.id}`;
    } else {
      window.location.href = `search.html?search=${searchValue}`;
    }
    domElements.searchForm.reset();
    clearSuggestions();
  });
  domElements.suggestionsWrapper.addEventListener('click', onSuggestionsClick)
};

