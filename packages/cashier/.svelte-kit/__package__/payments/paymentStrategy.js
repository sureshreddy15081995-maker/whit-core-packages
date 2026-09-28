// @common/cashier/src/payments/paymentStrategy.ts
export class PaymentStrategyFactory {
    static strategies = {};
    static register(type, strategy) {
        this.strategies[type.toLowerCase()] = strategy;
    }
    static getStrategy(type) {
        const key = type.toLowerCase();
        const strategy = this.strategies[key];
        if (!strategy) {
            // Default fallback strategy using standard cashier endpoints
            return {
                async deposit(data, siteId, sessionToken) {
                    const res = await fetch('/api/cashier/buy', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', siteId: siteId || '', Wsession: sessionToken || '' },
                        body: JSON.stringify(data)
                    });
                    return await res.json();
                },
                async withdraw(data, siteId, sessionToken) {
                    const res = await fetch('/api/cashier/cashout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', siteId: siteId || '', Wsession: sessionToken || '' },
                        body: JSON.stringify(data)
                    });
                    return await res.json();
                }
            };
        }
        return strategy;
    }
}
