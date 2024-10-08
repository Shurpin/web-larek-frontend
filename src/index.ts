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
import { FormModel, IFormModel } from './components/Model/FormModel';
import { FormOrder } from './components/View/FormOrder';
import { Contacts } from './components/View/FormContacts';
import { Success } from './components/View/Success';
import { Page } from './components/View/Page';

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewModalTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const apiModel = new ApiModel(CDN_URL, API_URL);
const events = new EventEmitter();
const productModel = new ProductModel(events);

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const basketModel = new BasketModel();
const page = new Page(document.body, events);
const formOrder = new FormOrder(cloneTemplate(orderTemplate), events);
const formContacts = new Contacts(cloneTemplate(contactsTemplate), events);
const formModel = new FormModel(events);
const success = new Success(cloneTemplate(successTemplate), events);
const cardModal = new CardPreviewModal(cloneTemplate(cardPreviewModalTemplate), events, basketModel.basketProducts);

// Отображение карточек товара после обновления списка продуктов
events.on('products:update', () => {
	// Забираем данные из модели, которые ранее взяли из API
	productModel.products.forEach((productItem: IProductItem) => {
			const card = new Card(cloneTemplate(cardCatalogTemplate), () => events.emit('card:onClick', productItem));

			ensureElement<HTMLElement>('.gallery').append(card.render(productItem)); // Обновленный вызов
	});
});

// Получить объект данных "IProductItem" карточки по которой кликнули
events.on('card:onClick', (item: IProductItem) => {
	productModel.setSelectedCard(item);
});

// Открываем модальное окно товара *
events.on('modalCard:open', (item: IProductItem) => {
	modal.render({
		content: cardModal.render(item),
	});
});

// Открытие модального окна корзины
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

// Добавление товара в корзину
events.on('product:addBasketItem', (currentProductItem: IProductItem) => {
	// добавляем элемент в память
	basketModel.addBasketItem(currentProductItem);
	// обновляем содержимое на экране
	events.emit('basket:change');
	// закрываем окно карточки
	modal.close();
});

// Удаление товара из корзины
events.on('product:removeBasketItem', (removeItem: IProductItem) => {
	// убираем элемент из памяти
	basketModel.deleteCardToBasket(removeItem);
	// обновляем содержимое на экране
	events.emit('basket:change');
});

// обновляем содержимое на экране
events.on('basket:change', () => {
	// меняем отображение счетчика в корзине
	page.counter = basketModel.basketProducts.length;
	// обновляем список элементов корзины
	basket.items = basketModel.basketProducts.map((item, itemIndex) => {
			const basketItem = new BasketItem(cloneTemplate(cardBasketTemplate), () => {
					events.emit('product:removeBasketItem', item);
			});

			return basketItem.render({ data: item, itemIndex });
	});
	let sumValue = 0;
	basketModel.basketProducts.forEach((basketItem: IProductItem) => {
		sumValue = sumValue + basketItem.price;
	})
	basket.setSumAllProducts(sumValue);
});

// Открытие модального окна "способа оплаты" и "адреса доставки"
events.on('order:open', () => {
	modal.render({
		content: formOrder.render({
			address: '',
			valid: false,
			errors: [],
		})
	});
});

// выбираем тип оплаты
events.on('order.paymentType:change', (data: IInputChangeData) => {
	formModel.setOrderPaymentType(data.value);
});

// вводим адрес
events.on(`order.address:change`, (data: IInputChangeData) => {
	formModel.setOrderAddress(data.value);
});

events.on('order:submit', () => {
	modal.render({
		content: formContacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		})
	});
});

// выбираем тип оплаты
events.on('contacts.email:change', (data: IInputChangeData) => {
	formModel.setOrderEmail(data.value);
});

// вводим адрес
events.on('contacts.phone:change', (data: IInputChangeData) => {
	formModel.setOrderPhone(data.value);
});

// выводит ошибки
events.on('formErrors:change', (errors: Partial<IFormModel>) => {
	const { paymentType, address, email, phone } = errors;
	formOrder.valid = !paymentType && !address;
	formContacts.valid = !email && !phone;
	formOrder.errors = Object.values({paymentType, address}).filter(i => !!i).join('; ');
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
			events.emit('basket:change');

   		// Передаем total в метод render
			 modal.render({
				 content: success.render({ total: data.total })
			 });
		})
		.catch((error) => console.log(error));
});

events.on('success:close', () => {
	modal.close()
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

apiModel
	.getProductList()
	.then(function(data: IProductItem[]) {
		// успешный ответ от сервера
		productModel.products = data; // запись в productModel
	})
	.catch((error) => console.log(error)); // сообщили об ошибке в консоль


