export interface PaymentRequest {
    amount: number;
    currency?: string;
    paymentType?: string;
    payMethod?: string;
    phoneNumber?: string;
    emailId?: string;
    userName?: string;
    [key: string]: any;
}
export interface PaymentResponse {
    success: boolean;
    transactionId?: string;
    redirectUrl?: string;
    message?: string;
    data?: any;
}
export interface PaymentStrategy {
    deposit(data: PaymentRequest, siteId?: string, sessionToken?: string): Promise<PaymentResponse>;
    withdraw(data: PaymentRequest, siteId?: string, sessionToken?: string): Promise<PaymentResponse>;
}
export declare class PaymentStrategyFactory {
    private static strategies;
    static register(type: string, strategy: PaymentStrategy): void;
    static getStrategy(type: string): PaymentStrategy;
}
//# sourceMappingURL=paymentStrategy.d.ts.map