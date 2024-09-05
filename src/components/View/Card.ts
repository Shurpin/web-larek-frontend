import { IAction, IProductItem } from "../../types";
import { Component } from "../base/Component";


export interface ICard {
  renderCard(data: IProductItem): HTMLElement;
}

const CardColors: Record<string, string> = {
  "дополнительное": "additional",
  "софт-скил": "soft",
  "кнопка": "button",
  "хард-скил": "hard",
  "другое": "other",
}

export class Card extends Component<ICard> {
  protected _cardElement: HTMLElement;
  protected _cardCategory: HTMLElement;
  protected _cardTitle: HTMLElement;
  protected _cardImage: HTMLImageElement;
  protected _cardPrice: HTMLElement;
  protected _colors = CardColors

  constructor(template: HTMLTemplateElement, onClickAction?: IAction) {
    super(template)

    this._cardElement = template.content.querySelector('.card').cloneNode(true) as HTMLElement;
    this._cardCategory = this._cardElement.querySelector('.card__category');
    this._cardTitle = this._cardElement.querySelector('.card__title');
    this._cardImage = this._cardElement.querySelector('.card__image');
    this._cardPrice = this._cardElement.querySelector('.card__price');

    if (onClickAction) {
      this._cardElement.addEventListener('click', onClickAction);
    }
  }

  // protected setText(element: HTMLElement, value: unknown): string {
  //   if (element) {
  //     return element.textContent = String(value);
  //   }
  // }

  set cardCategory(value: string) {
    this.setText(this._cardCategory, value);
    this._cardCategory.className = `card__category card__category_${this._colors[value]}`
  }

  protected setPrice(value: number | null): string { // !!!!!!!!!!!!!!!!!!!
    if (value === null) {
      return 'Бесценно'
    }
    return String(value) + ' синапсов'
  }

  renderCard(productItem: IProductItem): HTMLElement {
    // this._cardCategory.textContent = productItem.category;
    // this._cardTitle.textContent = productItem.title;
    this.setText(this._cardCategory, productItem.category);
    this.setText(this._cardTitle, productItem.title);
    this.cardCategory = productItem.category;
    this._cardImage.src = productItem.image;
    this._cardImage.alt = this._cardTitle.textContent;
    this._cardPrice.textContent = this.setPrice(productItem.price); // !!!!!!!!!!!!!!!!!!!

    return this._cardElement;
  }
}
