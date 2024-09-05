import './scss/styles.scss';
import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ApiModel } from './components/Model/ApiModel';
import { ProductModel } from './components/Model/ProductModel';
import { Card } from './components/View/Card';
import { CardPreviewModal } from './components/View/CardPreviewModal';
import { IOrderForm, IProductItem } from './types';
import { Modal } from './components/View/Modal';
import { ensureElement } from './utils/utils';
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
const formOrder = new FormOrder(orderTemplate, events);
const formModel = new FormModel(events);
const contacts = new Contacts(contactsTemplate, events);

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

// Отображения карточек товара после обновления списка продуктов
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

// // Удаление товара из корзины
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
	modal.content = formOrder.render();
	modal.render();

	formModel.items = basketModel.basketProducts.filter((product: IProductItem) => product.price).map((product: IProductItem) => product.id);
});

events.on('form-order:paymentType', (button: HTMLButtonElement) => {
	formModel.payment = button.name;
});

// Отслеживаем изменение в поле ввода адреса доставки"
events.on(`order:changeAddress`, (data: { field: string; value: string }) => {
	formModel.setOrderAddress(data.field, data.value);
});

// Валидация данных "address" и payment
events.on('formErrors:address', (errors: Partial<IOrderForm>) => {
	const { address, payment } = errors;

	formOrder.valid = !address && !payment;
	formOrder.formErrors.textContent = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
});

// Открытие модального окна Email и Телефон
events.on('contacts:open', () => {
	formModel.total = basketModel.getSumAllProducts();
	modal.content = contacts.render();
	modal.render();
});

// Отслеживаем изменение в полях вода Email и Телефон
events.on(`contacts:changeInput`, (data: { field: string; value: string }) => {
	formModel.setOrderData(data.field, data.value);
});

// Валидация данных Email и Телефон
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.formErrors.textContent = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

events.on('success:open', () => {
	apiModel
		.postOrderLot(formModel.getOrderLot())
		.then(() => {
			basketModel.clearBasketProducts();
			basket.renderHeaderBasketCounter(basketModel.getCounter());
			events.emit('basket:change');

			const success = new Success(successTemplate, events);
			modal.content = success.render(basketModel.getSumAllProducts());
			modal.render();
		})
		.catch((error) => console.log(error));
});

events.on('success:close', () => modal.close());

apiModel
	.getProductList()
	.then(function (data: IProductItem[]) {
		// успешный ответ от сервера
		productModel.products = data; // запись в productModel
	})
	.catch((error) => console.log(error)); // сообщили об ошибке в консоль
