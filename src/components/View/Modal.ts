import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export interface IModal {
  open(): void;
  close(): void;
  render(): HTMLElement
}

export class Modal extends Component <IModal> {
  protected container: HTMLElement;
  protected closeButton: HTMLButtonElement;
  protected _content: HTMLElement;
  protected modalScroll: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)

    this.container = container;
    this.closeButton = this.getElement('.modal__close') as HTMLButtonElement;
    this._content = this.getElement('.modal__content');

    this.closeButton.addEventListener('click', this.close.bind(this));
    container.addEventListener('click', this.close.bind(this));
    container.querySelector('.modal__container').addEventListener('click', event => event.stopPropagation());
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open() {
    this.container.classList.add('modal_active'); 
    this.events.emit('modal:open');

  }

  close() {
    this.container.classList.remove('modal_active');
    this.content = null;
    this.events.emit('modal:close');
  }

  render(): HTMLElement {
    this.open();
    return super.render({});
  }
}
