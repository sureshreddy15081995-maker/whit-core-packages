export declare class CashierService {
    onCashierGetBalance(siteId?: string, sessionToken?: string): Promise<any>;
    onCashierTransactionHistory(postData: any, siteId?: string, sessionToken?: string): Promise<any>;
    onCashierTransactionHistoryBYToken(postData: any, siteId?: string, sessionToken?: string): Promise<any>;
    getdeposit(depositData: any, siteId?: string, sessionToken?: string): Promise<any>;
    getdepositpaymentMethod(siteId?: string, sessionToken?: string): Promise<any>;
    getDepositCallBackStatus(sid: string | number, siteId?: string, sessionToken?: string): Promise<any>;
    onCashierWithdrawCashout(postData: any, siteId?: string, sessionToken?: string): Promise<any>;
    getBankAccounts(siteId?: string, sessionToken?: string): Promise<any>;
    addBankAccount(accountData: any, siteId?: string, sessionToken?: string): Promise<any>;
    deleteBankAccount(accountId: string | number, siteId?: string, sessionToken?: string): Promise<any>;
    getExchangeRates(siteId?: string, sessionToken?: string): Promise<any>;
    exchangeVipPoints(points: number, siteId?: string, sessionToken?: string): Promise<any>;
}
export declare const cashierService: CashierService;
//# sourceMappingURL=cashierService.d.ts.map