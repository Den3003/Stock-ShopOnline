import domElements from "./domElements.js";
import { renderCountBasket } from "./render.js";

export const getCart = () => {
  return JSON.parse(localStorage.getItem('shopOnlineBasket')) || [];
};


//     Обновление общей цены корзины

export const updateTotalPrice = (item) => {
  
  const totalPrice = item.reduce((sum, { price, quantity }) => sum + (price * quantity), 0);
  const totalPriceDiscount = item.reduce((sum, { price, quantity, discount }) => {
    return sum + ((discount ? price - (price * (discount / 100)) : price) * quantity);
  }, 0);
  const totalDiscount = totalPrice - totalPriceDiscount;
  
  domElements.orderSummaryTotalDiscountPriceSpan.textContent = totalPriceDiscount;
  domElements.orderSummaryTotalPriceSpan.textContent = totalPrice;
  domElements.orderSummaryTotalDiscountSpan.textContent = totalDiscount;

  
};


//   Сохранение корзины в localStorage

export const saveCart = (cart) => {
    localStorage.setItem('shopOnlineBasket', JSON.stringify(cart));
}


// Функция добавления товара в корзину

export const addToCart = (product) => {

  // return function() {
    const cart = getCart();
    const existingProduct = cart.find(item => item.id === product.id);
    // existingProduct.count--;
    console.log(product);
    
    if (existingProduct) {
      console.log('existingProduct: ', existingProduct);
      if(existingProduct.count === existingProduct.quantity) {
        alert('Максимальное кол-во в корзине');
      } else {
        existingProduct.quantity++;
      }
    } else {
        // product.count--;
        cart.push({ ...product, quantity: 1 });
    }
    saveCart(cart);
    renderCountBasket(domElements.basketIconCount);
  // }
  
}




// Слушаем событие 'storage', чтобы обновлять счетчик корзины между вкладками
window.addEventListener('storage', (event) => {
    if (event.key === 'shopOnlineBasket') {
        // updateCartCounter();
      renderCountBasket(domElements.basketIconCount);
    }
});