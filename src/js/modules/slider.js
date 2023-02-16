function slider({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) {
	// слайдер версия 2
	const slides = document.querySelectorAll(slide),
		slider = document.querySelector(container),
		prev = document.querySelector(prevArrow),
		next = document.querySelector(nextArrow),
		total = document.querySelector(totalCounter),
		current = document.querySelector(currentCounter),
		slidesWrapper = document.querySelector(wrapper),
		slidesField = document.querySelector(field),
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

export default slider;