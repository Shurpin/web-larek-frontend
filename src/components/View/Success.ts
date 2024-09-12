import { IEvents } from "../base/events";
import { Component } from '../base/Component';

export interface ISuccess {
  success: HTMLElement;
  description: HTMLElement;
  button: HTMLButtonElement;
  renderSuccess(total: number): HTMLElement;
}

export class Success extends Component<ISuccess> {
  SuccessContainer: HTMLElement;
  description: HTMLElement;
  button: HTMLButtonElement;

  constructor(SuccessContainer: HTMLTemplateElement, protected events: IEvents) {
    super(SuccessContainer);

    this.SuccessContainer = SuccessContainer;
    this.description = SuccessContainer.querySelector('.order-success__description');
    this.button = SuccessContainer.querySelector('.order-success__close');

    this.button.addEventListener('click', () => {
      events.emit('success:close');
    });
  }

  renderSuccess(total: number) {
    this.setText(this.description, String(`Списано ${total} синапсов`))

    return this.SuccessContainer
  }
}
