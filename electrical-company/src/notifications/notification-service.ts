import {injectable} from 'tsyringe';
import {Customer, PAYMENT_METHOD_TYPE} from '../payments/types';
import {PaymentFailedError} from '../payments/errors/payment-failed-error';
import {ConfigService, NotificationsConfig} from '../utils/config-service';
import {TraceIdGenerator} from '../utils/trace-id-generator';
import axios from 'axios';

type EmailPayload = {
    from: string;
    to: string[];
    messageBody: string;
}

@injectable()
export class NotificationService {
    private config: NotificationsConfig;

    constructor(
        private readonly configService: ConfigService,
        private readonly traceIdGenerator: TraceIdGenerator,
    ) {
        this.config = configService.getNotificationsConfig();
    }

    public async notifyCustomerAboutFailedPayment(customer: Customer, paymentError: PaymentFailedError): Promise<void> {
        try {
            const emailPayload = this.prepareEmailPayload(customer, paymentError);
            await axios.post(
                this.config.endpoint,
                emailPayload,
                {
                    headers: {
                        Accept: 'application/json, */*',
                        'Content-Type': 'application/json',
                        Traceparent: this.traceIdGenerator.generateNew(),
                        Authorization: `Bearer ${this.config.apiKey}`,
                    },
                },
            );
        } catch (error) {
            console.warn('Error sending message to user', error);
        }
    }

    private prepareEmailPayload(customer: Customer, paymentError: PaymentFailedError) {
        const emailPayload: EmailPayload = {
            from: this.config.fromAddress,
            to: [],
            messageBody: this.prepareMessage(customer, paymentError),
        };

        if (!customer.email && !customer.mobile) {
            throw new Error('Customer does not have any contact info');
        }

        if (!!customer.email) {
            emailPayload.to = [customer.email];
        }

        if (!!customer.mobile) {
            // An SMS message may be sent to any phone number from an email via the carrier's gateway email address
            if (customer.mobileCarrier === 'at&t') {
                emailPayload.to.push(customer.email + '@text.att.net');
            } else if (customer.mobileCarrier === 'tmobile') {
                emailPayload.to.push(customer.mobile + '@tmomail.net');
            } else {
                // We don't know what carrier is used, so we need send the message to all carriers.
                // For purposes of this exercise, assume these are the only three carriers (AT&T, T-Mobile, & Verizon)
                emailPayload.to.push(customer.mobile + 'text.att.net');
                emailPayload.to.push(customer.mobile + '@tmomail.net');
                emailPayload.to.push(customer.mobile + '@vtext.com');
            }
        }

        return emailPayload;
    }

    private prepareMessage(customer: Customer, paymentError: PaymentFailedError) {
        let paymentMethodDescription = '';

        const method = paymentError.getPaymentMethod();

        switch (method.type) {
            case PAYMENT_METHOD_TYPE.CARD:
                paymentMethodDescription = `The scheduled payment for your electrical bill ending from your ${method.details.cardBrand} credit card ending in ${method.numberLast4Symbols} failed.`;
                break;
            case PAYMENT_METHOD_TYPE.EU_BANK_ACCOUNT:
                paymentMethodDescription = `The scheduled payment for your electrical bill ending from your ${method.details.oragnizationName} bank in ${method.numberLast4Symbols} failed.`;
                break;
            case PAYMENT_METHOD_TYPE.US_BANK_ACCOUNT:
                paymentMethodDescription = `The scheduled payment for your electrical bill ending from your ${method.details.bankName} account ending in ${method.numberLast4Symbols} failed.`;
                break;
        }
        return `Hello, ${customer.name},
        ${paymentMethodDescription}
        Please verify your payment details and try again.`;
    }
}