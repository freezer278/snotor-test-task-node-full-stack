import {injectable} from 'tsyringe';
import {ConfigService, StripeConfig} from '../utils/config-service';
import {Customer} from './types';
import {TraceIdGenerator} from '../utils/trace-id-generator';
import {PaymentFailedError} from './errors/payment-failed-error';
import axios from 'axios';

@injectable()
export class PaymentService {
    private config: StripeConfig;

    constructor(
        private readonly configService: ConfigService,
        private readonly traceIdGenerator: TraceIdGenerator,
    ) {
        this.config = configService.getStripeConfig();
    }

    public async processPaymentForCustomer(customer: Customer, amount: string, paymentMethodId: number = null) {
        paymentMethodId = paymentMethodId ?? customer.paymentMethods.defaultPaymentMethod;

        const paymentMethod = customer.paymentMethods.methods.find((method) => {
            return method.id === paymentMethodId;
        });

        if (!paymentMethod) {
            throw new Error(`No payment method found by id ${paymentMethodId} for customer ${customer.id}`);
        }

        try {
            await axios.post(
                `${this.config.endpoint}/some-payment-endpoint`,
                {
                    customerId: customer.id,
                    paymentMethod,
                    amount: amount,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Traceparent: this.traceIdGenerator.generateNew(),
                        Authorization: `Bearer ${this.config.apiKey}`,
                    },
                }
            );
        } catch (error) {
            console.error('Error calling Stripe payment API:', error);
            throw new PaymentFailedError(error, customer, paymentMethod);
        }
    }
}