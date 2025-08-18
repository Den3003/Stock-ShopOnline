import { timer } from './modules/timer.js';

document.addEventListener('DOMContentLoaded', () => {
    const timerWrapper = document.querySelector('[data-timer-deadline]');

    if (timerWrapper) {
        const deadline = timerWrapper.getAttribute('data-timer-deadline');
        timer(deadline);
    } else {
        return;
    }
});
