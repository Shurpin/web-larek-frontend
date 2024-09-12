/**
 * Базовый компонент
 */
export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {
        // Учитывайте что код в конструкторе исполняется ДО всех объявлений в дочернем классе
    }

    // Инструментарий для работы с DOM в дочерних компонентах

    // Переключить класс
    toggleClass(element: HTMLElement, className: string, force?: boolean) {
        element.classList.toggle(className, force);
    }
    // Добовляем класс запрета прокрутки 
    addClass(element: HTMLElement, className: string) {
        element.classList.add(className);
    }
  // Удаляем класс запрета прокрутки 
    removeClass(element: HTMLElement, className: string) {
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
    setDisabled(element: HTMLButtonElement, isDisabled: boolean) {
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
    replaceChildren(element: HTMLElement, elements: HTMLElement[]) {
        element.replaceChildren(...elements);
    }

    // Вернуть корневой DOM-элемент
    render(data?: Partial<T> & Record<string, unknown>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}
