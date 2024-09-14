import { IAction, IProductItem } from "../../types";
import { Component } from "../base/Component";

const CardColors: Record<string, string> = {
  "дополнительное": "additional",
  "софт-скил": "soft",
  "кнопка": "button",
  "хард-скил": "hard",
  "другое": "other",
}

export class Card extends Component<IProductItem> {
  protected _cardCategory: HTMLElement;
  protected _cardTitle: HTMLElement;
  protected _cardImage: HTMLImageElement;
  protected _cardPrice: HTMLElement;
  protected _colors = CardColors;

  constructor(container: HTMLElement, onClickAction?: IAction) {
      super(container);

      this._cardCategory = this.getElement('.card__category');
      this._cardTitle = this.getElement('.card__category');
      this._cardImage = this.getElement('.card__image') as HTMLImageElement;
      this._cardPrice = this.getElement('.card__price');

      if (onClickAction) {
          container.addEventListener('click', onClickAction);
      }
  }

  set cardCategory(value: string) {
      this.setText(this._cardCategory, value);
      this.setClassName(this._cardCategory, `card__category card__category_${this._colors[value]}`);
  }

  protected setPrice(value: number | null): string {
    if (value === null) {
      return 'Бесценно'
    }
    return String(value) + ' синапсов'
  }

render(data?: Partial<IProductItem>): HTMLElement {
  if (data) {
    this.setText(this._cardCategory, data.category);
    this.setText(this._cardTitle, data.title);
    this.setImage(this._cardImage, data.image, data.title);
    this.setText(this._cardPrice, this.setPrice(data.price));
    this.cardCategory = data.category;
  }
  return super.render(data);
}
}
