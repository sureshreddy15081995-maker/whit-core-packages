import { environment } from '../environment.js';
import { authStore } from '@common/auth';
import { cashierStore } from '@common/cashier';
import { uiStore } from '@common/shared-ui';
export class PlayerService {
    providersPromise = null;
    providersCache = null;
    profilePromise = null;
    profileCache = null;
    playerProviderPromise = null;
    playerProviderCache = null;
    avatarPromise = null;
    avatarCache = null;
    getSessionToken() {
        if (typeof localStorage === 'undefined')
            return '';
        const sId = environment.skinId || '';
        return localStorage.getItem(`${sId}_wSession`) ||
            localStorage.getItem('wsession') ||
            localStorage.getItem('bet_wsession') ||
            (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('wSession') : '') || '';
    }
    httpOptions() {
        return {
            'Content-Type': 'application/json',
            'siteid': environment.skinId,
            'wsession': this.getSessionToken()
        };
    }
    httpBeforeLoginOptions() {
        return {
            'Content-Type': 'application/json',
            'siteid': environment.skinId
        };
    }
    httpWsessionlang() {
        return {
            "Content-Type": "application/json",
            wsession: this.getSessionToken(),
            siteid: environment.skinId,
            lang: 'en-US'
        };
    }
    async getCombinedEvents() {
        try {
            const [res1, res2] = await Promise.all([
                fetch("/cricketen.json"),
                fetch("/socceren.json")
            ]);
            const json1 = await res1.json();
            const json2 = await res2.json();
            const combinedEvents = [...(json1?.events || []), ...(json2?.events || [])];
            return {
                events: combinedEvents,
                totalCount: (json1?.totalCount || 0) + (json2?.totalCount || 0),
                returnedEventsCount: combinedEvents.length
            };
        }
        catch (error) {
            console.error('Error fetching combined sports events', error);
            return { events: [], totalCount: 0, returnedEventsCount: 0 };
        }
    }
    async onPlayerGetProfile() {
        if (this.profileCache) {
            return this.profileCache;
        }
        if (this.profilePromise) {
            return this.profilePromise;
        }
        this.profilePromise = (async () => {
            try {
                const res = await fetch(`${environment.baseUrl}${environment.api.player.getProfile}`, {
                    method: 'POST',
                    headers: this.httpOptions(),
                    body: JSON.stringify({})
                });
                const data = await res.json();
                if (data.success) {
                    authStore.setProfile(data);
                    this.profileCache = data;
                    return data;
                }
            }
            catch (error) {
                console.error('Error fetching profile', error);
                this.profilePromise = null;
            }
            return null;
        })();
        return this.profilePromise;
    }
    async getBalance() {
        const session = this.getSessionToken();
        if (!session) {
            return null;
        }
        try {
            const res = await fetch(`${environment.baseUrl}${environment.api.cashier.balance}`, {
                method: 'POST',
                headers: this.httpOptions(),
                body: JSON.stringify({})
            });
            const data = await res.json();
            if (data.success) {
                cashierStore.setBalance(data);
                return data;
            }
            else if (data.code === 'SESSION_EXPIRED') {
                this.clearCaches();
                sessionStorage.clear();
                localStorage.removeItem('bet_wsession');
                authStore.reset();
                cashierStore.reset();
                if (typeof window !== 'undefined') {
                    try {
                        window.location.href = '/home';
                    }
                    catch { }
                }
                uiStore.openSessionExpired();
                return data;
            }
        }
        catch (error) {
            console.error('Error fetching balance', error);
        }
        return null;
    }
    async aviatrixnew(data) {
        const res = await fetch(`${environment.baseUrl}${environment.api.player.aviatrix}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify(data)
        });
        return await res.json();
    }
    async gvproviderapi(data) {
        const res = await fetch(`${environment.baseUrl}${environment.api.player.gvprovider}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify(data)
        });
        return await res.json();
    }
    async get18peaches(data) {
        const res = await fetch(`${environment.baseUrl}${environment.api.games.onegamehub}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify(data)
        });
        return await res.json();
    }
    async torrolaunch(data) {
        const res = await fetch(`${environment.baseUrl}${environment.api.player.torro}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify(data)
        });
        return await res.json();
    }
    async kingmidaslaunch(postData) {
        const res = await fetch(`${environment.baseUrl}${environment.api.player.kingmidas}`, {
            method: 'POST',
            headers: this.httpWsessionlang(),
            body: JSON.stringify(postData)
        });
        return await res.json();
    }
    async closesession(data) {
        const res = await fetch(`${environment.baseUrl}${environment.api.player.closeGameSession}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify(data)
        });
        return await res.json();
    }
    async gameclose(data) {
        const res = await fetch(`${environment.baseUrl}${environment.api.player.gameclose}`, {
            method: 'POST',
            headers: {
                ...this.httpOptions(),
                'Token': data
            },
            body: JSON.stringify({})
        });
        return await res.json();
    }
    async onPlayerUpdateProfile(postData) {
        const res = await fetch(`${environment.baseUrl}${environment.api.player.updateProfile}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify(postData)
        });
        return await res.json();
    }
    async gamelunallvivogaming() {
        const res = await fetch(`${environment.baseUrl}${environment.api.player.vivoslots}`, {
            headers: this.httpOptions()
        });
        return await res.json();
    }
    async gamelunallproviders(data) {
        const res = await fetch(`${environment.baseUrl}${environment.api.player.vivoslots1}/${data.provider}/${data.gameId}/en`, {
            headers: this.httpOptions()
        });
        return await res.json();
    }
    async twofactorOptin(body) {
        const res = await fetch(`${environment.baseUrl}${environment.api.player.twofactorOptin}`, {
            method: 'POST',
            headers: this.httpBeforeLoginOptions(),
            body: JSON.stringify(body)
        });
        return await res.json();
    }
    async onPlayerUpdatePassword(postData) {
        const res = await fetch(`${environment.baseUrl}${environment.api.player.updatePassword}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify(postData)
        });
        return await res.json();
    }
    async onPlayerGetStats() {
        const res = await fetch(`${environment.baseUrl}${environment.api.player.playerStats}`, {
            method: 'POST',
            headers: this.httpBeforeLoginOptions(),
            body: JSON.stringify({})
        });
        return await res.json();
    }
    async verifyAccount(body) {
        const res = await fetch(`${environment.baseUrl}${environment.api.player.verifyAccount}`, {
            method: 'POST',
            headers: this.httpBeforeLoginOptions(),
            body: JSON.stringify(body)
        });
        return await res.json();
    }
    async onPlayerGetPlayerLevels() {
        const res = await fetch(`${environment.baseUrl}${environment.api.player.playerLevels}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify({})
        });
        return await res.json();
    }
    async onPlayerGetRemoteGameHistory(postdata) {
        const res = await fetch(`${environment.baseUrl}${environment.api.history.remotegame}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify(postdata)
        });
        return await res.json();
    }
    async pokerhistory(postdata) {
        const res = await fetch(`${environment.baseUrl}${environment.api.history.pokerhistory}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify(postdata)
        });
        return await res.json();
    }
    async getPlayerProviderList(postdata) {
        if (this.playerProviderCache) {
            return this.playerProviderCache;
        }
        if (this.playerProviderPromise) {
            return this.playerProviderPromise;
        }
        this.playerProviderPromise = (async () => {
            try {
                const res = await fetch(`${environment.baseUrl}${environment.api.player.playerProviderList}`, {
                    method: 'POST',
                    headers: this.httpOptions(),
                    body: JSON.stringify(postdata)
                });
                const data = await res.json();
                this.playerProviderCache = data.length > 1 ? data.filter((provider) => provider.status) : data;
                return this.playerProviderCache;
            }
            catch (error) {
                this.playerProviderPromise = null;
                throw error;
            }
        })();
        return this.playerProviderPromise;
    }
    async getProvidersBeforeLogin() {
        if (this.providersCache) {
            return this.providersCache;
        }
        if (this.providersPromise) {
            return this.providersPromise;
        }
        this.providersPromise = (async () => {
            try {
                const res = await fetch(`${environment.baseUrl}/api/agentAccount/getProviders`, {
                    method: 'POST',
                    headers: this.httpOptions(),
                    body: JSON.stringify({})
                });
                const data = await res.json();
                this.providersCache = data;
                return data;
            }
            catch (error) {
                this.providersPromise = null;
                throw error;
            }
        })();
        return this.providersPromise;
    }
    async getVOUCHERapi(postdata) {
        const res = await fetch(`${environment.baseUrl}${environment.api.player.VOUCHERapi}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify(postdata)
        });
        return await res.json();
    }
    async playerDeposit(depositData) {
        const res = await fetch(`${environment.api.cashier.deposit}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'siteid': environment.skinId,
                'wsession': this.getSessionToken(),
                'lang': 'en'
            },
            body: JSON.stringify(depositData)
        });
        return await res.json();
    }
    async onCashierWithdrawCashout(postData) {
        const res = await fetch(`${environment.baseUrl}${environment.api.cashier.interKassaCashOut}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify(postData)
        });
        return await res.json();
    }
    async depositCallBackStatus(postData) {
        const res = await fetch(`${environment.baseUrl}${environment.api.cashier.depositCallBackStatus}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify(postData)
        });
        return await res.json();
    }
    async getCryptoPrices() {
        const res = await fetch(`${environment.baseUrl}${environment.api.cashier.getCaspianPayTrxCoversionRates}`, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
        return await res.json();
    }
    async makeP2PTransfer(transferInfo) {
        const res = await fetch(`${environment.baseUrl}${environment.api.cashier.transferUrl}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify(transferInfo)
        });
        return await res.json();
    }
    async playerWithdraw(withdrawBody) {
        const res = await fetch(`${environment.api.cashier.withDrawCashout}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify(withdrawBody)
        });
        return await res.json();
    }
    async onCashierCancelWithdrawRequest(postData) {
        const res = await fetch(`${environment.baseUrl}${environment.api.cashier.cancelWithdrawRequest}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify(postData)
        });
        return await res.json();
    }
    async onCashierGetOpenWithdrawRequest() {
        const res = await fetch(`${environment.baseUrl}${environment.api.cashier.getOpenWithdrawRequests}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify({})
        });
        return await res.json();
    }
    async getPendingWithdrawals() {
        const res = await fetch(`${environment.baseUrl}${environment.api.cashier.getOpenWithdrawRequests}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify({})
        });
        return await res.json();
    }
    async exchangRates(exchangeBody) {
        const res = await fetch(`${environment.api.cashier.exchangRates}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify(exchangeBody)
        });
        return await res.json();
    }
    async walletExchange(exchangeBody) {
        const res = await fetch(`${environment.api.cashier.walletExchange}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify(exchangeBody)
        });
        return await res.json();
    }
    async getExchangeRates() {
        const res = await fetch(`${environment.baseUrl}${environment.api.cashier.getExchangeRates}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify({})
        });
        return await res.json();
    }
    async onCashierGetBankAccount() {
        const res = await fetch(`${environment.baseUrl}${environment.api.cashier.getBankAccounts}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify({})
        });
        return await res.json();
    }
    async onCashierAddBankAccount(postData) {
        const res = await fetch(`${environment.baseUrl}${environment.api.cashier.addBankAccount}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify(postData)
        });
        return await res.json();
    }
    async getPragmaticHit(data) {
        const res = await fetch(`${environment.baseUrl}${environment.api.games.pragmatictoken}/${data}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify({})
        });
        return await res.json();
    }
    async onCashierDeleteBankAccount(postData) {
        const res = await fetch(`${environment.baseUrl}${environment.api.cashier.deleteBankAccount}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify(postData)
        });
        return await res.json();
    }
    async makeExchange(exchangeInfo) {
        const res = await fetch(`${environment.baseUrl}${environment.api.cashier.exchangeVipPointsUrl}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify(exchangeInfo)
        });
        return await res.json();
    }
    async getAvatarListApi() {
        const res = await fetch(`${environment.baseUrl}${environment.api.player.getAvatarList}`);
        return await res.json();
    }
    async setAvatarListApi(postData) {
        this.avatarPromise = null;
        this.avatarCache = null;
        const res = await fetch(`${environment.baseUrl}${environment.api.player.setAvatar}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify(postData)
        });
        return await res.json();
    }
    async getPlayerAvatar() {
        if (this.avatarCache) {
            return this.avatarCache;
        }
        if (this.avatarPromise) {
            return this.avatarPromise;
        }
        this.avatarPromise = (async () => {
            try {
                const res = await fetch(`${environment.baseUrl}${environment.api.player.getAvatar}`, {
                    headers: this.httpOptions()
                });
                const data = await res.json();
                this.avatarCache = data;
                return data;
            }
            catch (error) {
                this.avatarPromise = null;
                throw error;
            }
        })();
        return this.avatarPromise;
    }
    async getgenerateOTP(postdata) {
        const res = await fetch(`${environment.baseUrl}${environment.api.player.generateOTP}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify(postdata)
        });
        return await res.json();
    }
    async getvalidateOTP(postdata) {
        const res = await fetch(`${environment.baseUrl}${environment.api.player.validateOTP}`, {
            method: 'POST',
            headers: {
                ...this.httpOptions(),
                requestType: "smsVerify"
            },
            body: JSON.stringify(postdata)
        });
        return await res.json();
    }
    async getaddMobileVerifyBonus(postdata) {
        const res = await fetch(`${environment.baseUrl}${environment.api.player.addMobileVerifyBonus}`, {
            method: 'POST',
            headers: this.httpOptions(),
            body: JSON.stringify(postdata)
        });
        return await res.json();
    }
    async resetpasswordNew(body) {
        const res = await fetch(`${environment.baseUrl}${environment.api.player.resetpasswordNew}`, {
            method: 'POST',
            headers: this.httpBeforeLoginOptions(),
            body: JSON.stringify(body)
        });
        return await res.json();
    }
    async listleaderboard() {
        const res = await fetch(`${environment.baseUrl}${environment.api.player.leaderboardlist}`, {
            method: 'POST',
            headers: this.httpBeforeLoginOptions()
        });
        return await res.json();
    }
    async leader(body) {
        const res = await fetch(`${environment.baseUrl}${environment.api.player.leader}`, {
            method: 'POST',
            headers: this.httpBeforeLoginOptions(),
            body: JSON.stringify(body)
        });
        return await res.json();
    }
    clearCaches() {
        this.providersPromise = null;
        this.providersCache = null;
        this.profilePromise = null;
        this.profileCache = null;
        this.playerProviderPromise = null;
        this.playerProviderCache = null;
        this.avatarPromise = null;
        this.avatarCache = null;
    }
    handleRedirect(path, params) {
        const wsession = params.get('wsession');
        const uniqueId = params.get('uniqueId');
        const depositId = params.get('depositId');
        const sessionId = wsession || uniqueId || depositId;
        if (sessionId) {
            localStorage.setItem('bet_wsession', sessionId);
            authStore.setLoggedIn(true);
            this.onPlayerGetProfile();
            this.getBalance();
        }
    }
}
export const playerService = new PlayerService();
