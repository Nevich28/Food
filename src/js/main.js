import	tabs from './modules/tabs';
import	modal from './modules/modal';
import	timer from './modules/timer';
import	cards from './modules/cards';
import	calc from './modules/calc';
import	forms from './modules/forms';
import	slider from './modules/slider';
import { openModal } from './modules/modal';


window.addEventListener('DOMContentLoaded', () => {	
	const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 10000); // открытие окна по таймеру
	tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
	modal('[data-modal]', '.modal', modalTimerId); 
	timer('.timer', '2023-02-20'); 
	cards(); 
	calc();
	forms('form', modalTimerId); 
	slider({
		container: '.offer__slider',
		nextArrow: '.offer__slider-next',
		prevArrow: '.offer__slider-prev',
		totalCounter: '#total',
		currentCounter: '#current',
		wrapper: '.offer__slider-wrapper',
		field: '.offer__slider-inner',
		slide: '.offer__slide'
	});

});




const multiply20 = (price) => price * 20;
const divide100 = (price) => price / 100;
const normalizePrice = (price) => price.toFixed(2);
const mas = [multiply20, divide100, normalizePrice];

const compose = (...funks) => {
	let a = 0;
	return funks.reduceRight(function(previousValue, currentValue, index, array) {
		return previousValue + currentValue;
	  });

	//console.log(a);
};

const discount = compose(normalizePrice, divide100, multiply20);

console.log(discount(200.0));
//console.log(mas);