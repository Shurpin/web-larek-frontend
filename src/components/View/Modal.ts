import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export interface IModal {
  open(): void;
  close(): void;
  render(): HTMLElement
}

export class Modal extends Component <IModal> {
  protected modalContainer: HTMLElement;
  protected closeButton: HTMLButtonElement;
  protected _content: HTMLElement;
  protected modalScroll: HTMLElement;

  constructor(modalContainer: HTMLElement, protected events: IEvents) {
    super(modalContainer)

    this.modalContainer = modalContainer;
    this.closeButton = modalContainer.querySelector('.modal__close');
    this._content = modalContainer.querySelector('.modal__content');

    this.closeButton.addEventListener('click', this.close.bind(this));
    modalContainer.addEventListener('click', this.close.bind(this));
    modalContainer.querySelector('.modal__container').addEventListener('click', event => event.stopPropagation());
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open() {
    this.modalContainer.classList.add('modal_active'); 
    this.events.emit('modal:open');

  }

  close() {
    this.modalContainer.classList.remove('modal_active');
    this.content = null;
    this.events.emit('modal:close');
  }

  render(): HTMLElement {
    this.open();
    return super.render({});
  }
}
