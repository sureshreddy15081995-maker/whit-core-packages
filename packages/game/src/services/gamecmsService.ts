import { environment, getCmsUrl } from '../environment.js';

export class GameCmsService {
    private gamesPromise: Promise<any> | null = null;
    private gamesCache: any = null;

    private homeGamesPromise: Promise<any> | null = null;
    private homeGamesCache: any = null;

    private providersPromise: Promise<any> | null = null;
    private providersCache: any = null;

    private httpWsession() {
        return {
            "Content-Type": "application/json",
            wsession: localStorage.getItem("bet_wSession") || '',
            siteid: environment.skinId
        };
    }



    async BannersHome() {
        const res = await fetch(`${getCmsUrl()}/capi/home-banners?locale=en`);
        return await res.json();
    }

    async promotionBanners() {
        const res = await fetch(`${getCmsUrl()}/capi/promotion-banners`);
        return await res.json();
    }

    async promotionGames() {
        const res = await fetch(`${getCmsUrl()}/capi/promotional-games`);
        return await res.json();
    }

    async getHomeGamesList() {
        if (this.homeGamesCache) return this.homeGamesCache;
        if (this.homeGamesPromise) return this.homeGamesPromise;
        this.homeGamesPromise = (async () => {
            try {
                const res = await fetch(`${getCmsUrl()}/capi/games/all?filters[gameCategories][category][$containsi]=homeGames`);
                const data = await res.json();
                this.homeGamesCache = data;
                return data;
            } catch (err) {
                this.homeGamesPromise = null;
                throw err;
            }
        })();
        return this.homeGamesPromise;
    }

    async getGlobalGamesList() {
        if (this.gamesCache) return this.gamesCache;
        if (this.gamesPromise) return this.gamesPromise;
        this.gamesPromise = (async () => {
            try {
                const res = await fetch(`${getCmsUrl()}/capi/games/all`);
                const data = await res.json();
                this.gamesCache = data;
                return data;
            } catch (err) {
                this.gamesPromise = null;
                throw err;
            }
        })();
        return this.gamesPromise;
    }

    getProviders() {
        if (this.providersCache) {
            return Promise.resolve(this.providersCache);
        }
        if (this.providersPromise) {
            return this.providersPromise;
        }
        this.providersPromise = (async () => {
            try {
                const res = await fetch(`${getCmsUrl()}/capi/providers`);
                const data = await res.json();
                this.providersCache = data;
                return data;
            } catch (err) {
                this.providersPromise = null;
                throw err;
            }
        })();
        return this.providersPromise;
    }



    async jdbLaunch(gtype: string, mtype: string) {
        const res = await fetch(`${environment.baseUrl}${environment.api.games.jdbLaunch}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                wsession: localStorage.getItem("bet_wSession") || '',
                "mType": mtype,
                "gType": gtype
            },
            body: JSON.stringify({})
        });
        return await res.json();
    }

    async gamelunallproviders() {
        const res = await fetch(`${environment.baseUrl}${environment.api.games.playVivoHandlar}`, {
            headers: this.httpWsession()
        });
        return await res.json();
    }

    async heblounchSession(data: any, KeyName: any) {
        const res = await fetch(`${environment.baseUrl}${environment.api.games.heblounch}/${data}/${KeyName}`, {
            headers: this.httpWsession()
        });
        return await res.json();
    }

    async getEzugi(data: any) {
        const res = await fetch(`${environment.baseUrl}${environment.api.games.ezugiGameLaunch}/${data}`, {
            headers: this.httpWsession()
        });
        return await res.json();
    }

    async endorphinaGames(data: any, gameid: any) {
        const res = await fetch(`${environment.baseUrl}${environment.api.games.endorphinaGameLaunch}/${data}/${gameid}`, {
            headers: this.httpWsession()
        });
        return await res.json();
    }

    async indicasino(data: any) {
        const res = await fetch(`${environment.baseUrl}${environment.api.games.indicasino}/${data}`, {
            headers: this.httpWsession()
        });
        return await res.json();
    }

    async SportToken(data: any) {
        const res = await fetch(`${environment.baseUrl}${environment.api.sports.sportoken}/${data}`, {
            headers: this.httpWsession()
        });
        return await res.json();
    }

    async wicketgame(body: any) {
        const res = await fetch(`${environment.baseUrl}${environment.api.games.wkt}`, {
            method: 'POST',
            headers: this.httpWsession(),
            body: JSON.stringify(body)
        });
        return await res.json();
    }
}

export const gameCmsService = new GameCmsService();

