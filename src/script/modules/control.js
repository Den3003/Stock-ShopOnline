import { setTimeout } from "core-js";
import domElements from "./domElements.js";
import { getCart, saveCart, updateTotalPrice } from "./basket.js";
import { renderBasket, renderCountBasket } from "./render.js";

export const getCurrentPageFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('page')) || 1;
}

export const controlArrow = (currentPage, totalPages) => {
  if (currentPage === 1) {
    domElements.paginationArrowLeft.classList.add('disabled');
  } else {
    domElements.paginationArrowLeft.href = `?page=${currentPage - 1}`;
  }

  if (currentPage === totalPages) {
    domElements.paginationArrowRight.classList.add('disabled');
  } else {
    domElements.paginationArrowRight.href = `?page=${currentPage + 1}`;
  }

};

export const getVisiblePages = (current, total) => {
  let pages = [];

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    if (current <= 2) {
      pages = [1, 2, 3];
    } else if (current >= total - 1) {
      pages = [total - 2, total - 1, total];
    } else {
      pages = [current - 1, current, current + 1];
    }
  }

  return pages;
}

export const controlLoader = (toggle) => {
  if (toggle) {
    document.body.style.overflowY = 'hidden';
    domElements.loaderWrapper.style.opacity = 1;
  } else {
    domElements.loaderWrapper.animate(
      [
        { opacity: "1" },
        { opacity: "0" },
      ],
      {
        duration: 2000,
      },
    );
    domElements.loaderWrapper.style.opacity = 0;
    document.body.style.overflowY = 'unset';
    setTimeout(() => {
      domElements.loaderWrapper.style.display = "none";
    }, 1500);
  }
  
};


// Изменение размера экрана и обработчик клика если меньше 522px

const openList = (button, dropDown, prefix, dropdownWrapper) => {
  closeSecondaryDrop(button, dropDown, prefix, dropdownWrapper);
  button.ariaExpanded = true;

  dropDown.style.height = dropDown.scrollHeight + 'px';
  button.closest(`.${prefix}-arrow-dropdown__wrapper-list`).style.marginBottom = '30px';
  button.classList.add(`${prefix}-arrow-dropdown__button_active`);
  dropDown.classList.add(`${prefix}-arrow-dropdown__list_active`);
}

const closeList = (button, dropDown, prefix) => {
  button.ariaExpanded = false;
  button.classList.remove(`${prefix}-arrow-dropdown__button_active`);
  dropDown.classList.remove(`${prefix}-arrow-dropdown__list_active`);
  dropDown.style.height = '';
  button.closest(`.${prefix}-arrow-dropdown__wrapper-list`).style.marginBottom = '';
}

const closeSecondaryDrop = (button, dropDown, prefix, dropdownWrapper) => {
  console.log('dropdownWrapper: ', dropdownWrapper);
  dropdownWrapper.forEach(elem => {
    if (elem.children[0].children[0] !== button && elem.children[1] !== dropDown) {
      closeList(elem.children[0].children[0], elem.children[1], prefix);
    }
  });
}

const onClick = (prefix, dropdownWrapper) => {

  return function(e) {

    const target = e.target;
    if (target.classList.contains(`${prefix}-arrow-dropdown__button`)) {
      const parent = target.closest(`.${prefix}-arrow-dropdown__wrapper-list`);
      console.log('parent: ', parent);
      const list = parent.querySelector(`.${prefix}-arrow-dropdown__list`);
    
      list.classList.contains(`${prefix}-arrow-dropdown__list_active`) ? 
        closeList(target, list, prefix, dropdownWrapper) :
        openList(target, list, prefix, dropdownWrapper);
    }

  }  
  
}

export const handleScreenHeader = (e) => {
  if (e.matches) {
    domElements.navigation.addEventListener("click", onClick('header', domElements.headerDropdownWrapperList));
  } else {
    domElements.navigation.removeEventListener("click", onClick('header', domElements.headerDropdownWrapperList));
  } 
}

export const handleScreenFooter = (e) => {
  if (e.matches) {
    domElements.footer.addEventListener("click", onClick('footer', domElements.footerDropdownWrapperList));
  } else {
    domElements.footer.removeEventListener("click", onClick('footer', domElements.footerDropdownWrapperList));
  } 
}


// Кнопка в header

