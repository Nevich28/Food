/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/modules/calc.js":
/*!********************************!*\
  !*** ./src/js/modules/calc.js ***!
  \********************************/
/***/ (function(module) {

function calc() {
	//калькулятор

	const result = document.querySelector('.calculating__result span');
	let sex, height, weight, age, ratio;

	if (localStorage.getItem('sex')) {
		sex = localStorage.getItem('sex');
	}	else {
		sex = 'female';
		localStorage.setItem('sex', 'female');
	}
	if (localStorage.getItem('ratio')) {
		ratio = localStorage.getItem('ratio');
	}	else {
		ratio = 1.375;
		localStorage.setItem('ratio', 1.375);
	}

	function initLocalSettings(selector, activeClass) {
		const elements = document.querySelectorAll(selector);
		elements.forEach(elem => {
			elem.classList.remove(activeClass);
			if (elem.getAttribute('id') === localStorage.getItem('sex')) {
				elem.classList.add(activeClass);
			}
			if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
				elem.classList.add(activeClass);
			}
		});
	}

	initLocalSettings('#gender div', 'calculating__choose-item_active');
	initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

	function calcTotal() {
		if (!sex || !height || !weight || !age || !ratio) {
			result.textContent = '____';
			return;
		}
		if (sex === 'female') {
			result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
		} else {
			result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
		}
	}

	calcTotal();

	function getStaticInformation(selector, activeClass) {
		const element = document.querySelectorAll(selector);

		element.forEach(elem => {
			elem.addEventListener('click', (e) => {
				if (e.target.getAttribute('data-ratio')) {
					ratio = +e.target.getAttribute('data-ratio');
					localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
				} else {
					sex = e.target.getAttribute('id');
					localStorage.setItem('sex', e.target.getAttribute('id'));
				}
				//console.log(ratio, sex);
	
				element.forEach(elem => {
					elem.classList.remove(activeClass);
				});
	
				e.target.classList.add(activeClass);
				calcTotal();
			});
		});
	}

	getStaticInformation('#gender div', 'calculating__choose-item_active');
	getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

	function getDynamicInformation(selector) {
		const input = document.querySelector(selector);

		input.addEventListener('input', () => {

			if (input.value.match(/\D/g)) {
				input.style.border = '1px solid red';
			} else {
				input.style.border = 'none';
			}

			switch(input.getAttribute('id')) {
			case 'height':
				height = +input.value;
				break;
			case 'weight':
				weight = +input.value;
				break;
			case 'age':
				age	= input.value;
				break;	
			}
			calcTotal();
		});
	}
	getDynamicInformation('#height');
	getDynamicInformation('#weight');
	getDynamicInformation('#age');
}

module.exports = calc;

/***/ }),

/***/ "./src/js/modules/cards.js":
/*!*********************************!*\
  !*** ./src/js/modules/cards.js ***!
  \*********************************/
/***/ (function(module) {

function cards() {
// используем классы для создания карточек
	class MenuItem {
		constructor(title, descr, price, imgUrl, alt, parentSelector = '.menu .container', ...classes) {
			this.title = title;
			this.descr = descr;
			this.price = price;
			this.imgUrl = imgUrl,
			this.alt = alt;
			this.classes = classes;
			this.parent = document.querySelector(parentSelector);
			this.transfer = 27;
			this.changeToUAH();
		}

		changeToUAH() {
			this.price = this.price * this.transfer;
		}
		render () {
			const element = document.createElement('div');
			if (this.classes.length == 0) {
				this.element = 'menu__item';
				element.classList.add(this.element);
			} else {
				this.classes.forEach(className => element.classList.add(className));
			}
			element.innerHTML = `
                <img src=${this.imgUrl} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
        `;
			this.parent.append(element);
		}
	}


	axios.get('http://localhost:3000/menu')
		.then(data => {
			data.data.forEach(({title, descr, price, img, altimg}) => {
				new MenuItem(title, descr, price, img, altimg).render();
			});
		});

}

module.exports = cards;

/***/ }),

/***/ "./src/js/modules/forms.js":
/*!*********************************!*\
  !*** ./src/js/modules/forms.js ***!
  \*********************************/
