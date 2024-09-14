/**
 * Базовый компонент
 */
export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {
        this.container = container;
        // Учитывайте что код в конструкторе исполняется ДО всех объявлений в дочернем классе
    }

    // Инструментарий для работы с DOM в дочерних компонентах
    protected getElement(selector: string): HTMLElement {
        const element = this.container.querySelector(selector);
        if (element instanceof HTMLElement) {
          return element;
        }
        throw new Error(`Element with selector "${selector}" not found.`);
      }

    // Переключить класс
    protected toggleClass(element: HTMLElement, className: string, force?: boolean) {
        element.classList.toggle(className, force);
    }
    // Добовляем класс запрета прокрутки 
    protected addClass(element: HTMLElement, className: string) {
        element.classList.add(className);
    }
  // Удаляем класс запрета прокрутки 
  protected removeClass(element: HTMLElement, className: string) {
        element.classList.remove(className);
}

    // Установить текстовое содержимое
    protected setText(element: HTMLElement, value?: string | number) {
        if (element) {
            element.textContent = String(value);
        }
    }

    protected setClassName(element: HTMLElement, value: string) {
        if (element) {
            element.className = String(value);
        }
    }

    // Сменить статус блокировки для кнопки
    protected setDisabled(element: HTMLButtonElement, isDisabled: boolean) {
        element.disabled = isDisabled;
    }
    
    // Установить изображение с алтернативным текстом
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }
    protected replaceChildren(element: HTMLElement, elements: HTMLElement[]) {
        element.replaceChildren(...elements);
    }

    // Вернуть корневой DOM-элемент
    render(data?: Partial<T> & Record<string, unknown>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}
