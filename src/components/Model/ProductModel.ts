import { IProductItem } from "../../types";
import { IEvents } from "../base/events";

export interface IProductModel {
  products: IProductItem[];
  selectedProduct: IProductItem;

  setSelectedCard(item: IProductItem): void;
}

export class ProductModel implements IProductModel {
  protected _products: IProductItem[];
  selectedProduct: IProductItem;

  constructor(protected events: IEvents) {
    this._products = []
  }

  set products(data: IProductItem[]) {
    // записали данные
    this._products = data;
    // сделали подписку на событие
    this.events.emit('products:update');
  }

  // получаем список продуктов
  get products() {
    return this._products;
  }

  setSelectedCard(item: IProductItem) {
    this.selectedProduct = item;

    this.events.emit('modalCard:open', item)
  }
}
