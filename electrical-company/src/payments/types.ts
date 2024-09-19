export type Customer = {
    id: number;
    name: string;
    email?: string;
    mobile?: string;
    mobileCarrier?: string;
    paymentMethods: PaymentMethods;
}

type PaymentMethods = {
    defaultPaymentMethod: number;
    methods: PaymentMethod[],
}

export enum PAYMENT_METHOD_TYPE {
    CARD = 'card',
    US_BANK_ACCOUNT = 'usBankAccount',
    EU_BANK_ACCOUNT = 'eu_pay_by_bank',
}

export enum PAYMENT_ERROR_TYPE {
    PAYMENT_FAILED = 'Payment Failed',
}

export type PaymentMethod = {
    id: number,
    type: PAYMENT_METHOD_TYPE,
    numberLast4Symbols: string,
    details: CardDetails | UsBankAccountDetails | EuBankAccountDetails | any,
}

type CardDetails = {
    cardBrand: CARD_BRAND,
}

export enum CARD_BRAND {
    MASTERCARD = 'Mastercard',
    VISA = 'VISA',
}

type EuBankAccountDetails = {
    oragnizationName: string,
    country_code: string
}

type UsBankAccountDetails = {
    bankName: string,
    accountType: US_BANK_ACCOUNT_TYPE,
}

enum US_BANK_ACCOUNT_TYPE {
    CHECKING = 'checking',
}