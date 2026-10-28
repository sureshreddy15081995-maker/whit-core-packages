// @common/cashier/src/payments/paymentStrategy.ts

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

export class PaymentStrategyFactory {
  private static strategies: Record<string, PaymentStrategy> = {};

  static register(type: string, strategy: PaymentStrategy) {
    this.strategies[type.toLowerCase()] = strategy;
  }

  static getStrategy(type: string): PaymentStrategy {
    const key = type.toLowerCase();
    const strategy = this.strategies[key];
    if (!strategy) {
      // Default fallback strategy using standard cashier endpoints
      return {
        async deposit(data, siteId, sessionToken) {
          const res = await fetch('/api/cashier/buy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', siteId: siteId || '', wsession: sessionToken || '' },
            body: JSON.stringify(data)
          });
          return await res.json();
        },
        async withdraw(data, siteId, sessionToken) {
          const res = await fetch('/api/cashier/cashout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', siteId: siteId || '', wsession: sessionToken || '' },
            body: JSON.stringify(data)
          });
          return await res.json();
        }
      };
    }
    return strategy;
  }
}
