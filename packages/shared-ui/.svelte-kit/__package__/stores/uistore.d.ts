export interface ToastMessage {
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    description: string;
    visible: boolean;
}
export interface UIState {
    showLogin: boolean;
    showRegister: boolean;
    loginFormState: 'LOGIN' | 'REGISTER';
    willOpenGameId: string;
    toast: ToastMessage;
    showForgotPasswordPopup: boolean;
    showSessionExpired: boolean;
    gameLaunching: boolean;
}
export declare const uiStore: {
    subscribe: (this: void, run: import("svelte/store").Subscriber<UIState>, invalidate?: () => void) => import("svelte/store").Unsubscriber;
    showGameLoader: () => void;
    hideGameLoader: () => void;
    openLogin: (gameId?: string) => void;
    closeLogin: () => void;
    openRegister: () => void;
    closeRegister: () => void;
    showToast: (type: "success" | "error" | "info" | "warning", title: string, description: string) => void;
    hideToast: () => void;
    showForgotPassword: (visible: boolean) => void;
    openSessionExpired: () => void;
    closeSessionExpired: () => void;
    reset: () => void;
};
//# sourceMappingURL=uistore.d.ts.map