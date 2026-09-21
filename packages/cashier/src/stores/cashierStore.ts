import { writable } from 'svelte/store';

export interface CashierState {
    balance: any | null;
    bankAccountInfo: any | null;
    depositResponse: any | null;
    withdrawResponse: any | null;
    transactionHistory: any | null;
    loading: boolean;
    error: any | null;
}

const initialState: CashierState = {
    balance: null,
    bankAccountInfo: null,
    depositResponse: null,
    withdrawResponse: null,
    transactionHistory: null,
    loading: false,
    error: null
};

function createCashierStore() {
    const { subscribe, set, update } = writable<CashierState>(initialState);

    return {
        subscribe,
        setBalance: (balance: any) => update(state => ({ ...state, balance })),
        setBankAccountInfo: (bankAccountInfo: any) => update(state => ({ ...state, bankAccountInfo })),
        setDepositResponse: (depositResponse: any) => update(state => ({ ...state, depositResponse })),
        setWithdrawResponse: (withdrawResponse: any) => update(state => ({ ...state, withdrawResponse })),
        setTransactionHistory: (transactionHistory: any) => update(state => ({ ...state, transactionHistory })),
        setLoading: (loading: boolean) => update(state => ({ ...state, loading })),
        setError: (error: any) => update(state => ({ ...state, error })),
        reset: () => set(initialState)
    };
}

export const cashierStore = createCashierStore();
