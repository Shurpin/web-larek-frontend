import { IAction, IProductItem } from "../../types";
import { Component } from "../base/Component";

export interface IBasketItem {
  basketItemContainer: HTMLElement;
	index:HTMLElement;
	title: HTMLElement;
	price: HTMLElement;
	buttonDelete: HTMLButtonElement;
	renderBasketItem(data: IProductItem, item: number): HTMLElement;
}

export class BasketItem extends Component<IBasketItem> {
  protected basketItemContainer: HTMLElement;
	index:HTMLElement;
	title: HTMLElement;
	price: HTMLElement;
	buttonDelete: HTMLButtonElement;

  constructor (basketItemContainer: HTMLTemplateElement, onClickAction?: IAction) {
		super(basketItemContainer)

    this.basketItemContainer = basketItemContainer;
		this.index = basketItemContainer.querySelector('.basket__item-index');
		this.title = basketItemContainer.querySelector('.card__title');
		this.price = basketItemContainer.querySelector('.card__price');
		this.buttonDelete = basketItemContainer.querySelector('.basket__item-delete');

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

		return this.basketItemContainer;
	}
}
