export declare const showLogoutPopup: import("svelte/store").Writable<boolean>;
export interface PlayerLoggedIn {
    loggedIn: boolean;
}
export interface LoginState {
    loginResponse: any | null;
    countries: any | null;
    loginErrorResponse: any | null;
    forgotPasswordResponse: any | null;
    forgotPasswordErrorResponse: any | null;
    playerLoggedIn: PlayerLoggedIn;
    generatedCaptcha: Blob | null;
    error: string | null;
    loading: boolean;
    profile: any | null;
    playerAvatar: string | null;
}
export declare const authStore: {
    subscribe: (this: void, run: import("svelte/store").Subscriber<LoginState>, invalidate?: () => void) => import("svelte/store").Unsubscriber;
    update: (this: void, updater: import("svelte/store").Updater<LoginState>) => void;
    setLoginStart: () => void;
    setLoginSuccess: (payload: any) => void;
    setLoginFail: (errorPayload: any) => void;
    setRegisterStart: () => void;
    setRegisterSuccess: (payload: any) => void;
    setRegisterFail: (errorPayload: any) => void;
    setProfile: (profile: any) => void;
    setPlayerAvatar: (avatar: string | null) => void;
    setLoggedIn: (loggedIn: boolean) => void;
    reset: () => void;
};
//# sourceMappingURL=authStore.d.ts.map