interface IProduct {
  id: string; // "854cef69-976d-4c2a-a18c-2aa45046c390",
  description: string; // "Если планируете решать задачи в тренажёре, берите два.",
  image: string; // "/5_Dots.svg",
  title: string; // "+1 час в сутках",
  category: string; // "софт-скил",
  price: number | null; // 750
}

interface IProducts {
  total: number; // 10
  items: IProduct[];
}

interface IErrorResponse {
  error: string;
}

enum OrderPayment { // 'online' | 'cash',
  ONLINE = 'online',
  CASH = 'cash',
}

interface IOrderResponse {
  id: string; // "28c57cb4-3002-4445-8aa1-2a06a5055ae5",
  total: number; // 2200
}

interface IOrderPayload {
  payment: OrderPayment; // 'online' | 'cash',
  email: string; // "test@test.ru",
  phone: string; // "+71234567890",
  address: string; // "Spb Vosstania 1",
  total: number; // 2200,
  items: string[];
}

export interface IMethods {
  getProducts: () => Promise<IProducts>;
  getProduct: (id: string) => Promise<IProduct | IErrorResponse>;
  submitBasket: (payload: IOrderPayload) => Promise<IOrderResponse | IErrorResponse>;
}
