// Типы данных
type ProductCategory = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хфрд-скил';

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: ProductCategory;
  price: number | null;
}

 type OrderPayment = 'online' | 'cash';
 
export interface IOrder {
  payment: OrderPayment;
  email: string;
  phone: string;
  address: string;
  total: number; 
  items: IProduct;
}

// Отображение прподукта на главной странице 
type TProduct = Omit<IProduct, "description">;
// Отображение прподукта в корзине
type TBasketProduct = Pick<IProduct, "id" | "title" | "price">;

export interface IOrderResult {
  id: string;
  total: number; 
}

export interface WebLarekApi {
  getProducts: () => Promise<IProduct[]>;
  getProductById: (id: string) => Promise<IProduct>;
  orderProducts: (data: IOrder) => Promise<IOrderResult>;
}

// export interface IToDoList {
//    addItem(item: IToDoItem): void;
//    editItem(id:number, data: Partial<IToDoItem>): void; //для редактирования дела
//    checkItem(id: number): void; //проверили дело выполнено или нет
//    deleteItem(id: number): void;
//    setItems(items: IToDoItem[]): void; // загрузить масив дел
//    getItem(id: number): IToDoItem; //получать по id одну карточку
//    getItems(): IToDoItem[]; //получать по id все карточки
//    getTotal(): number; //количество всех 
//    getDone():number; // количество выполненных 
// }
