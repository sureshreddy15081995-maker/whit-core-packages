// @common/cashier/src/services/cashierService.ts
import { environment } from '../environment.js';
import { cashierStore } from '../stores/cashierStore.js';
function getHttpOptions(siteId, sessionToken) {
    const sId = siteId || environment.skinId || '';
    let token = sessionToken;
    if (!token && typeof localStorage !== 'undefined') {
        token = localStorage.getItem(`${sId ? sId + '_' : ''}wSession`) ||
            localStorage.getItem('wsession') ||
            localStorage.getItem('bet_wsession') ||
            (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('wSession') : '') || '';
    }
    return {
        'Content-Type': 'application/json',
        'siteid': sId,
        'Wsession': token || ''
    };
}
export class CashierService {
    async onCashierGetBalance(siteId, sessionToken) {
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
    async onCashierTransactionHistory(postData, siteId, sessionToken) {
        const url = `${environment.baseUrl}${environment.api.history.transaction}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getHttpOptions(siteId, sessionToken),
            body: JSON.stringify(postData)
        });
        return await res.json();
    }
    async onCashierTransactionHistoryBYToken(postData, siteId, sessionToken) {
        const url = `${environment.baseUrl}${environment.api.history.transactionCheck}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getHttpOptions(siteId, sessionToken),
            body: JSON.stringify(postData)
        });
        return await res.json();
    }
    async getdeposit(depositData, siteId, sessionToken) {
        const url = `${environment.baseUrl}${environment.api.cashier.deposit}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getHttpOptions(siteId, sessionToken),
            body: JSON.stringify(depositData)
        });
        return await res.json();
    }
    async getdepositpaymentMethod(siteId, sessionToken) {
        const url = `${environment.baseUrl}${environment.api.cashier.paymentMethod}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getHttpOptions(siteId, sessionToken),
            body: JSON.stringify({})
        });
        return await res.json();
    }
    async getDepositCallBackStatus(sid, siteId, sessionToken) {
        const url = `${environment.baseUrl}${environment.api.cashier.depositCallBackStatus}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getHttpOptions(siteId, sessionToken),
            body: JSON.stringify({ sid: String(sid) })
        });
        return await res.json();
    }
    async onCashierWithdrawCashout(postData, siteId, sessionToken) {
        const url = `${environment.baseUrl}${environment.api.cashier.withDrawCashout || environment.api.cashier.interKassaCashOut}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getHttpOptions(siteId, sessionToken),
            body: JSON.stringify(postData)
        });
        return await res.json();
    }
    async getBankAccounts(siteId, sessionToken) {
        const url = `${environment.baseUrl}${environment.api.cashier.getBankAccounts}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getHttpOptions(siteId, sessionToken),
            body: JSON.stringify({})
        });
        return await res.json();
    }
    async addBankAccount(accountData, siteId, sessionToken) {
        const url = `${environment.baseUrl}${environment.api.cashier.addBankAccount}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getHttpOptions(siteId, sessionToken),
            body: JSON.stringify(accountData)
        });
        return await res.json();
    }
    async deleteBankAccount(accountId, siteId, sessionToken) {
        const url = `${environment.baseUrl}${environment.api.cashier.deleteBankAccount}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getHttpOptions(siteId, sessionToken),
            body: JSON.stringify({ id: accountId })
        });
        return await res.json();
    }
    async getExchangeRates(siteId, sessionToken) {
        const url = `${environment.baseUrl}${environment.api.cashier.getExchangeRates || '/api/cp/exchangeRates'}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: getHttpOptions(siteId, sessionToken),
            body: JSON.stringify({})
        });
        return await res.json();
    }
    async exchangeVipPoints(points, siteId, sessionToken) {
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
