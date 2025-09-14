import { timer } from './modules/timer.js';
import { renderArticles, renderArticleText } from './modules/render.js';
import { handleScreen } from './modules/control.js';
const mediaQuery = window.matchMedia("(max-width: 522px)");
const path = window.location.pathname;

document.addEventListener('DOMContentLoaded', () => {
    const timerWrapper = document.querySelector('[data-timer-deadline]');

    if (timerWrapper) {
        const deadline = timerWrapper.getAttribute('data-timer-deadline');
        timer(deadline);
    } else {
        return;
    }
});

mediaQuery.addEventListener("change", handleScreen);
handleScreen(mediaQuery);

if (path.includes("blog.html")) {
  renderArticles();
}

if (path.includes("article.html")) {
  renderArticleText();
}