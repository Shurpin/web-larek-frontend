# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание данных

### Интерфейс карточки товара:

```
interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}
```

### Интерфейс заказа:

```
interface IOrderLot {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}
```

### Интерфейс ответа от сервера после успешной отправки заказа:

```
interface IOrderResult {
	id: string;
	total: number;
}
```

### Интерфейс ошибки:

```
type FormErrors = { [key: string]: string | undefined };
```

### Действия пользователя
 Обработчик клика 
 
```
type IAction (event: MouseEvent) => void;
``` 

## События, возникающие при взаимодействии пользователя с интерфейсом.
- `card:onClick` - выбор карточки для отображения в модальном окне
- `product:addBasket` - выбор карточки для добавления в корзину
- `product:removeBasket` - выбор карточки для удаления из корзины
- `products:update` - отображение карточек после обновления списка продуктов
- `modalCard:open` - открытие модального окна товара
- `basket:open` - открытие модального окна корзины
- `product:addBasket` - добавление карточки в корзину
- `product:removeBasket` - удаление карточки из корзины
- `order:open` - открытие модального окна "способ оплаты" и "адрес доставки"
- `order.paymentType:change` - Выбор типа оплаты
- `order.address:change` - вводим адрес
- `order:submit` - сохранение данных о способе оплаты и адресе доставки
- `contacts.email:change` - вводим адрес email
- `contacts.phone:change` - вводим адрес номер телефона
- `contacts:submit` - сохранение информации о способе оплаты и адресе доставки
- `modal:open` - при открытие модального окна запрещаем scroll
- `modal:close` - при закрытии модального окна разрешаем scroll


## Базовый код

В проекте применен принцип MVP (Model-View-Presenter), который обеспечивает разделение ответственностей между классами Model и View каждый класс выполняет свою определенную роль:

Model - работа с загрузкой данных по API, сохранение и работа с данными полученными от пользователя.

View - отображает интерфейс для взаимодействия с пользователем, отлавливает и сообщает о произошедших событиях.

EventEmitter выступает в роли Представителя (Presenter) - связывает модели данных с отображением интерфейсов при срабатывании какого либо события, управляя взаимодействием между ними.
## Описание базовых классов

### Класс `Api` имеет следующие свойства и методы.

Методы:
- `handleResponse` - обработчик ответа сервера.
- `get` - принимает изменяющеюся часть url-адреса, возвращает ответ от сервера.
- `post` - принимает изменяющеюся часть url-адреса, принимает данные в виде объекта для отправки на сервер, type ApiPostMethods = 'POST' | 'PUT' | 'DELETE'.

### Класс `Component` родительский класс для работы с DOM-элементами в дочерних элементах и имеет переиспользуемые методы. 

Методы:
- `toggleClass` - переключает класс, устанавливает обводку вокруг выбранного метода оплаты.
- `addClass` - добавляет класс 
- `removeClass` - удаляет класс 
- `setText` - принимает два значения, первое HTMLElement, второе значение задаёт текстовое содержимое HTMLElement.
- `setDisabled` - изменение статуса блокировки для кнопки.
- `setImage` - вставляет изображение с алтернативным текстом.
- `replaceChildren` - наполняет список дочерниъ элементов контентом.
- `render` - возвращает корневой DOM-элемент.

### Класс `EventEmitter` - брокер событий, implements от IEvents и имеет следующие методы.

Класс EventEmitter реализует паттерн «Observer/Наблюдатель» и обеспечивает работу событий, его методы позволяют устанавливать и снимать слушатели событий, вызвать слушатели при возникновении события.

Методы:
- `on` - для подписки на событие.
- `off` - для отписки от события.
- `emit` - уведомления подписчиков о наступлении события соответственно.
- `onAll` - для подписки на все события.
- `offAll` - сброса всех подписчиков.
- `trigger` - генерирует заданное событие с заданными аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. 

