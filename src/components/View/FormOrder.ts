import { IEvents } from "../base/events";
import { Form } from '../base/Form';
import { IInputChangeData } from '../../types';

export interface IOrder {
  address: string;
  formOrder: HTMLFormElement;
  buttonAll: HTMLButtonElement[];
}

export class FormOrder extends Form<IOrder> {
  buttonAll: HTMLButtonElement[];

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container, events)

    this.buttonAll = Array.from(this.container.querySelectorAll('.button_alt'));

    this.buttonAll.forEach((item: HTMLButtonElement) => {
      item.addEventListener('click', (event) => {
        const clickButton = event.target as HTMLButtonElement;

        this.buttonAll.forEach((domButton: HTMLButtonElement) => {
            this.toggleClass(domButton, 'button_alt-active', domButton.name === clickButton.name);
        })

        events.emit('order.paymentType:change', { value: item.name , field: 'paymentType' } as IInputChangeData);
      });
    });
  }
  set phone(value: string) {
    (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
}

  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }
}
