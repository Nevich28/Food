import { closeModal, openModal } from "./modal";
import { postData } from "../services/services";

function forms(formSelector, modalTimerId) {
	// Формы
	const forms = document.querySelectorAll(formSelector);//переменная для самой формы

	const message = { //список сообщений для статусов загрузки
		loading: 'img/form/spinner.svg',
		success: 'Спасибо! Скоро мы с вами свяжемся',
		failure: 'Что-то пошло не так...'
	};

	forms.forEach(item => { //цикл для двух видов одной и той же формы
		bindPostData(item);
	}); 



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
		openModal('.modal', modalTimerId);

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
			closeModal('.modal');
		}, 4000);
	}
}

export default forms;