/***/ (function(module) {

function forms() {
	// Формы
	const forms = document.querySelectorAll('form');//переменная для самой формы

	const message = { //список сообщений для статусов загрузки
		loading: 'img/form/spinner.svg',
		success: 'Спасибо! Скоро мы с вами свяжемся',
		failure: 'Что-то пошло не так...'
	};

	forms.forEach(item => { //цикл для двух видов одной и той же формы
		bindPostData(item);
	}); 

	const postData = async (url, data) => { //функция для отправки запроса на вервер и получения обратно ответа в json
		const res =  await fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: data
		});

		return await res.json();
	};

	function bindPostData(form) { //при нажатии подтверждения в форме
		form.addEventListener('submit', (e) => {
			e.preventDefault();

			const statusMessage = document.createElement('img'); //добавка сообщения после выполнения отправки формы
			statusMessage.src = message.loading;
			statusMessage.style.cssText = `
				display: block;
				margin: 0 auto;
				`;
			form.insertAdjacentElement('afterend', statusMessage); 

			const formData = new FormData(form); //получение данных из формы

			const json = JSON.stringify(Object.fromEntries(formData.entries())); //сборка json из полученных данных

			postData('http://localhost:3000/requests', json) //отправка самого запроса с формы обратной связи
				.then(data => { //сообщение о том что все нормально
					console.log(data);
					showThanksModal(message.success);
					statusMessage.remove();
				}).catch(() => { //если произошла ошибка
					showThanksModal(message.failure);
				}).finally(() => {  // очистка формы ввода в любом случае
					form.reset();
				});
		});
	}
	function showThanksModal(message) { //создание модалки после отправки запроса
		const prevModalDialog = document.querySelector('.modal__dialog');

		prevModalDialog.classList.add('hide');
		openModal();

		const thanksModal = document.createElement('div');
		thanksModal.classList.add('modal__dialog');
		thanksModal.innerHTML = `
			<div class="modal__content">
				<div class="modal__close" data-close>&times;</div>
				<div class="modal__title">${message}</div>
			</div>
		`;

		document.querySelector('.modal').append(thanksModal); //возврат на место нормальной модалки
		setTimeout(() => {
			thanksModal.remove();
			prevModalDialog.classList.add('show');
			prevModalDialog.classList.remove('hide');
			closeModal();
		}, 4000);
	}
}

module.exports = forms;

/***/ }),

/***/ "./src/js/modules/modal.js":
/*!*********************************!*\
  !*** ./src/js/modules/modal.js ***!
  \*********************************/
/***/ (function(module) {

function modal() {
	// модальное окно
	const modalTrigger = document.querySelectorAll('[data-modal]'), // переменные
		modal = document.querySelector('.modal');

	function openModal() { // открытие окна
		modal.classList.add('show');
		modal.classList.remove('hide');
		document.body.style.overflow = 'hidden';
		clearInterval(modalTimerId);
	}	
	modalTrigger.forEach(btn => { //запуск по нажатию на одну из кнопок
		btn.addEventListener('click',openModal);
	});	

	function closeModal() { // закрытие окна
		modal.classList.add('hide');
		modal.classList.remove('show');
		document.body.style.overflow = ''; 
	}

	modal.addEventListener('click', (event) => { //закрытие при нажатии вне окна
		if (event.target === modal || event.target.getAttribute('data-close') == '') {
			closeModal(); 
		}
	});

	document.addEventListener('keydown', (e) => { //закрытие эскейпом
		if (e.code === 'Escape' && modal.classList.contains('show')) {
			closeModal();
		}
	});

	const modalTimerId = setTimeout(openModal, 10000); // открытие окна по таймеру

	function showModalByScroll() {  // открытие при долистывании до низа, при этом если оно уже 1 раз показалось, то больше не будет
		if (window.pageYOffset + document.documentElement.clientHeight > document.documentElement.scrollHeight -1) {
			openModal();
			window.removeEventListener('scroll',showModalByScroll);
		}
	}

	window.addEventListener('scroll',showModalByScroll); 
}

module.exports = modal;

/***/ }),

/***/ "./src/js/modules/slider.js":
/*!**********************************!*\
  !*** ./src/js/modules/slider.js ***!
  \**********************************/
