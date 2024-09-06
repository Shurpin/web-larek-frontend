import { IAction, IProductItem } from "../../types";
import { Component } from "../base/Component";

export interface IBasketItem {
  basketItem: HTMLElement;
	index:HTMLElement;
	title: HTMLElement;
	price: HTMLElement;
	buttonDelete: HTMLButtonElement;
	renderBasketItem(data: IProductItem, item: number): HTMLElement;
}

export class BasketItem extends Component<IBasketItem> {
  basketItem: HTMLElement;
	index:HTMLElement;
	title: HTMLElement;
	price: HTMLElement;
	buttonDelete: HTMLButtonElement;

  constructor (template: HTMLTemplateElement, onClickAction?: IAction) {
		super(template)

    this.basketItem = template.content.querySelector('.basket__item').cloneNode(true) as HTMLElement;
		this.index = this.basketItem.querySelector('.basket__item-index');
		this.title = this.basketItem.querySelector('.card__title');
		this.price = this.basketItem.querySelector('.card__price');
		this.buttonDelete = this.basketItem.querySelector('.basket__item-delete');

		if (onClickAction) {
			this.buttonDelete.addEventListener('click', onClickAction);
		}
  }

	protected setPrice(value: number | null): string {
    if (value === null) {
      return 'Бесценно'
    }
    return String(value) + ' синапсов'
  }

	renderBasketItem({ data, index }: { data: IProductItem; index: number; }) {
	  this.setText(this.price, this.setPrice(data.price));
	  this.setText(this.index, String(index + 1));
	  this.setText(this.title, data.title);

		return this.basketItem;
	}
}
