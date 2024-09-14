import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected _closeButton: HTMLElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)

    this._closeButton = this.getElement('.modal__close');
    this._content = this.getElement('.modal__content');

    this._closeButton.addEventListener('click', this.close.bind(this));
    container.addEventListener('click', this.close.bind(this));
    container.querySelector('.modal__container').addEventListener('click', event => event.stopPropagation());
  }

  set content(contentElement: HTMLElement) {
    this.replaceChildren(this._content, [contentElement])
  }

  open() {
    this.toggleClass(this.container, 'modal_active', true)
    this.events.emit('modal:open');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.content = null;
    this.events.emit('modal:close');
  }

  render(data: IModal): HTMLElement {
    super.render(data);
    this.open();

    return this.container;
  }
}
