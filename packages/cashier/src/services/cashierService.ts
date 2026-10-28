// @common/cashier/src/services/cashierService.ts
import { environment } from '../environment.js';
import { cashierStore } from '../stores/cashierStore.js';

function getHttpOptions(siteId?: string, sessionToken?: string) {
    const sId = siteId || environment.skinId || 'srmaster';
    let token = sessionToken;
    if (!token && typeof sessionStorage !== 'undefined') {
        token = sessionStorage.getItem('wSession') || sessionStorage.getItem('wsession') || sessionStorage.getItem('token') || '';
    }
    if (!token && typeof localStorage !== 'undefined') {
        token = localStorage.getItem(`${sId.toLowerCase()}_wsession`) ||
                localStorage.getItem(`${sId}_wsession`) ||
                localStorage.getItem('wsession') ||
                localStorage.getItem('wSession') ||
                localStorage.getItem('token') ||
                localStorage.getItem('bet_wsession') || '';
    }
    return {
        'Content-Type': 'application/json',
        'siteid': sId,
        'wsession': token || ''
    };
}

export class CashierService {
    async onCashierGetBalance(siteId?: string, sessionToken?: string) {
        const url = `${environment.baseUrl}${environment.api.cashier.balance}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getHttpOptions(siteId, sessionToken),
            body: JSON.stringify({})
        });
        const data = await res.json();
        if (data && data.success) {
            cashierStore.setBalance(data);
        }
        return data;
    }

    async onCashierTransactionHistory(postData: any, siteId?: string, sessionToken?: string) {
        const url = `${environment.baseUrl}${environment.api.history.transaction}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getHttpOptions(siteId, sessionToken),
            body: JSON.stringify(postData)
        });
        return await res.json();
    }

    async onCashierTransactionHistoryBYToken(postData: any, siteId?: string, sessionToken?: string) {
        const url = `${environment.baseUrl}${environment.api.history.transactionCheck}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getHttpOptions(siteId, sessionToken),
            body: JSON.stringify(postData)
        });
        return await res.json();
    }

    async getdeposit(depositData: any, siteId?: string, sessionToken?: string) {
        const url = `${environment.baseUrl}${environment.api.cashier.deposit}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getHttpOptions(siteId, sessionToken),
            body: JSON.stringify(depositData)
        });
        return await res.json();
    }

    async getdepositpaymentMethod(siteId?: string, sessionToken?: string) {
        const url = `${environment.baseUrl}${environment.api.cashier.paymentMethod}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getHttpOptions(siteId, sessionToken),
            body: JSON.stringify({})
        });
        return await res.json();
    }

    async getDepositCallBackStatus(sid: string | number, siteId?: string, sessionToken?: string) {
        const url = `${environment.baseUrl}${environment.api.cashier.depositCallBackStatus}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getHttpOptions(siteId, sessionToken),
            body: JSON.stringify({ sid: String(sid) })
        });
        return await res.json();
    }

    async onCashierWithdrawCashout(postData: any, siteId?: string, sessionToken?: string) {
        const url = `${environment.baseUrl}${environment.api.cashier.withDrawCashout || environment.api.cashier.interKassaCashOut}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getHttpOptions(siteId, sessionToken),
            body: JSON.stringify(postData)
        });
        return await res.json();
    }

    async getBankAccounts(siteId?: string, sessionToken?: string) {
        const url = `${environment.baseUrl}${environment.api.cashier.getBankAccounts}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getHttpOptions(siteId, sessionToken),
            body: JSON.stringify({})
        });
        return await res.json();
    }

    async addBankAccount(accountData: any, siteId?: string, sessionToken?: string) {
        const url = `${environment.baseUrl}${environment.api.cashier.addBankAccount}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getHttpOptions(siteId, sessionToken),
            body: JSON.stringify(accountData)
        });
        return await res.json();
    }

    async deleteBankAccount(accountId: string | number, siteId?: string, sessionToken?: string) {
        const url = `${environment.baseUrl}${environment.api.cashier.deleteBankAccount}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getHttpOptions(siteId, sessionToken),
            body: JSON.stringify({ id: accountId })
        });
        return await res.json();
    }

    async getExchangeRates(siteId?: string, sessionToken?: string) {
        const url = `${environment.baseUrl}${environment.api.cashier.getExchangeRates || '/api/cp/exchangeRates'}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getHttpOptions(siteId, sessionToken),
            body: JSON.stringify({})
        });
        return await res.json();
    }

    async exchangeVipPoints(points: number, siteId?: string, sessionToken?: string) {
        const url = `${environment.baseUrl}${environment.api.cashier.exchangeVipPointsUrl || '/api/cp/exchange'}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getHttpOptions(siteId, sessionToken),
            body: JSON.stringify({
                amount: points,
                targetAmount: points * 0.1,
                cpExchangeType: 'cash',
                selectedWalletType: 'main'
            })
        });
        return await res.json();
    }
}

export const cashierService = new CashierService();