export const navMenu = () => {
  document.body.addEventListener('click', (e) => {
    const target = e.target;
    if(target === domElements.headerMenu || target.closest('.js-lines')) {
      // openList(domElements.btnArrow[0], domElements.navigationMenuList[0]);
      
      domElements.navigation.classList.toggle('navigation_active');
      
      if(domElements.navigation.classList.contains('navigation_active')) {
        domElements.headerMenu.setAttribute('aria-expanded', 'true');
        domElements.menuLines.classList.add('lines_active');
      } else {
        domElements.headerMenu.setAttribute('aria-expanded', 'false');
        domElements.menuLines.classList.remove('lines_active');
      }
    } else if(!target.closest('.navigation') && domElements.navigation.classList.contains('navigation_active') || target.classList.contains('navigation__link')) {
      domElements.navigation.classList.remove('navigation_active');
      domElements.menuLines.classList.remove('lines_active');
      // domElements.navigation.style.height = '';
    }
  })
}

//       Вычисление количества товара и рендер в корзине

export const changeQuantityProduct = (id, delta, spanCount, target, btnMinus, btnPlus) => {
  console.log('target: ', target);
  const item = getCart();
  const newItem = item.find(item => item.id === id);
  
  newItem.quantity += delta;
  if (newItem.quantity > 1) {
    btnMinus.removeAttribute('disabled');
  }
  if (newItem.quantity === 1) {
    btnMinus.setAttribute('disabled', 'true');
  }

  if (newItem.count === newItem.quantity) {
    btnPlus.setAttribute('disabled', 'true');
  }

  if (newItem.quantity < newItem.count) {
    btnPlus.removeAttribute('disabled');
  }

  spanCount.textContent = newItem.quantity;
  console.log('newItem.count: ', newItem.count);
  saveCart(item);
  updateTotalPrice(item);
  renderCountBasket(domElements.basketIconCount);
  renderCountBasket(domElements.basketTitleCounter);
  renderCountBasket(domElements.orderSummaryCountProduct);
};


//        Контроль чекбоксов 

export const updateSelectAll = () => {
  const checkboxes=[...document.querySelectorAll('.basket-item__checkbox')];

  if(!checkboxes.length) {
    document.querySelector('.basket__checkbox-select-all').checked=false;
    
    return;
  }
  const allChecked=checkboxes.every(c=>c.checked);
  const someChecked=checkboxes.some(c=>c.checked);
  someChecked ? domElements.basketBtnDeleteAll.removeAttribute('disabled') : domElements.basketBtnDeleteAll.setAttribute('disabled', 'true');
  const selectCheckboxAll=document.querySelector('.basket__checkbox-select-all');
  
  selectCheckboxAll.checked=allChecked;
  selectCheckboxAll.indeterminate=!allChecked&&someChecked;
};


//     Навешивание событий на чекбоксы

export const listenerCheckboxes = () => {
  document.querySelectorAll('.basket-item__checkbox').forEach(cb=>{
    // console.log('cb: ', cb);
    cb.addEventListener('change',updateSelectAll);
  });

  document.querySelector('.basket__checkbox-select-all').addEventListener('change',function(){
    document.querySelectorAll('.basket-item__checkbox').forEach(cb=>cb.checked=this.checked);
    updateSelectAll();
  });
};


//      Контроль кнопки удаления товара

export const listenerBtnBasketAllDelete = () => {
  domElements.basketBtnDeleteAll.addEventListener('click', (e) => {
    const products = getCart();
    const items = [...document.querySelectorAll('.basket-item__checkbox')];
    console.log('items: ', items);
    const checked = items.filter(e => e.checked);
    const arrayId = checked.map(e => parseInt(e.dataset.id))
    console.log('arrayId: ', arrayId);
    const newBasket = products.filter(item => !arrayId.includes(parseInt(item.id)));
    console.log('newBasket: ', newBasket);
    saveCart(newBasket);
    renderBasket();
    renderCountBasket(domElements.basketIconCount);
    renderCountBasket(domElements.basketTitleCounter);
    renderCountBasket(domElements.orderSummaryCountProduct);
    listenerCheckboxes();
    updateSelectAll();
  });
};


export const listenerBtnOrder = () => {
  domElements.btnOrder.addEventListener('click', (e) => {
    const basket = getCart();
    const target = e.target;
    const parent = target.closest('.order-summary');
    const inputAgreement = parent.querySelector('.order-summary__checkbox');
    if (inputAgreement.checked) {
      console.log(basket)
      saveCart([]);
      renderBasket();
      renderCountBasket(domElements.basketIconCount);
      renderCountBasket(domElements.basketTitleCounter);
      renderCountBasket(domElements.orderSummaryCountProduct);
    } else {
      alert('Вы должны согласиться с условиями правил пользования торговой площадкой и правилами возврата');
    }

  });
};



//        Вычисление года в подвале

export const setYear = () => {
  domElements.footerYear.textContent = new Date().getFullYear();
};