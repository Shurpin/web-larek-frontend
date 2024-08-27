import { Card } from "./Card";
import { IAction, IProductItem } from '../../types';
import { IEvents } from "../base/events";

export interface ICard {
  text: HTMLElement;
  button: HTMLElement;
  render(data: IProductItem): HTMLElement;
}

export class CardPreviewModal extends Card implements ICard {
  text: HTMLElement;
  button: HTMLButtonElement;
  basketProducts: IProductItem[];

  constructor(template: HTMLTemplateElement, protected events: IEvents, basketProducts: IProductItem[]) {
    super(template);

    this.basketProducts = basketProducts;
    this.text = this._cardElement.querySelector('.card__text');
    this.button = this._cardElement.querySelector('.card__button');


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
      this.button.setAttribute('disabled', 'true')

      return 'Не продается'
    }
  }

  render(data: IProductItem): HTMLElement {
    const isInBasket = this.basketProducts.some((productItem: IProductItem) => productItem.id === data.id);

    this._cardCategory.textContent = data.category;
    this.cardCategory = data.category;
    this._cardTitle.textContent = data.title;
    this._cardImage.src = data.image;
    this._cardImage.alt = this._cardTitle.textContent;
    this._cardPrice.textContent = this.setPrice(data.price);
    this.text.textContent = data.description;
    this.button.textContent = this.notSale(data, isInBasket);
    this.button.disabled = isInBasket;

    return this._cardElement;
  }
}
