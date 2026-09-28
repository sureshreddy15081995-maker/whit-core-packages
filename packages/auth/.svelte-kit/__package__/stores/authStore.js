import { writable } from 'svelte/store';
export const showLogoutPopup = writable(false);
const initialState = {
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
    const { subscribe, set, update } = writable(initialState);
    return {
        subscribe,
        update,
        setLoginStart: () => update(state => ({ ...state, loading: true, error: null, loginResponse: null, loginErrorResponse: null })),
        setLoginSuccess: (payload) => update(state => ({
            ...state,
            loading: false,
            loginResponse: payload,
            playerLoggedIn: { loggedIn: true },
            loginErrorResponse: null
        })),
        setLoginFail: (errorPayload) => update(state => ({
            ...state,
            loading: false,
            loginResponse: null,
            loginErrorResponse: errorPayload,
            playerLoggedIn: { loggedIn: false }
        })),
        setRegisterStart: () => update(state => ({ ...state, loading: true, error: null, loginResponse: null, loginErrorResponse: null })),
        setRegisterSuccess: (payload) => update(state => ({
            ...state,
            loading: false,
            loginResponse: payload,
            playerLoggedIn: { loggedIn: true },
            loginErrorResponse: null
        })),
        setRegisterFail: (errorPayload) => update(state => ({
            ...state,
            loading: false,
            loginResponse: null,
            loginErrorResponse: errorPayload,
            playerLoggedIn: { loggedIn: false }
        })),
        setProfile: (profile) => update(state => ({ ...state, profile })),
        setPlayerAvatar: (avatar) => update(state => ({ ...state, playerAvatar: avatar })),
        setLoggedIn: (loggedIn) => update(state => ({
            ...state,
            playerLoggedIn: { loggedIn }
        })),
        reset: () => set(initialState)
    };
}
export const authStore = createAuthStore();
