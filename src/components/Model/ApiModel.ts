import { ApiListResponse, Api } from '../base/api'
import { IOrderLot, IOrderResult, IProductItem } from '../../types';

export class ApiModel extends Api {
  cdn: string;
  items: IProductItem[];

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);

    this.cdn = cdn;
  }

  // получаем массив продуктов
  getProductList(): Promise<IProductItem[]> {
    return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image,
      }))
    );
  }

  // отправляем на серевер заказ
  postOrderLot(order: IOrderLot): Promise<IOrderResult> {
    return this.post(`/order`, order).then((data: IOrderResult) => data);
  }
}
