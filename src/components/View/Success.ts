import { IEvents } from "../base/events";
import { Component } from '../base/Component';

export interface ISuccess {
  success: HTMLElement;
  description: HTMLElement;
  button: HTMLButtonElement;
  render(total: number): HTMLElement;
}

export class Success extends Component<ISuccess> {
  container: HTMLElement;
  description: HTMLElement;
  button: HTMLButtonElement;

  constructor(container: HTMLTemplateElement, protected events: IEvents) {
    super(container);

    this.container = container;

    this.description = this.getElement('.order-success__description');
    this.button = this.getElement('.order-success__close') as HTMLButtonElement;

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
