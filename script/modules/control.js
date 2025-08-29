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
    domElements.loader.style.opacity = 1;
  } else {
    domElements.loader.animate(
      [
        { opacity: "1" },
        { opacity: "0" },
      ],
      {
        duration: 2000,
      },
    );
    domElements.loader.style.opacity = 0;
    document.body.style.overflowY = 'unset';
    setTimeout(() => {
      domElements.loader.style.display = "none";
    }, 1500);
  }
  
};