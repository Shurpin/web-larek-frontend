import { IEvents } from "../base/events";
import { Form } from '../base/Form';

export interface IContacts {
  email: string;
  phone: string;
}

export class Contacts extends Form<IContacts>{
  formContacts: HTMLFormElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container, events)

    this.formContacts = container;
  }
  set email(value: string) {
    (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
  }

  set phone(value: string) {
    (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
  }
}
