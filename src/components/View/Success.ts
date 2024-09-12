import { IEvents } from "../base/events";
import { Component } from '../base/Component';

export interface ISuccess {
  success: HTMLElement;
  description: HTMLElement;
  button: HTMLButtonElement;
  render(total: number): HTMLElement;
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

  render(data?: Partial<ISuccess> & Record<string, unknown>): HTMLElement {
    if (data && 'total' in data) {
      this.setText(this.description, `Списано ${data.total} синапсов`);
    }
    return super.render(data);
  }
}
