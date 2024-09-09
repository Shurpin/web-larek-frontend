import { IEvents } from '../base/events';
import { FormErrors } from '../../types';

export interface IFormModel {
  paymentType: string;
  email: string;
  phone: string;
  address: string;
}

export class FormModel implements IFormModel {
  paymentType: string;
  email: string;
  phone: string;
  address: string;
  items: [];
  formErrors: FormErrors = {};

  constructor(protected events: IEvents) {
    this.paymentType = '';
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  getOrderLot() {
    return {
      payment: this.paymentType,
      email: this.email,
      phone: this.phone,
      address: this.address,
    }
  }

  setOrderPaymentType(value: string) {
    this.paymentType = value;

    if (this.validateOrder()) {
    }
}

setOrderAddress(value: string) {
  this.address = value;

  if (this.validateOrder()) {
  }
}

setOrderEmail(value: string) {
  this.email = value;

  if (this.validateOrder()) {
  }
}

setOrderPhone(value: string) {
  this.phone = value;

  if (this.validateOrder()) {
  }
}

validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.paymentType) {
      errors.paymentType = 'Необходимо указать способ оплаты';
  }
    if (!this.address) {
      errors.address = 'Необходимо указать адрес';
  }
  if (this.address && this.address.length <= 5) {
    errors.address = 'адрес должен содержать не менее 5 символов';
}
    if (!this.email) {
        errors.email = 'Необходимо указать email';
    }
    if (!this.phone) {
        errors.phone = 'Необходимо указать телефон';
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
}
}
