import {injectable} from 'tsyringe';

export type StripeConfig = {
    endpoint: string,
    apiKey: string,
};

export type NotificationsConfig = {
    fromAddress: string,
    endpoint: string,
    apiKey: string,
};

@injectable()
export class ConfigService {
    public getStripeConfig(): StripeConfig {
        return {
            endpoint: this.getFromEnv('STRIPE_API_ENDPOINT', 'https://api.stripe.com'),
            apiKey: this.getFromEnvOrThrow('STRIPE_API_KEY'),
        };
    }

    public getNotificationsConfig(): NotificationsConfig {
        return {
            fromAddress: this.getFromEnv('NOTIFICATIONS_FROM_ADDRESS', 'paymentprocessing@aep.com'),
            endpoint: this.getFromEnv('NOTIFICATIONS_API_ENDPOINT', 'https://some-email-api'),
            apiKey: this.getFromEnvOrThrow('NOTIFICATIONS_API_KEY'),
        };
    }

    private getFromEnv(key: string, defaultValue: string | undefined): string | undefined {
        return process.env[key] ?? defaultValue;
    }

    private getFromEnvOrThrow(key: string): string {
        if (!process.env[key]) {
            throw new Error(`Required env value is missing: ${key}`);
        }
        return process.env[key];
    }
}