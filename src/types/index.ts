export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IOrderForm {
	payment?: string;
	address?: string;
	phone?: string;
	email?: string;
	total?: number;
	items: string[];
}

export type IAction = (event: MouseEvent) => void; // Обработчик клика

export interface IOrderLot {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export interface IOrderResult {
	id: string;
	total: number;
}

export type FormErrors = { [key: string]: string | undefined };

export interface IInputChangeData {
	field: string;
	value: string;
}
