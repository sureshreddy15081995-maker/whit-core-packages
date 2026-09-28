export declare class GameCmsService {
    private gamesPromise;
    private gamesCache;
    private homeGamesPromise;
    private homeGamesCache;
    private providersPromise;
    private providersCache;
    private httpWsession;
    BannersHome(): Promise<any>;
    promotionBanners(): Promise<any>;
    promotionGames(): Promise<any>;
    getHomeGamesList(): Promise<any>;
    getGlobalGamesList(): Promise<any>;
    getProviders(): Promise<any>;
    jdbLaunch(gtype: string, mtype: string): Promise<any>;
    gamelunallproviders(): Promise<any>;
    heblounchSession(data: any, KeyName: any): Promise<any>;
    getEzugi(data: any): Promise<any>;
    endorphinaGames(data: any, gameid: any): Promise<any>;
    indicasino(data: any): Promise<any>;
    SportToken(data: any): Promise<any>;
    wicketgame(body: any): Promise<any>;
}
export declare const gameCmsService: GameCmsService;
//# sourceMappingURL=gamecmsService.d.ts.map