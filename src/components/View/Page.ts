import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";


interface IPage {
    counter: number;
    locked: boolean;
    wrapper: HTMLElement;
}

export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;


    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._counter = this.getElement('.header__basket-counter');
        this._wrapper = this.getElement('.page__wrapper');
        this._basket = this.getElement('.header__basket');
    
        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    set locked(value: boolean) {
        if (value) {
            this.addClass(this._wrapper, 'page__wrapper_locked');
        } else {
            this.removeClass(this._wrapper, 'page__wrapper_locked');
        }
    }
}