import { IAction, IProductItem } from "../../types";
import { Component } from "../base/Component";

export interface IBasketItem {
	container: HTMLElement;
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

  constructor (container: HTMLTemplateElement, onClickAction?: IAction) {
		super(container)

    this.index = this.getElement('.basket__item-index');
    this.title = this.getElement('.card__title');
    this.price = this.getElement('.card__price');
    this.buttonDelete = this.getElement('.basket__item-delete') as HTMLButtonElement;

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
		super.render(data);
    this.setText(this.price, this.setPrice(data.data.price));
    this.setText(this.index, String(data.itemIndex + 1));
    this.setText(this.title, data.data.title);

		return this.container;
  }
}
