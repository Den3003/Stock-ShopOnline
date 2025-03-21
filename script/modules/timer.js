export const timer = deadline => {
    const timerWrapper = document.querySelector('.timer');
    timerWrapper.innerHTML = `
        <p class="timer__title">До конца акции осталось:</p>
        <div class="timer__items">
            <p class="timer__item timer__item_days">
                <span class="timer__count timer__count_days">3</span> 
                <span class="timer__units timer__units_days">дня</span>
            </p> 
            <p class="timer__item timer__item_hours">
                <span class="timer__count timer__count_hours">8</span>
                <span class="timer__units timer__units_hours">часов</span>
            </p> 
            <p class="timer__item timer__item_minutes">
                <span class="timer__count timer__count_minutes">43</span>
                <span class="timer__units timer__units_minutes"> минуты</span>
            </p>
            <p class="timer__item timer__item_seconds visibly">
                <span class="timer__count timer__count_seconds">43</span>
                <span class="timer__units timer__units_seconds"> секунды</span>
            </p>
        </div>
    `;
    const timerCountDay = timerWrapper.querySelector('.timer__count_days');
    const timerCountHours = timerWrapper.querySelector('.timer__count_hours');
    const timerCountMinutes = timerWrapper
            .querySelector('.timer__count_minutes');
    const timerCountSeconds = timerWrapper
            .querySelector('.timer__count_seconds');
    const timerUnitsDays = timerWrapper.querySelector('.timer__units_days');
    const timerUnitsHours = timerWrapper.querySelector('.timer__units_hours');
    const timerUnitsMinutes = timerWrapper
            .querySelector('.timer__units_minutes');
    const timerUnitsSeconds = timerWrapper
            .querySelector('.timer__units_seconds');
    const itemDays = timerWrapper.querySelector('.timer__item_days');
    const itemSeconds = timerWrapper.querySelector('.timer__item_seconds');

    function getDeclinationTime(number, forms) {
        if (number % 100 >= 11 && number % 100 <= 14) {
            return forms[2]; // множественное число (дней, часов, минут, секунд)
        }
        const lastDigit = number % 10;
        if (lastDigit === 1) {
            return forms[0]; // именительный падеж (день, час, минута, секунда)
        }
        if (lastDigit >= 2 && lastDigit <= 4) {
            return forms[1];
            // родительный падеж, ед. число (дня, часа, минуты, секунды)
        }
        return forms[2]; // множественное число (дней, часов, минут, секунд)
    }


    const getTimeRemaining = () => {
        const dateStop = new Date(deadline + ' GMT+0300').getTime();
        const dateNow = Date.now();
        const timeRemaining = dateStop - dateNow;
        const seconds = ("seconds ", Math.floor(timeRemaining / 1000 % 60));
        const minutes = ("minutes "
        , Math.floor(timeRemaining / 1000 / 60 % 60));
        const hours = ("hours "
        , Math.floor(timeRemaining / 1000 / 60 / 60 % 24));
        const days = ("days ", Math.floor(timeRemaining / 1000 / 60 / 60 / 24));

        return {
            timeRemaining,
            seconds,
            minutes,
            hours,
            days,
        };
    };

    const start = () => {
        const timer = getTimeRemaining();

        if (timer.days <= 0) {
            itemDays.classList.add('visibly');
            itemSeconds.classList.remove('visibly');
            timerWrapper.style.background = '#556b2f';
        }

        timerCountDay.textContent = timer.days;
        timerCountHours.textContent = String(timer.hours).padStart(2, "0");
        timerCountMinutes.textContent = String(timer.minutes).padStart(2, "0");
        timerCountSeconds.textContent = String(timer.seconds).padStart(2, "0");

        timerUnitsDays.textContent =
        getDeclinationTime(timer.days, ["день", "дня", "дней"]);
        timerUnitsHours.textContent =
        getDeclinationTime(timer.hours, ["час", "часа", "часов"]);
        timerUnitsMinutes.textContent =
        getDeclinationTime(timer.minutes, ["минута", "минуты", "минут"]);
        timerUnitsSeconds.textContent =
        getDeclinationTime(timer.seconds, ["секунда", "секунды", "секунд"]);

        const intervalId = setTimeout(start, 1000);

        if (timer.timeRemaining <= 0) {
            clearTimeout(intervalId);
            timerWrapper.remove();
        }
    };

    start();
};
