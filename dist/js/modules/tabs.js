function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, activeClass) {
	//Создание табов
	const tabs = document.querySelectorAll(tabsSelector),
		tabsContent = document.querySelectorAll(tabsContentSelector),
		tabsParent = document.querySelector(tabsParentSelector);

	function hideTabContent() {//тут мы скрываем табы и пункт меню
		tabsContent.forEach(item => {
			item.classList.add('hide');
			item.classList.remove('show', 'fade');
		});

		tabs.forEach(item => {
			item.classList.remove(activeClass);
		});
	}

	function showContent(i = 0) {//тут мы показываем табы и пункт меню
		tabsContent[i].classList.add('show', 'fade');
		tabsContent[i].classList.remove('hide');
		tabs[i].classList.add(activeClass);
	}

	hideTabContent(); // скрываем все табы 
	showContent(); // показываем первый

	tabsParent.addEventListener('click', (event) => { // при нажатии на нужный таб показываем его
		const target = event.target;
		if (target && target.classList.contains(tabsSelector.slice(1))) {
			tabs.forEach((item, i) => {
				if (target == item) {
					hideTabContent();
					showContent(i);
				}
			});
		}
	});
}

export default tabs;