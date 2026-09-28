import { writable } from 'svelte/store';

export const showLogoutPopup = writable(false);

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

const initialState: LoginState = {
    loginResponse: null,
    countries: null,
    loginErrorResponse: null,
    forgotPasswordResponse: null,
    forgotPasswordErrorResponse: null,
    playerLoggedIn: {
        loggedIn: false
    },
    generatedCaptcha: null,
    error: null,
    loading: false,
    profile: null,
    playerAvatar: null
};

function createAuthStore() {
    const { subscribe, set, update } = writable<LoginState>(initialState);

    return {
        subscribe,
        update,
        setLoginStart: () => update(state => ({ ...state, loading: true, error: null, loginResponse: null, loginErrorResponse: null })),
        setLoginSuccess: (payload: any) => update(state => ({
            ...state,
            loading: false,
            loginResponse: payload,
            playerLoggedIn: { loggedIn: true },
            loginErrorResponse: null
        })),
        setLoginFail: (errorPayload: any) => update(state => ({
            ...state,
            loading: false,
            loginResponse: null,
            loginErrorResponse: errorPayload,
            playerLoggedIn: { loggedIn: false }
        })),
        setRegisterStart: () => update(state => ({ ...state, loading: true, error: null, loginResponse: null, loginErrorResponse: null })),
        setRegisterSuccess: (payload: any) => update(state => ({
            ...state,
            loading: false,
            loginResponse: payload,
            playerLoggedIn: { loggedIn: true },
            loginErrorResponse: null
        })),
        setRegisterFail: (errorPayload: any) => update(state => ({
            ...state,
            loading: false,
            loginResponse: null,
            loginErrorResponse: errorPayload,
            playerLoggedIn: { loggedIn: false }
        })),
        setProfile: (profile: any) => update(state => ({ ...state, profile })),
        setPlayerAvatar: (avatar: string | null) => update(state => ({ ...state, playerAvatar: avatar })),
        setLoggedIn: (loggedIn: boolean) => update(state => ({
            ...state,
            playerLoggedIn: { loggedIn }
        })),
        reset: () => set(initialState)
    };
}

export const authStore = createAuthStore();
