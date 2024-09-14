import { createElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from '../base/Component';

export interface IBasket {
  container: HTMLElement;
  title: HTMLElement;
  basketList: HTMLElement;
  button: HTMLButtonElement;
  basketPrice: HTMLElement;
  headerBasketCounter: HTMLElement;
  setSumAllProducts(sumAll: number): void;
  render(): HTMLElement;
}

export class Basket extends Component<IBasket>{
  title: HTMLElement;
  basketList: HTMLElement;
  button: HTMLElement;
  basketPrice: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)

    this.basketList = this.getElement('.basket__list');
    this.title = this.getElement('.modal__title');
    this.button = this.getElement('.basket__button');
    this.basketPrice = this.getElement('.basket__price');

    this.button.addEventListener('click', () => {
      this.events.emit('order:open');
    });
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this.replaceChildren(this.basketList, items);
      this.setDisabled(this.button as HTMLButtonElement, false);
    } else {
      this.setDisabled(this.button as HTMLButtonElement, true);
      this.replaceChildren(this.basketList, [createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' })]);
    }
  }

  setSumAllProducts(value: number) {
    this.setText(this.basketPrice, String(value + ' синапсов'))
  }

 // Вернуть корневой DOM-элемент
 render(): HTMLElement {
  super.render({});
  this.setText(this.title, 'Корзина');

  return this.container;
}
}
