export interface EnvironmentConfig {
    production: boolean;
    baseUrl: string;
    skinId: string;
    Domain: string;
    api: {
        player: Record<string, string>;
        cashier: Record<string, string>;
        games: Record<string, string>;
        history: Record<string, string>;
        sports: Record<string, string>;
        [key: string]: any;
    };
    cmsUrl?: string;
    [key: string]: any;
}

export const defaultEnvironment: EnvironmentConfig = {
    production: true,
    baseUrl: '',
    skinId: "betakwaaba",
    Domain: "https://staging.betakwaaba.com",
    api: {
        player: {
            register: "/api/player/register",
            login: "/api/player/login",
            logout: "/api/player/logout",
            fotgotPassword: "/api/player/forgotPassword",
            getProfile: "/api/player/getProfile",
            updateProfile: "/api/player/updateProfile",
            updatePassword: "/api/player/updatePassword",
            playerStats: "/api/player/getStats",
            playerLevels: "/api/cp/playerLevels",
            playerProviderList: "/api/player/getPlayerProviderList",
            getProviders: "/api/agentAccount/getProviders",
            twofactorOptin: '/api/player/verifyTwoFactorOptIn',
            verifyAccount: '/api/player/verifyAccount',
            aviatrix: '/rest/aviatrix/launchGame',
            torro: "/rest/torrospin/launchGame",
            closeGameSession: "api/player/closeSession",
            gameclose: "rest/torrospin/gameClosed",
            nonce: "api/player/nonce?address",
            webAuthVerify: '/api/player/webAuth/verify',
            getAvatarList: "api/player/getAvatarList",
            setAvatar: "api/player/setAvatar",
            getAvatar: "/api/player/getAvatar",
            resetpasswordNew: '/api/player/reset-password',
            leaderboardlist: "/api/leaderboard/list",
            leader: "/api/leaderboard/getParticipants",
            generateOTP: "api/player/generateOTP",
            validateOTP: "api/player/validateOTP",
            addMobileVerifyBonus: "api/cashier/addMobileVerifyBonus",
            gvprovider: "/rest/gv/request/launchGame",
            vivoslots: "/rest/vivo/balance_integration/vivoGaming",
            vivoslots1: "/api/playVivo/handler/vivo",
            kingmidas: "/rest/kingmidas/launchGame",
            VOUCHERapi: "/api/cashier/interKassaCashout"
        },
        cashier: {
            balance: "/api/cashier/balance",
            deposit: "/api/cashier/buy",
            interKassaCashOut: "/api/cashier/interKassaCashout",
            getCaspianPayTrxCoversionRates: '/api/cashier/getCaspianPayTrxCoversionRates',
            withDrawCashout: '/api/cashier/cashout',
            transferUrl: "/api/cashier/pToPTransfer",
            cancelWithdrawRequest: '/api/cashier/cancelWithdrawRequest',
            getOpenWithdrawRequests: '/api/cashier/getOpenWithdrawRequests',
            exchangRates: '/api/cashier/getExchangeRates',
            walletExchange: '/api/cashier/walletExchange',
            getExchangeRates: "/api/cp/exchangeRates",
            exchangeVipPointsUrl: "/api/cp/exchange",
            getBankAccounts: '/api/cashier/getBankAccounts',
            addBankAccount: '/api/cashier/addBankAccount',
            deleteBankAccount: '/api/cashier/deleteBankAccounts',
            paymentMethod: "/api/cashier/getPaymentMethods",
            depositCallBackStatus: "/api/cashier/depositCallBackStatus"
        },
        games: {
            pragmatictoken: "/rest/pp/ppToken1",
            rubyPlayLaunch: "/rest/ruby_play/launch",
            aviatrixGameLaunch: "/rest/aviatrix/launchGame",
            cpgGameLaunch: "/rest/cpg/balance/launchGame",
            barbaraGameLaunch: "rest/barbara/launchGame",
            mancalaGameLaunch: "/rest/mancala/getToken",
            ezugiGameLaunch: "/rest/ezugi/session",
            vibraGameLaunch: "/rest/vibra/launch",
            endorphinaGameLaunch: '/rest/endorphina/endorphinaUrl',
            playVivoHandlar: "/api/playVivo/handler/vivo",
            sporToken: "/rest/bti/btiToken",
            gameurl: "/rest/caballonegro",
            vivoGameLaunch: "api/Vivo/handler",
            popokGameLaunch: "rest/popokgaming/launchGame",
            instantPlay: "rest/api/gad/gameLaunchUrl/XYZ",
            jdbLaunch: "rest/jdb/gameLaunch",
            heblounch: "/rest/habanero/session",
            indicasino: "/rest/indiCasino/api/handler",
            onegamehub: "/rest/onegamehub/launchGame",
            wkt: "/rest/huidu/9wkt/launchGame",
            walletupdate: "/rest/huidu/9wkt/walletupdate",
        },
        history: {
            transaction: '/api/history/transaction',
            transactionCheck: '/api/history/transactionCheck',
            remotegame: "/api/history/remoteGames",
            pokerhistory: "/api/history/game",
            newresponse1: '/api/history/transaction',
        },
        sports: {
            sportoken: "/rest/bti/btiToken",
            sportbalance: "/rest/bti/getBalance",
            getEventsList: "/rest/bti/getEventsList",
        }
    }
};

const g = (typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : {})) as any;
if (!g.__COMMON_ENV__) {
    g.__COMMON_ENV__ = { ...defaultEnvironment };
}

export const environment: EnvironmentConfig = g.__COMMON_ENV__;

export function setAppEnvironment(config: Partial<EnvironmentConfig>) {
    if (config.api) {
        g.__COMMON_ENV__.api = {
            ...g.__COMMON_ENV__.api,
            ...config.api,
            player: { ...g.__COMMON_ENV__.api?.player, ...config.api.player },
            cashier: { ...g.__COMMON_ENV__.api?.cashier, ...config.api.cashier },
            games: { ...g.__COMMON_ENV__.api?.games, ...config.api.games },
            history: { ...g.__COMMON_ENV__.api?.history, ...config.api.history },
            sports: { ...g.__COMMON_ENV__.api?.sports, ...config.api.sports }
        };
    }
    Object.assign(g.__COMMON_ENV__, { ...config, api: g.__COMMON_ENV__.api });
}

export function getCmsUrl(): string {
    if (typeof window === 'undefined') {
        return '';
    }
    return g.__COMMON_ENV__?.cmsUrl || '';
}
