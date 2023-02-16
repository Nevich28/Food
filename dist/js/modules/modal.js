function closeModal(modalSelector) { // закрытие окна
	const modal = document.querySelector(modalSelector);
	modal.classList.add('hide');
	modal.classList.remove('show');
	document.body.style.overflow = ''; 
}

function openModal(modalSelector, modalTimerId) { // открытие окна
	const modal = document.querySelector(modalSelector);	
	modal.classList.add('show');
	modal.classList.remove('hide');
	document.body.style.overflow = 'hidden';
	console.log(modalTimerId)
	if (modalTimerId) {
		clearInterval(modalTimerId);
	}
}	

function modal(triggerSalactor, modalSelector, modalTimerId) {

	
		// модальное окно
		const modalTrigger = document.querySelectorAll(triggerSalactor), // переменные
			modal = document.querySelector(modalSelector);

		

		modalTrigger.forEach(btn => { //запуск по нажатию на одну из кнопок
			btn.addEventListener('click', () => openModal(modalSelector, modalTimerId));
		});	

		modal.addEventListener('click', (event) => { //закрытие при нажатии вне окна
			if (event.target === modal || event.target.getAttribute('data-close') == '') {
				closeModal(modalSelector); 
			}
		});

		document.addEventListener('keydown', (e) => { //закрытие эскейпом
			if (e.code === 'Escape' && modal.classList.contains('show')) {
				closeModal(modalSelector);
			}
		});

		

		function showModalByScroll() {  // открытие при долистывании до низа, при этом если оно уже 1 раз показалось, то больше не будет
			if (window.pageYOffset + document.documentElement.clientHeight > document.documentElement.scrollHeight -1) {
				openModal(modalSelector,modalTimerId);
				window.removeEventListener('scroll',showModalByScroll);
			}
		}

		window.addEventListener('scroll',showModalByScroll); 
	
}
export default modal;
export {closeModal};
export {openModal};