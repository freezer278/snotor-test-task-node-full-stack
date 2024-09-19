import {Customer, PAYMENT_ERROR_TYPE, PaymentMethod} from '../types';

export class PaymentFailedError extends Error {
    private baseError: Error;
    private customer: Customer;
    private paymentMethod: PaymentMethod;

    constructor(error: Error, customer: Customer, paymentMethod: PaymentMethod) {
        super();

        this.baseError = error;
        this.customer = customer;
        this.paymentMethod = paymentMethod;

        this.message = error.message;
        this.name = error.name;
        this.stack = error.stack;
    }

    public shouldNotifyClient(): boolean {
        return this.baseError.message === PAYMENT_ERROR_TYPE.PAYMENT_FAILED;
    }

    public getPaymentMethod(): PaymentMethod {
        return this.paymentMethod;
    }
}