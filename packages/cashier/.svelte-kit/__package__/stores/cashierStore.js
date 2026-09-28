import { writable } from 'svelte/store';
const initialState = {
    balance: null,
    bankAccountInfo: null,
    depositResponse: null,
    withdrawResponse: null,
    transactionHistory: null,
    loading: false,
    error: null
};
function createCashierStore() {
    const { subscribe, set, update } = writable(initialState);
    return {
        subscribe,
        setBalance: (balance) => update(state => ({ ...state, balance })),
        setBankAccountInfo: (bankAccountInfo) => update(state => ({ ...state, bankAccountInfo })),
        setDepositResponse: (depositResponse) => update(state => ({ ...state, depositResponse })),
        setWithdrawResponse: (withdrawResponse) => update(state => ({ ...state, withdrawResponse })),
        setTransactionHistory: (transactionHistory) => update(state => ({ ...state, transactionHistory })),
        setLoading: (loading) => update(state => ({ ...state, loading })),
        setError: (error) => update(state => ({ ...state, error })),
        reset: () => set(initialState)
    };
}
export const cashierStore = createCashierStore();