/***/ (function(module) {

function slider() {
	// слайдер версия 2
	const slides = document.querySelectorAll('.offer__slide'),
		slider = document.querySelector('.offer__slider'),
		prev = document.querySelector('.offer__slider-prev'),
		next = document.querySelector('.offer__slider-next'),
		total = document.querySelector('#total'),
		current = document.querySelector('#current'),
		slidesWrapper = document.querySelector('.offer__slider-wrapper'),
		slidesField = document.querySelector('.offer__slider-inner'),
		width = window.getComputedStyle(slidesWrapper).width;

	let slideIndex = 1,
		offset =  0;

	if (slides.length < 10) {// добавляем вначале 0, если количество меньше 10
		total.textContent = `0${slides.length}`;
		current.textContent = `0${slideIndex}`;
	} else {
		total.textContent = slides.length;
		current.textContent = slideIndex;
	}

	function replacePx(instr) { //убираем рх в конце строки
		return instr.replace(/\D/g, '');
	}

	slidesField.style.width = 100 * slides.length + '%'; //ставим ширину полотна прокрутки сумарно от всех слайдов
	slidesField.style.display = 'flex';
	slidesField.style.transition = '0.5s all';

	slidesWrapper.style.overflow = 'hidden';// прячем все слайды, которые не влазят в окно просмотра

	slides.forEach(slide => {//ставим всем слайдам одинаковую ширину
		slide.style.width = width;
	});

	slider.style.position = 'relative';

	const indicators = document.createElement('ol'), //делаем внизу индикатор прокрутки через список
		dots = [];
	indicators.classList.add('carousel-indicators'); 
	slider.append(indicators);

	for (let i = 0; i < slides.length; i++) {// добавляем индикатор прокрутки в верстку
		const dot = document.createElement('li');
		dot.setAttribute('data-slide-to', i+1);
		dot.classList.add('dot');
		if (i == 0) {
			dot.style.opacity = 1;
		}
		indicators.append(dot);
		dots.push(dot);
	}

	next.addEventListener('click', () => { //обработка нажатия на кнопку вперед
		if (offset == +replacePx(width) * (slides.length - 1)) {//двигаем сам слайдер
			offset = 0;
		} else {
			offset += +replacePx(width);
		}
		slidesField.style.transform = `translateX(-${offset}px)`;

		if (slideIndex == slides.length) { //меняем номер текущего слайда
			slideIndex = 1;
		} else {
			slideIndex++;
		}
		if (slides.length < 10) {
			current.textContent = `0${slideIndex}`;
		} else {
			current.textContent = slideIndex;
		}

		dots.forEach(dot => dot.style.opacity = '.5'); //меняем индикатор слайдера
		dots[slideIndex-1].style.opacity = 1;
	});

	prev.addEventListener('click', () => { //обработка нажатия на кнопку назад
		if (offset == 0) { //двигаем сам слайдер
			offset = +replacePx(width) * (slides.length - 1);
		} else {
			offset -= +replacePx(width);
		}
		slidesField.style.transform = `translateX(-${offset}px)`;

		if (slideIndex == 1) { //меняем номер текущего слайда
			slideIndex = slides.length;
		} else {
			slideIndex--;
		}

		if (slides.length < 10) { //меняем индикатор слайдера
			current.textContent = `0${slideIndex}`;
		} else {
			current.textContent = slideIndex;
		}
		dots.forEach(dot => dot.style.opacity = '.5');
		dots[slideIndex-1].style.opacity = 1;
	});

	dots.forEach(dot => { //делаем кликабельным индикатор слайдера
		dot.addEventListener('click', (e) => {
			const slideTo = e.target.getAttribute('data-slide-to');

			slideIndex = slideTo;
			offset = +width.slice(0, width.length-2) * (slideTo - 1);
			slidesField.style.transform = `translateX(-${offset}px)`;
			if (slides.length < 10) {
				current.textContent = `0${slideIndex}`;
			} else {
				current.textContent = slideIndex;
			}
			dots.forEach(dot => dot.style.opacity = '.5');
			dots[slideIndex-1].style.opacity = 1;
		});
	});
}

module.exports = slider;

/***/ }),

/***/ "./src/js/modules/tabs.js":
/*!********************************!*\
  !*** ./src/js/modules/tabs.js ***!
  \********************************/
/***/ (function(module) {

function tabs() {
	//Создание табов
	const tabs = document.querySelectorAll('.tabheader__item'),
		tabsContent = document.querySelectorAll('.tabcontent'),
		tabsParent = document.querySelector('.tabheader__items');

	function hideTabContent() {//тут мы скрываем табы и пункт меню
		tabsContent.forEach(item => {
			item.classList.add('hide');
			item.classList.remove('show', 'fade');
		});

		tabs.forEach(item => {
			item.classList.remove('tabheader__item_active');
		});
	}

	function showContent(i = 0) {//тут мы показываем табы и пункт меню
		tabsContent[i].classList.add('show', 'fade');
		tabsContent[i].classList.remove('hide');
		tabs[i].classList.add('tabheader__item_active');
	}

	hideTabContent(); // скрываем все табы 
	showContent(); // показываем первый

	tabsParent.addEventListener('click', (event) => { // при нажатии на нужный таб показываем его
		const target = event.target;
		if (target && target.classList.contains('tabheader__item')) {
			tabs.forEach((item, i) => {
				if (target == item) {
					hideTabContent();
					showContent(i);
				}
			});
		}
	});
}

module.exports = tabs;

/***/ }),

/***/ "./src/js/modules/timer.js":
/*!*********************************!*\
  !*** ./src/js/modules/timer.js ***!
  \*********************************/
/***/ (function(module) {

function timer() {
	//Создание таймера
	const deadline = '2023-02-20';

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
	setClock('.timer', deadline);
}

module.exports = timer;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
window.addEventListener('DOMContentLoaded', () => {
	const tabs = __webpack_require__(/*! ./modules/tabs */ "./src/js/modules/tabs.js"),
		modal = __webpack_require__(/*! ./modules/modal */ "./src/js/modules/modal.js"),
		timer = __webpack_require__(/*! ./modules/timer */ "./src/js/modules/timer.js"),
		cards = __webpack_require__(/*! ./modules/cards */ "./src/js/modules/cards.js"),
		calc = __webpack_require__(/*! ./modules/calc */ "./src/js/modules/calc.js"),
		forms = __webpack_require__(/*! ./modules/forms */ "./src/js/modules/forms.js"),
		slider = __webpack_require__(/*! ./modules/slider */ "./src/js/modules/slider.js");
	
	tabs();
	modal(); 
	timer(); 
	cards(); 
	calc();
	forms(); 
	slider();
});

}();
/******/ })()
;
//# sourceMappingURL=bundle.js.map