### Класс `Form` - родительский класс для работы с формами, наследует класс `Component`.

Методы:
- `onInputChange` - для подписки на событие.
- `render` - для отписки от события.

## Описание классов Model, которые позволяют хранить и обрабатывать данные с сервера и от пользователей.

### Класс `ApiModel` - наследует класс `API`, и взаимодействует с сервером 

Методы:
- `getProductList` - получает массив карточек.
- `postOrderLot` - отправляет на серевер заказ.

### Класс `BasketModel` хранит и работает с данными полученными от пользователя.

Методы:
- `getCounter` - возвращает количество карточек в корзине.
- `getSumAllProducts` - считает и возвращает сумму синапсов всех товаров в корзине.
- `addBasketItem` - добавляет карточку в корзину.
- `deleteCardToBasket` - удаляет карточку из корзины.
- `clearBasketProducts` - очищает/удаляет все карточки из корзины.

### Класс `ProductModel` принимает и хранит данные карточек полученные с сервера.

Методы:
- `products` - хранит список карточек
- `selectedProduct` - хранит выбранную карточку
- `setSelectedCard` - получает данные карточки которую открыл пользователь.

### Класс `FormModel` хранит данные полученные от пользователя.

Методы:
- `paymentType` - хранит способ оплаты
- `email` - хранит строку эл. адрес
- `phone` - хранит строку с номером телефона
- `address` - хранит адрес
- `setOrderPaymentType` - записывает выбранный тип оплатыс в `paymentType` и вызывает метод валидации.
- `setOrderAddress` - записывает введенный адрес в `address` и вызывает метод валидации.
- `setOrderEmail` - записывает введенный email в `email` и вызывает метод валидации.
- `setOrderPhone` - записывает введенный телефон в `phone` и вызывает метод валидации.
- `validateOrder` - метод корректность ввода данных пользователем и выводит ошибку.

## Классы View позволяют отображать элементы страницы с полученными данными, позволяют взаимодействовать с пользователем.

### Класс `Basket` наследует класс `Component` и управляет отображением корзины.

Методы:
- `setSumAllProducts` - сохраняет и устанавливает сумму синапсов всех товаров в корзине.

### Класс `BasketItem` наследует класс `Component` и управляет отображением элементов(продуктов) в корзине.

Метод:
- `setPrice` - принимает цену продукта в числовом значении и возвращает в строчном.
- `render` - обновляет и заполняет данные выбранных карточек DOM-элементов корзины.

### Класс `Card` наследует класс `Component` и управляет отображением карточки товара на веб странице.

Методы:
- `cardCategory` - сеттер принимает строчное значение и создаёт новый className для HTMLElement.
- `setPrice` - принимает цену продукта в числовом значении и возвращает в строчном.
- `render` - обновляет и заполняет данные выбранных карточек DOM-элементов корзины.

### Класс `CardPreviewModal` наследуется от класса `Card` и управляет отображением подробного описания карточки товара в превью, позволяет добавить карточку в корзину.

Метод:
- `notSale` - принимает данные о продукте, проверяет наличие цены продукта, при отсутствии цены ограничивает покупку.
- `render` - обновляет и заполняет данные выбранных карточек DOM-элементов корзины.

### Класс `Contacts` наследует класс `Form`, управляет отображением содержимого модального окна и позволяет принять от пользователя номер телефона и Email.

### Класс `FormOrder` наследует класс `Form`, управляет отображением содержимого модального окна и позволяет принять от пользователя метод оплаты и адрес.

### Класс `Modal` управляет отображением модальных окон.

Методы:
- `open` - отображает модальное окно.
- `close` - закрывает модальное окно.
- `render` - обновляет и заполняет данные выбранных карточек DOM-элементов корзины.

### Класс `Success` управляет отображением удачного заказа в модальном окне.
Метод - `render` - обновляет и заполняет данные выбранных карточек DOM-элементов корзины.
