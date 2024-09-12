import { Card } from "./Card";
import { IProductItem } from '../../types';
import { IEvents } from "../base/events";

export class CardPreviewModal extends Card {
  private text: HTMLElement;
  private button: HTMLButtonElement;
  private basketProducts: IProductItem[];

  constructor(container: HTMLTemplateElement, protected events: IEvents, basketProducts: IProductItem[]) {
    super(container); // Вызываем конструктор родительского класса

    this.basketProducts = basketProducts;
    this.text = container.querySelector('.card__text');
    this.button = container.querySelector('.card__button');

    this.button.addEventListener('click', () => {
      this.events.emit('product:addBasket');
    });
  }

  notSale(data: IProductItem, isInBasket: boolean) {
    if (isInBasket) {
      return 'В корзине';
    }
    if (data.price) {
      return 'Купить';
    }
    return 'Не продается';
  }

render(data: IProductItem): HTMLElement {
    const isInBasket = this.basketProducts.some((productItem) => productItem.id === data.id);

    this.setText(this._cardCategory, data.category);
    this.setText(this._cardTitle, data.title);
    this.setText(this.text, data.description);
    this.setImage(this._cardImage, data.image, data.title);
    this.setText(this._cardPrice, this.setPrice(data.price));
    this.setText(this.button, this.notSale(data, isInBasket));
    this.setDisabled(this.button, isInBasket || data.price === null);
    this.cardCategory = data.category;

    return super.render(data);
  }
}
