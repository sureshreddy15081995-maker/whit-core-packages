export interface PlayerBalance {
    walletName?: string;
    walletSymbol?: string;
    currency?: string;
    currencySymbol?: string;
    usd?: number | string;
    INR?: number | string;
    inr?: number | string;
    cash?: number | string;
    bonus?: number | string;
    lockedBonus?: number | string;
    availableWithdrawalBalance?: number | string;
    vipPoints?: number | string;
    playMoney?: number | string;
    preferredWallet?: any;
    values?: any[];
    [key: string]: any;
}
declare class AuthState {
    wsession: string;
    username: string;
    playerDetails: any;
    balance: PlayerBalance;
    constructor();
    isLoggedIn: boolean;
    walletName: any;
    walletSymbol: any;
    isDepositAllowed: boolean;
    isWithdrawalAllowed: boolean;
    private siteId;
    private interceptorSetup;
    private balancePollingTimer;
    init(siteId?: string): void;
    startBalancePolling(intervalMs?: number): void;
    stopBalancePolling(): void;
    setSession(sessionId: string, username?: string, siteId?: string): void;
    logout(): void;
    handleSessionExpired(data?: any): void;
    fetchProfile(): Promise<any>;
    fetchBalance(): Promise<PlayerBalance>;
    private setupFetchInterceptor;
}
export declare const authState: AuthState;
export {};
//# sourceMappingURL=authState.svelte.d.ts.map