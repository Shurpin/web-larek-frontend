import { IAction, IProductItem } from "../../types";
import { Component } from "../base/Component";

export interface IBasketItem {
	basketItemContainer: HTMLElement;
	index: HTMLElement;
	title: HTMLElement;
	price: HTMLElement;
	buttonDelete: HTMLButtonElement;
	renderBasketItem (data: IProductItem, item: number): HTMLElement;
	data: IProductItem;
}

export class BasketItem extends Component<IBasketItem> {
  private index: HTMLElement;
  private title: HTMLElement;
  private price: HTMLElement;
  private buttonDelete: HTMLButtonElement;

  constructor (basketItemContainer: HTMLTemplateElement, onClickAction?: IAction) {
		super(basketItemContainer)

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

  render(data: { data: IProductItem, itemIndex: number }): HTMLElement {
    this.setText(this.price, this.setPrice(data.data.price));
    this.setText(this.index, String(data.itemIndex + 1));
    this.setText(this.title, data.data.title);

    return super.render(data);
  }
}
