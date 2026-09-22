import { environment } from '../environment.js';
import { authStore } from '../stores/authStore.js';
import { uiStore } from '@common/shared-ui';
import { cashierStore } from '@common/cashier';
import { playerService } from '@common/profile';
import { getWSession, setWSession, clearWSession, getSiteId } from '../utils/sessionManager.js';

export class LoginService {
    private static httpOptions(siteId?: string) {
        return {
            'Content-Type': 'application/json',
            'siteid': getSiteId(siteId)
        };
    }

    static async onLogin(postdata: any, siteId?: string) {
        authStore.setLoginStart();
        try {
            const res = await fetch(`${environment.baseUrl}${environment.api.player.login}`, {
                method: 'POST',
                headers: this.httpOptions(siteId),
                body: JSON.stringify(postdata)
            });
            const data = await res.json();

            if (data && data.success === true && data.sessionId) {
                setWSession(data.sessionId, siteId);
                playerService.clearCaches();
                authStore.setLoginSuccess(data);
                uiStore.closeLogin();
                uiStore.closeRegister();
                authStore.setLoggedIn(true);

                // Get Profile and Balance after login
                await playerService.onPlayerGetProfile();
                await playerService.getBalance();

                // uiStore.showToast('success', 'Authentication', 'Logged in successfully!');
                return { success: true, data };
            } else {
                authStore.setLoginFail(data);
                const errMsg = data?.description || 'Login failed';
                uiStore.showToast('error', 'Authentication', errMsg);
                return { success: false, error: errMsg };
            }
        } catch (error: any) {
            authStore.setLoginFail({ message: error.message });
            uiStore.showToast('error', 'Authentication', error.message || 'Something went wrong');
            return { success: false, error: error.message };
        }
    }
    static async onRegister(postdata: any, siteId?: string) {
        authStore.setRegisterStart();
        try {
            const res = await fetch(`${environment.baseUrl}${environment.api.player.register}`, {
                method: 'POST',
                headers: this.httpOptions(siteId),
                body: JSON.stringify(postdata)
            });
            const data = await res.json();

            if (data && data.success === true) {
                const sId = data.sessionId || data.loginResponse?.sessionId;
                if (sId) {
                    setWSession(sId, siteId);
                    playerService.clearCaches();
                    authStore.setRegisterSuccess(data.loginResponse || data);
                    uiStore.closeLogin();
                    uiStore.closeRegister();
                    authStore.setLoggedIn(true);

                    await playerService.onPlayerGetProfile();
                    await playerService.getBalance();
                }
                uiStore.showToast('success', 'Registration', data.description || 'Registered successfully!');
                return { success: true, data };
            } else {
                authStore.setRegisterFail(data);
                const errMsg = data?.description || 'Registration failed';
                uiStore.showToast('error', 'Registration', errMsg);
                return { success: false, error: errMsg };
            }
        } catch (error: any) {
            authStore.setRegisterFail({ message: error.message });
            uiStore.showToast('error', 'Registration', error.message || 'Something went wrong');
            return { success: false, error: error.message };
        }
    }

    static async onForgotPassword(postdata: any, siteId?: string) {
        try {
            const res = await fetch(`${environment.baseUrl}${environment.api.player.fotgotPassword}`, {
                method: 'POST',
                headers: this.httpOptions(siteId),
                body: JSON.stringify(postdata)
            });
            const data = await res.json();
            if (data && data.success) {
                uiStore.showToast('success', 'Forgot Password', data.description || 'Password reset link sent to your email.');
                return { success: true, data };
            } else {
                const errMsg = data?.description || 'Reset request failed';
                uiStore.showToast('error', 'Forgot Password', errMsg);
                return { success: false, error: errMsg };
            }
        } catch (error: any) {
            uiStore.showToast('error', 'Forgot Password', error.message || 'Something went wrong');
            return { success: false, error: error.message };
        }
    }

    static async onLogOut(siteId?: string) {
        try {
            const wsession = getWSession(siteId);
            const res = await fetch(`${environment.baseUrl}${environment.api.player.logout}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'siteid': getSiteId(siteId),
                    'wsession': wsession
                },
                body: JSON.stringify({})
            });

            // Clear Session
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.clear();
            }
            clearWSession(siteId);

            // Clear PlayerService Caches
            playerService.clearCaches();

            // Reset stores
            authStore.reset();
            cashierStore.reset();
            uiStore.reset();

            uiStore.showToast('success', 'Authentication', 'Logged out successfully');
            if (typeof window !== 'undefined') {
                setTimeout(() => {
                    window.location.reload();
                }, 800);
            }

            return { success: true };
        } catch (error: any) {
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.clear();
            }
            clearWSession(siteId);
            authStore.reset();
            cashierStore.reset();
            if (typeof window !== 'undefined') {
                window.location.reload();
            }
            return { success: true };
        }
    }

    static async getNonce(address: string) {
        try {
            const res = await fetch(`${environment.baseUrl}${environment.api.player.nonce}?address=${address}`);
            return await res.json();
        } catch (error) {
            console.error('Error fetching nonce', error);
            return null;
        }
    }

    static async webAuthVerify(postdata: any, siteId?: string) {
        try {
            const wsession = getWSession(siteId);
            const res = await fetch(`${environment.baseUrl}${environment.api.player.webAuthVerify}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'siteid': getSiteId(siteId),
                    'wsession': wsession
                },
                body: JSON.stringify(postdata)
            });
            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Error in WebAuthVerify', error);
            return null;
        }
    }
}

