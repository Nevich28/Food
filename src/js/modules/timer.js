function timer(id, deadline) {
	//Создание таймера

	function getTimeRemaining(endtime) { // определение сколько времени до окончанмя таймера
		let days, hours, minutes, seconds;
		const t = Date.parse(endtime) - Date.parse(new Date());

		if (t <= 0) {
			days = 0;
			hours = 0;
			minutes = 0;
			seconds = 0;
		} else {
			days = Math.floor(t / (1000*60*60*24)),
			hours = Math.floor((t / (1000*60*60) % 24)),
			minutes = Math.floor((t / 1000 / 60) % 60),
			seconds = Math.floor((t / 1000) % 60);
		}
		return {
			'total': t,
			'days': days,
			'hours': hours,
			'minutes': minutes,
			'seconds': seconds
		};
	}
	function getZero(num) { //добавка нуля перед числом если оно меньше 10
		if (num >= 0 && num < 10) {
			return `0${num}`;
		} else {
			return num;
		}
	}

	function setClock(selector, endtime) {//установка таймера на страницу
		const timer = document.querySelector(selector),
			days = timer.querySelector('#days'),
			hours = timer.querySelector('#hours'),
			minutes = timer.querySelector('#minutes'),
			seconds = timer.querySelector('#seconds'),
			timeInterval = setInterval(updateClock, 1000);
		updateClock();
		function updateClock() {// непосредственное вбитие данных таймера в html
			const t = getTimeRemaining(endtime);

			days.innerHTML = getZero(t.days);
			hours.innerHTML = getZero(t.hours);
			minutes.innerHTML = getZero(t.minutes);
			seconds.innerHTML = getZero(t.seconds);

			if (t.total <= 0) { //остановка отсчета таймера если время вышло
				clearInterval(timeInterval);
			}
		}
	}
	setClock(id, deadline);
}

export default timer;