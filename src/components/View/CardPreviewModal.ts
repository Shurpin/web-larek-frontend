import { Card } from "./Card";
import { IProductItem } from '../../types';
import { IEvents } from "../base/events";

export interface ICard {
  text: HTMLElement;
  button: HTMLElement;
  renderCard(data: IProductItem): HTMLElement;
}

export class CardPreviewModal extends Card implements ICard {
  text: HTMLElement;
  button: HTMLButtonElement;
  basketProducts: IProductItem[];

  constructor(container: HTMLTemplateElement, protected events: IEvents, basketProducts: IProductItem[]) {
    super(container);

    this.basketProducts = basketProducts;
    this.text = this.cardElementContainer.querySelector('.card__text');
    this.button = this.cardElementContainer.querySelector('.card__button');


    this.button.addEventListener('click', () => {
      this.events.emit('product:addBasket')
    });
  }

  notSale(data:IProductItem, isInBasket: boolean) {
    if(isInBasket) {
      return 'В корзине'
    }
    if(data.price) {
      return 'Купить'
    } else {
      return 'Не продается'
    }
  }

  renderCard(data: IProductItem): HTMLElement {
    const isInBasket = this.basketProducts.some((productItem: IProductItem) => productItem.id === data.id);

    this.setText(this._cardCategory, data.category);
    this.setText(this._cardTitle, data.title);
    this.setText(this.text, data.description);
    this.setImage(this._cardImage, data.image, this._cardTitle.textContent)
    this.setText(this._cardPrice, this.setPrice(data.price));
    this.setText(this.button, this.notSale(data, isInBasket));
    this.setDisabled(this.button, isInBasket || data.price === null);
    this.cardCategory = data.category;

    return this.cardElementContainer;
  }
}
