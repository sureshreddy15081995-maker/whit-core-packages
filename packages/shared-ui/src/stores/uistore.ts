import { writable } from 'svelte/store';

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

const initialState: UIState = {
    showLogin: false,
    showRegister: false,
    loginFormState: 'LOGIN',
    willOpenGameId: '',
    toast: {
        type: 'info',
        title: '',
        description: '',
        visible: false
    },
    showForgotPasswordPopup: false,
    showSessionExpired: false,
    gameLaunching: false
};

function createUIStore() {
    const { subscribe, set, update } = writable<UIState>(initialState);

    return {
        subscribe,
        showGameLoader: () => update(state => ({ ...state, gameLaunching: true })),

        hideGameLoader: () => update(state => ({ ...state, gameLaunching: false })),
        openLogin: (gameId = '') => update(state => ({
            ...state,
            showLogin: true,
            showRegister: false,
            loginFormState: 'LOGIN',
            willOpenGameId: gameId
        })),
        closeLogin: () => update(state => ({ ...state, showLogin: false })),
        openRegister: () => update(state => ({
            ...state,
            showRegister: true,
            showLogin: false,
            loginFormState: 'REGISTER'
        })),
        closeRegister: () => update(state => ({ ...state, showRegister: false })),
        showToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, description: string) => {
            update(state => ({
                ...state,
                toast: { type, title, description, visible: true }
            }));
        },
        hideToast: () => update(state => ({
            ...state,
            toast: { ...state.toast, visible: false }
        })),
        showForgotPassword: (visible: boolean) => update(state => ({
            ...state,
            showForgotPasswordPopup: visible
        })),
        openSessionExpired: () => update(state => ({ ...state, showSessionExpired: true })),
        closeSessionExpired: () => update(state => ({ ...state, showSessionExpired: false })),
        reset: () => set(initialState)
    };
}

export const uiStore = createUIStore();
