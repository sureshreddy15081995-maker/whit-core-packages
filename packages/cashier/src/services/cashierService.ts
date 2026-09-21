import { environment } from '../environment.js';
import { cashierStore } from '../stores/cashierStore.js';

function getHttpOptions() {
    return {
        'Content-Type': 'application/json',
        'siteid': environment.skinId,
        'wsession': (typeof localStorage !== 'undefined' ? localStorage.getItem('bet_wSession') : '') || ''
    };
}

export class CashierService {
    async onCashierGetBalance() {
        const url = `${environment.baseUrl}${environment.api.cashier.balance}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getHttpOptions()
        });
        const data = await res.json();
        if (data && data.success) {
            cashierStore.setBalance(data);
        }
        return data;
    }

    async onCashierTransactionHistory(postData: any) {
        const url = `${environment.baseUrl}${environment.api.history.transaction}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getHttpOptions(),
            body: JSON.stringify(postData)
        });
        return await res.json();
    }

    async onCashierTransactionHistoryBYToken(postData: any) {
        const url = `${environment.baseUrl}${environment.api.history.transactionCheck}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getHttpOptions(),
            body: JSON.stringify(postData)
        });
        return await res.json();
    }

    async getdeposit(depositData: any) {
        const url = `${environment.baseUrl}${environment.api.cashier.deposit}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getHttpOptions(),
            body: JSON.stringify(depositData)
        });
        return await res.json();
    }

    async getdepositpaymentMethod() {
        const url = `${environment.baseUrl}${environment.api.cashier.paymentMethod}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getHttpOptions(),
            body: '{}'
        });
        return await res.json();
    }
}

export const cashierService = new CashierService();
