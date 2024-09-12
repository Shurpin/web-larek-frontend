import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";


interface IPage {
    headerBasketCounter: number;
    locked: boolean;
    wrapper: HTMLElement;
}

export class Page extends Component<IPage> {
    protected headerBasketCounter: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;


    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.headerBasketCounter = ensureElement<HTMLElement>('.header__basket-counter');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLElement>('.header__basket');
    
        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.setText(this.headerBasketCounter, String(value));
    }

    set locked(value: boolean) {
        if (value) {
            this.addClass(this._wrapper, 'page__wrapper_locked');
        } else {
            this.removeClass(this._wrapper, 'page__wrapper_locked');
        }
    }
}