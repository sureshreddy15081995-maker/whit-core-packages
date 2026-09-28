export interface CashierState {
    balance: any | null;
    bankAccountInfo: any | null;
    depositResponse: any | null;
    withdrawResponse: any | null;
    transactionHistory: any | null;
    loading: boolean;
    error: any | null;
}
export declare const cashierStore: {
    subscribe: (this: void, run: import("svelte/store").Subscriber<CashierState>, invalidate?: () => void) => import("svelte/store").Unsubscriber;
    setBalance: (balance: any) => void;
    setBankAccountInfo: (bankAccountInfo: any) => void;
    setDepositResponse: (depositResponse: any) => void;
    setWithdrawResponse: (withdrawResponse: any) => void;
    setTransactionHistory: (transactionHistory: any) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: any) => void;
    reset: () => void;
};
//# sourceMappingURL=cashierStore.d.ts.map