import {container} from './utils/dependency-injection'
import customers from './customer-list.json';
import {PaymentService} from './payments/payment-service';
import {Customer} from './payments/types';
import {NotificationService} from './notifications/notification-service';

const paymentService = container.resolve(PaymentService);
const notificationService = container.resolve(NotificationService);

(async function() {
    for (let i = 0; i < customers.length; i++) {
        let customer = customers[i] as Customer;

        try {
            const amount = getCustomerPaymentAmount(customer.id);
            await paymentService.processPaymentForCustomer(customer, amount)
            console.log('Successfully processed payment for customer', customer.id);
        } catch (error) {
            console.error('The payment failed to process:', error);

            if (!!error.shouldNotifyClient && error.shouldNotifyClient()) {
                await notificationService.notifyCustomerAboutFailedPayment(customer, error);
            }
        }
    }
})();

function getCustomerPaymentAmount(customerId: number): string {
    const amount = Math.floor(Math.random() * (100 - 50 + 1) + 50) + Math.random();
    return amount.toFixed(2);
}