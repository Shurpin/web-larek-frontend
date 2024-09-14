import { IProductItem } from "../../types";

export interface IBasketModel {
  basketProducts: IProductItem[];
  getSumAllProducts: () => number;
  addBasketItem(data: IProductItem): void;
  deleteCardToBasket(item: IProductItem): void;
  clearBasketProducts(): void
}

export class BasketModel implements IBasketModel {
  protected _basketProducts: IProductItem[];

  constructor() {
    this._basketProducts = [];
  }

  set basketProducts(data: IProductItem[]) {
    this._basketProducts = data;
  }

  get basketProducts() {
    return this._basketProducts;
  }

  // сумма всех товаров в корзине
  getSumAllProducts() {
    let sumAll = 0;
    this._basketProducts.forEach(item => {
      sumAll = sumAll + item.price;
    });
    return sumAll;
  }

  // добавить карточку товара в корзину
  addBasketItem(data: IProductItem) {
    this._basketProducts.push(data);
  }

  // удалить карточку товара из корзины
  deleteCardToBasket(item: IProductItem) {
    const index = this._basketProducts.indexOf(item);

    if (index >= 0) {
      this._basketProducts.splice(index, 1);
    }
  }

  clearBasketProducts() {
    this._basketProducts = []
  }
}
