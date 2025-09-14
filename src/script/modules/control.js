import domElements from "./domElements.js";

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

const openList = (button, dropDown) => {
  closeSecondaryDrop(button, dropDown);
  button.ariaExpanded = true;

  dropDown.style.height = dropDown.scrollHeight + 'px';
  button.classList.add('footer__button_active');
  dropDown.classList.add('footer__list_active');
}

const closeList = (button, dropDown) => {
  button.ariaExpanded = false;
  button.classList.remove('footer__button_active');
  dropDown.classList.remove('footer__list_active');
  dropDown.style.height = '';
}

const closeSecondaryDrop = (button, dropDown) => {
  domElements.footerWrapperList.forEach(elem => {
    if (elem.children[0].children[0] !== button && elem.children[1] !== dropDown) {
      closeList(elem.children[0].children[0], elem.children[1]);
    }
  });
}

const onClick = (e) => {
  const target = e.target;
  if (target.classList.contains('footer__button')) {
    const parent = target.closest('.footer__wrapper-list');
    const list = parent.querySelector('.footer__list');
    list.classList.contains('footer__list_active') ? 
      closeList(target, list) :
      openList(target, list);
  }
  
  
}

export const handleScreen = (e) => {
  if (e.matches) {
    domElements.footer.addEventListener("click", onClick);
  } else {
    domElements.footer.removeEventListener("click", onClick);
  } 
}

