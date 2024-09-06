import './scss/styles.scss';
import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ApiModel } from './components/Model/ApiModel';
import { ProductModel } from './components/Model/ProductModel';
import { Card } from './components/View/Card';
import { CardPreviewModal } from './components/View/CardPreviewModal';
import { IInputChangeData, IProductItem } from './types';
import { Modal } from './components/View/Modal';
import { cloneTemplate, ensureElement } from './utils/utils';
import { BasketModel } from './components/Model/BasketModel';
import { Basket } from './components/View/Basket';
import { BasketItem } from './components/View/BasketItem';
import { FormModel } from './components/Model/FormModel';
import { FormOrder } from './components/View/FormOrder';
import { Contacts } from './components/View/FormContacts';
import { Success } from './components/View/Success';

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const CardPreviewModalTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const apiModel = new ApiModel(CDN_URL, API_URL);
const events = new EventEmitter();
const productModel = new ProductModel(events);

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(basketTemplate, events);
const basketModel = new BasketModel();
const formOrder = new FormOrder(cloneTemplate(orderTemplate), events);
const formContacts = new Contacts(cloneTemplate(contactsTemplate), events);
const formModel = new FormModel(events);

function renderBasketContent() {
	basket.renderSumAllProducts(basketModel.getSumAllProducts());

	basket.items = basketModel.basketProducts.map((item, index) => {
		const basketItem = new BasketItem(cardBasketTemplate, () => {
			events.emit('product:removeBasket', item);
		});

		return basketItem.renderBasketItem({ data: item, index });
	});

	modal.content = basket.render();
	modal.render();
}

// Отображение карточек товара после обновления списка продуктов
events.on('products:update', () => {
	// забираем данные из модели, которые ранее взяли из api
	productModel.products.forEach((productItem: IProductItem) => {
		const card = new Card(cardCatalogTemplate, () => events.emit('card:onClick', productItem));

		ensureElement<HTMLElement>('.gallery').append(card.renderCard(productItem));
	});
});

// Получить объект данных "IProductItem" карточки по которой кликнули
events.on('card:onClick', (item: IProductItem) => {
	productModel.setSelectedCard(item);
});

// Открываем модальное окно товара *
events.on('modalCard:open', (item: IProductItem) => {
	const basketProducts = basketModel.basketProducts;
	const CardModal = new CardPreviewModal(CardPreviewModalTemplate, events, basketProducts);

	modal.content = CardModal.renderCard(item);
	modal.render();
});

// Открытие модального окна корзины
events.on('basket:open', () => {
	modal.content = basket.render();
	modal.render();
});

// Добавление товара в корзину
events.on('product:addBasket', () => {
	basketModel.setSelectedCard(productModel.selectedProduct);

	events.emit('basket:change');

	modal.close();
});

// Удаление товара из корзины
events.on('product:removeBasket', (item: IProductItem) => {
	basketModel.deleteCardToBasket(item);
	events.emit('basket:change');
});

events.on('basket:change', () => {
	basket.renderHeaderBasketCounter(basketModel.getCounter());
	renderBasketContent();
});

// Открытие модального окна "способа оплаты" и "адреса доставки"
events.on('order:open', () => {
	modal.content = formOrder.render({
		address: '',
		valid: false,
		errors: [],
	});
	modal.render();
});

// выбираем тип оплаты
events.on('order.paymentType:change', (data: IInputChangeData) => {
	formModel.payment = data.value;

	// TODO валидация
	const errors = [];

	if (!data.value) {
		errors.push('Выберите способ оплаты')
	}

	const errorMessage = errors.join('; ');

	formOrder.valid = formModel.payment && formModel.address && !errorMessage;
	formOrder.errors = errorMessage;
});

// вводим адрес
events.on(`order.address:change`, (data: IInputChangeData) => {
	formModel.address = data.value;

	// TODO валидация
	const errors = [];

	if (data.value.length <= 10) {
		errors.push('Не верный формат address')
	}

	const errorMessage = errors.join('; ');

	formOrder.valid = formModel.payment && formModel.address && !errorMessage;
	formOrder.errors = errorMessage;
});

events.on('order:submit', () => {
	modal.content = formContacts.render({
		email: '',
		phone: '',
		valid: false,
		errors: [],
	});

	modal.render();
});

// выбираем тип оплаты
events.on('contacts.email:change', (data: IInputChangeData) => {
	formModel.email = data.value;

	// TODO валидация
	const errors = [];

	if (!data.value.includes('@') || !data.value.includes('.')) {
		errors.push('Не верный формат email')
	}

	const errorMessage = errors.join('; ');

	formContacts.valid = formModel.email && formModel.phone && !errorMessage;
	formContacts.errors = errorMessage;
});

// вводим адрес
events.on('contacts.phone:change', (data: IInputChangeData) => {
	formModel.phone = data.value;

	// TODO валидация
	const errors = [];

	if (!data.value.includes('+7')) {
		errors.push('Не верный формат phone')
	}

	const errorMessage = errors.join('; ');

	formContacts.valid = formModel.email && formModel.phone && !errorMessage;
	formContacts.errors = errorMessage;
});

events.on('contacts:submit', () => {
	const total = basketModel.getSumAllProducts();
	const items = basketModel.basketProducts.filter((product: IProductItem) => product.price).map((product: IProductItem) => product.id);
	const formData = formModel.getOrderLot();
	const submitData = { ...formData, items, total }

	apiModel
		.postOrderLot(submitData)
		.then((data) => {
			basketModel.clearBasketProducts();
			basket.renderHeaderBasketCounter(basketModel.getCounter());
			events.emit('basket:change');

			const success = new Success(successTemplate, events);

			modal.content = success.renderSuccess(data.total);
			modal.render();
		})
		.catch((error) => console.log(error));
});

events.on('success:close', () => modal.close());

apiModel
	.getProductList()
	.then(function(data: IProductItem[]) {
		// успешный ответ от сервера
		productModel.products = data; // запись в productModel
	})
	.catch((error) => console.log(error)); // сообщили об ошибке в консоль
