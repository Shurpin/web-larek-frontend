import { IEvents } from "../base/events";
import { Component } from '../base/Component';

export interface ISuccess {
  success: HTMLElement;
  description: HTMLElement;
  button: HTMLButtonElement;
  renderSuccess(total: number): HTMLElement;
}

export class Success extends Component<ISuccess> {
  success: HTMLElement;
  description: HTMLElement;
  button: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    super(template);

    this.success = template.content.querySelector('.order-success').cloneNode(true) as HTMLElement;
    this.description = this.success.querySelector('.order-success__description');
    this.button = this.success.querySelector('.order-success__close');

    this.button.addEventListener('click', () => {
      events.emit('success:close');
    });
  }

  renderSuccess(total: number) {
    this.setText(this.description, String(`Списано ${total} синапсов`))

    return this.success
  }
}
