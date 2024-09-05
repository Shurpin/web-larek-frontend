import { IEvents } from "../base/events";
import { Component } from '../base/Component';

export interface IOrder {
  formOrder: HTMLFormElement;
  buttonAll: HTMLButtonElement[];
  paymentSelection: string;
  formErrors: HTMLElement;
  render(): HTMLElement;
}

export class FormOrder extends Component<IOrder> {
  formOrder: HTMLFormElement;
  buttonAll: HTMLButtonElement[];
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    super(template)

    this.formOrder = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
    this.buttonAll = Array.from(this.formOrder.querySelectorAll('.button_alt'));
    this.buttonSubmit = this.formOrder.querySelector('.order__button');
    this.formErrors = this.formOrder.querySelector('.form__errors');

    this.buttonAll.forEach((item: HTMLButtonElement) => {
      item.addEventListener('click', (event) => {
        const clickButton = event.target as HTMLButtonElement;

        this.buttonAll.forEach((domButton: HTMLButtonElement) => {
            this.toggleClass(domButton, 'button_alt-active', domButton.name === clickButton.name);
        })

        events.emit('form-order:paymentType', clickButton);
      });
    });

    this.formOrder.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const field = target.name;
      const value = target.value;
      this.events.emit(`order:changeAddress`, { field, value });
    });

    this.formOrder.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit('contacts:open');
    });
  }

  set valid(isValid: boolean) {
    this.setDisabled(this.buttonSubmit, !isValid)
  }

  render() {
    return this.formOrder
  }
}
