export interface PlayerBalance {
    usd?: number | string;
    INR?: number | string;
    inr?: number | string;
    bonus?: number | string;
    vipPoints?: number | string;
    [key: string]: any;
}
declare class AuthState {
    wsession: string;
    username: string;
    playerDetails: any;
    balance: PlayerBalance;
    isLoggedIn: boolean;
    isDepositAllowed: boolean;
    isWithdrawalAllowed: boolean;
    private siteId;
    private interceptorSetup;
    init(siteId?: string): void;
    setSession(sessionId: string, username?: string, siteId?: string): void;
    logout(): void;
    fetchProfile(): Promise<any>;
    fetchBalance(): Promise<PlayerBalance>;
    private setupFetchInterceptor;
}
export declare const authState: AuthState;
export {};
//# sourceMappingURL=authState.svelte.d.ts.map