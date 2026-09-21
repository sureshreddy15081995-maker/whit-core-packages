import type { Provider, AgentProvider, Game, RepositoryQuery } from '../types/game.js';
import { getCmsUrl, environment } from '../environment.js';
import { writable } from 'svelte/store';
import { playerService } from '@company/profile';
import { gameCmsService } from '../services/gamecmsService.js';
import { authStore } from '@company/auth';


export class GameRepository {
    private allowedProviders: Provider[] = [];
    private normalizedGames: Game[] = [];
    private providerIndex: Record<string, Game[]> = {};
    private categoryIndex: Record<string, Game[]> = {};
    private providerCategoryIndex: Record<string, Record<string, Game[]>> = {};
    private providerTypeIndex: Record<string, Provider[]> = {};
    private providerCategories: Record<string, string[]> = {};

    // Home Page Segregated Lists
    public homePopular: Game[] = [];
    public homeCasino: Game[] = [];
    public homeBallaGames: Game[] = [];
    public homeLiveCasino: Game[] = [];

    // Svelte store for reactive state updates
    public stateStore = writable({
        initialized: false,
        loading: false,
        error: null as string | null,
        providersCount: 0,
        gamesCount: 0
    });

    private initPromise: Promise<void> | null = null;

    private rawProviders: any = null;
    private rawGames: any = null;
    private rawHomeGames: any = null;

    async initialize(): Promise<void> {
        if (this.initPromise) return this.initPromise;

        this.initPromise = (async () => {
            this.stateStore.update((s) => ({ ...s, loading: true, error: null }));
            try {
                let wsession = "";
                let headers: any = {
                    'Content-Type': 'application/json',
                    'siteid': environment.skinId,
                    'wsession': wsession
                };
                wsession = typeof sessionStorage !== 'undefined' ? localStorage.getItem('bet_wSession') || '' : '';
                headers.wsession = wsession;

                let isDenied = false;
                let agentProvidersRes: any = [];
                let nickname = "";
                if (wsession) {
                    const profile = await playerService.onPlayerGetProfile().catch(() => null);

                    nickname = profile?.login || profile?.nickname || "";
                    console.log(1, "123456")
                }

                if (nickname) {
                    agentProvidersRes = await playerService.getPlayerProviderList({
                        role: 0,
                        loginName: nickname
                    }).catch(() => null);

                    const str = JSON.stringify(agentProvidersRes);
                    if (str.includes("Permission Denied for User")) {
                        isDenied = true;
                        agentProvidersRes = [];
                    }
                } else {
                    agentProvidersRes = await playerService.getProvidersBeforeLogin().catch(() => null);
                }

                let providersRes: any = [];
                let gamesRes: any = [];
                let homeGamesRes: any = {};

                if (!isDenied) {
                    const [pRes, gRes] = await Promise.all([
                        gameCmsService.getProviders().catch(() => []),
                        gameCmsService.getGlobalGamesList().catch(() => []),
                    ]);
                    providersRes = pRes;
                    gamesRes = gRes;
                    // homeGamesRes = hRes;
                } else {
                    const { gameStore } = await import('../stores/gameStore');
                    gameStore.update((s: any) => ({ ...s, isPermissionDenied: true }));
                }

                // Store raw data for dynamic updates/re-indexing
                this.rawProviders = providersRes;
                this.rawGames = gamesRes;
                this.rawHomeGames = homeGamesRes;

                // Handle the worker indexing if in browser, otherwise fallback to synchronous indexing
                if (typeof window !== 'undefined' && window.Worker) {
                    await new Promise<void>((resolve, reject) => {
                        try {
                            const workerCode = `
                                self.onmessage = (event) => {
                                    const { providers, agentProviders, games, homeGames } = event.data;
                                    try {
                                        const agentSet = new Set(agentProviders.map(ap => (ap.name || '').trim().toLowerCase()));
                                        const allowedProviders = providers.filter(p => agentSet.has((p.name || '').trim().toLowerCase()));
                                        const allowedProvidersSet = new Set(allowedProviders.map(p => (p.name || '').trim().toLowerCase()));
                                        
                                        const providerTypeIndex = {};
                                        for (const p of allowedProviders) {
                                            const type = p.providerType || 'Games';
                                            if (!providerTypeIndex[type]) providerTypeIndex[type] = [];
                                            providerTypeIndex[type].push(p);
                                        }

                                        const normalizedGames = [];
                                        const providerIndex = {};
                                        const categoryIndex = {};
                                        const providerCategoryIndex = {};
                                        const providerCategories = {};
                                        const providerCategoriesSets = {};
                                        const categorySet = new Set([
                                            'popular', 'water', 'chicken', 'crash', 'fishing', 'shooting',
                                            'bingo', 'keno', 'cards', 'tablegames', 'football',
                                            'roulette', 'teenpatti', 'andarbahar', 'blackjack', 'baccarat'
                                        ]);

                                        const processGame = (g) => {
                                            const provName = (g.provider || '').trim().toLowerCase();
                                            if (!allowedProvidersSet.has(provName)) return null;

                                            const cats = [];
                                            const rawCats = g.category || [];
                                            const rawTags = g.tags || [];
                                            const allTags = [...(Array.isArray(rawCats) ? rawCats : [rawCats]), ...(Array.isArray(rawTags) ? rawTags : [rawTags])];

                                            for (const tag of allTags) {
                                                if (typeof tag === 'string') {
                                                    const lowerTag = tag.trim().toLowerCase();
                                                    if (categorySet.has(lowerTag)) {
                                                        cats.push(lowerTag);
                                                    } else if (lowerTag === 'homegames' || lowerTag === 'home_slots') {
                                                        cats.push('popular');
                                                    }
                                                }
                                            }

                                            const normalizedGame = {
                                                ...g,
                                                provider: provName,
                                                categories: Array.from(new Set(cats)),
                                                searchNameLower: (g.gameName || g.name || g.title || '').toLowerCase(),
                                                searchProviderLower: provName
                                            };
                                            return normalizedGame;
                                        };

                                        const processAllGames = (gamesData) => {
                                            if (Array.isArray(gamesData)) {
                                                for (const g of gamesData) {
                                                    const ng = processGame(g);
                                                    if (ng) {
                                                        normalizedGames.push(ng);
                                                        const provName = ng.provider;
                                                        if (!providerIndex[provName]) providerIndex[provName] = [];
                                                        providerIndex[provName].push(ng);
                                                        if (!providerCategoriesSets[provName]) providerCategoriesSets[provName] = new Set();
                                                        for (const cat of ng.categories) {
                                                            if (!categoryIndex[cat]) categoryIndex[cat] = [];
                                                            categoryIndex[cat].push(ng);
                                                            providerCategoriesSets[provName].add(cat);
                                                            if (!providerCategoryIndex[provName]) providerCategoryIndex[provName] = {};
                                                            if (!providerCategoryIndex[provName][cat]) providerCategoryIndex[provName][cat] = [];
                                                            providerCategoryIndex[provName][cat].push(ng);
                                                        }
                                                    }
                                                }
                                            } else if (gamesData && typeof gamesData === 'object') {
                                                for (const provKey in gamesData) {
                                                    const gamesList = gamesData[provKey];
                                                    if (Array.isArray(gamesList)) {
                                                        for (const g of gamesList) {
                                                            const ng = processGame(g);
                                                            if (ng) {
                                                                normalizedGames.push(ng);
                                                                const provName = ng.provider;
                                                                if (!providerIndex[provName]) providerIndex[provName] = [];
                                                                providerIndex[provName].push(ng);
                                                                if (!providerCategoriesSets[provName]) providerCategoriesSets[provName] = new Set();
                                                                for (const cat of ng.categories) {
                                                                    if (!categoryIndex[cat]) categoryIndex[cat] = [];
                                                                    categoryIndex[cat].push(ng);
                                                                    providerCategoriesSets[provName].add(cat);
                                                                    if (!providerCategoryIndex[provName]) providerCategoryIndex[provName] = {};
                                                                    if (!providerCategoryIndex[provName][cat]) providerCategoryIndex[provName][cat] = [];
                                                                    providerCategoryIndex[provName][cat].push(ng);
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        };

                                        processAllGames(games);

                                        for (const provName in providerCategoriesSets) {
                                            providerCategories[provName] = Array.from(providerCategoriesSets[provName]);
                                        }

                                         // Segregate Home Games
                                         const homePopular = [];
                                         const homeCasino = [];
                                         const homeBallaGames = [];
                                         const homeLiveCasino = [];

                                         const processHomeGameList = (homeGamesData) => {
                                             const rawList = [];
                                             if (Array.isArray(homeGamesData)) {
                                                 rawList.push(...homeGamesData);
                                             } else if (homeGamesData && typeof homeGamesData === 'object') {
                                                 for (const key in homeGamesData) {
                                                     if (Array.isArray(homeGamesData[key])) {
                                                         rawList.push(...homeGamesData[key]);
                                                     }
                                                 }
                                             }

                                             for (const g of rawList) {
                                                 const provName = (g.provider || '').trim().toLowerCase();
                                                 if (!allowedProvidersSet.has(provName)) continue;

                                                 const cats = [];
                                                 const rawCats = g.category || [];
                                                 const rawTags = g.tags || [];
                                                 const allTags = [...(Array.isArray(rawCats) ? rawCats : [rawCats]), ...(Array.isArray(rawTags) ? rawTags : [rawTags])].map(t => (t || '').toString().toLowerCase());

                                                 const normalizedGame = {
                                                     ...g,
                                                     provider: provName,
                                                     searchNameLower: (g.gameName || g.name || g.title || '').toLowerCase(),
                                                     searchProviderLower: provName
                                                 };

                                                 const isPopular = allTags.some(t => t.includes('popular'));
                                                 const isCasino = allTags.some(t => t.includes('casino') && !t.includes('live'));
                                                 const isBallaGames = allTags.some(t => t.includes('ballagames'));
                                                 const isLive = allTags.some(t => t.includes('livecasino') || (t.includes('live') && !t.includes('ballagames')));

                                                 if (isPopular) {
                                                     homePopular.push(normalizedGame);
                                                 }
                                                 if (isCasino) {
                                                     homeCasino.push(normalizedGame);
                                                 }
                                                 if (isBallaGames) {
                                                     homeBallaGames.push(normalizedGame);
                                                 }
                                                 if (isLive) {
                                                     homeLiveCasino.push(normalizedGame);
                                                 }

                                                 // Fallback if none of the tags match
                                                 if (!isPopular && !isCasino && !isBallaGames && !isLive) {
                                                     if (g.main_section === 'popular') homePopular.push(normalizedGame);
                                                     else if (g.main_section === 'casino') homeCasino.push(normalizedGame);
                                                     else if (g.main_section === 'ballagames') homeBallaGames.push(normalizedGame);
                                                     else if (g.main_section === 'livecasino') homeLiveCasino.push(normalizedGame);
                                                     else homeCasino.push(normalizedGame); // Default fallback
                                                 }
                                             }
                                        };

                                        processHomeGameList(homeGames);

                                         self.postMessage({
                                             success: true,
                                             allowedProviders,
                                             normalizedGames,
                                             providerIndex,
                                             categoryIndex,
                                             providerCategoryIndex,
                                             providerTypeIndex,
                                             providerCategories,
                                             homePopular,
                                             homeCasino,
                                             homeBallaGames,
                                             homeLiveCasino
                                         });
                                    } catch (e) {
                                        self.postMessage({ success: false, error: e.message });
                                    }
                                };
                            `;
                            const blob = new Blob([workerCode], { type: 'application/javascript' });
                            const worker = new Worker(URL.createObjectURL(blob));

                            worker.onmessage = (e) => {
                                if (e.data.success) {
                                    this.applyIndexedData(e.data);
                                    worker.terminate();
                                    resolve();
                                } else {
                                    worker.terminate();
                                    reject(new Error(e.data.error));
                                }
                            };

                            worker.postMessage({
                                providers: providersRes,
                                agentProviders: agentProvidersRes,
                                games: gamesRes,
                                homeGames: homeGamesRes
                            });
                        } catch (e) {
                            // Fallback if Blob/Worker creation fails
                            this.fallbackIndex(providersRes, agentProvidersRes, gamesRes, homeGamesRes);
                            resolve();
                        }
                    });
                } else {
                    // SSR or Fallback
                    this.fallbackIndex(providersRes, agentProvidersRes, gamesRes, homeGamesRes);
                }

                this.stateStore.set({
                    initialized: true,
                    loading: false,
                    error: null,
                    providersCount: this.allowedProviders.length,
                    gamesCount: this.normalizedGames.length
                });

            } catch (err: any) {
                console.error("GameRepository failed to initialize", err);
                this.stateStore.update((s) => ({
                    ...s,
                    loading: false,
                    error: err?.message || 'Failed to initialize game repository'
                }));
                this.initPromise = null;
                throw err;
            }
        })();

        return this.initPromise;
    }

    reset(): void {
        this.initPromise = null;
        this.allowedProviders = [];
        this.normalizedGames = [];
        this.providerIndex = {};
        this.categoryIndex = {};
        this.providerCategoryIndex = {};
        this.providerTypeIndex = {};
        this.providerCategories = {};
        this.homePopular = [];
        this.homeCasino = [];
        this.homeBallaGames = [];
        this.homeLiveCasino = [];
        this.rawProviders = null;
        this.rawGames = null;
        this.rawHomeGames = null;
        this.stateStore.set({
            initialized: false,
            loading: false,
            error: null,
            providersCount: 0,
            gamesCount: 0
        });
    }

    async setAgentProviders(agentProviders: any[]): Promise<void> {
        if (!this.rawProviders) return;

        if (typeof window !== 'undefined' && window.Worker) {
            await new Promise<void>((resolve, reject) => {
                try {
                    const workerCode = `
                        self.onmessage = (event) => {
                            const { providers, agentProviders, games, homeGames } = event.data;
                            try {
                                const agentSet = new Set(agentProviders.map(ap => (ap.name || '').trim().toLowerCase()));
                                const allowedProviders = providers.filter(p => agentSet.has((p.name || '').trim().toLowerCase()));
                                const allowedProvidersSet = new Set(allowedProviders.map(p => (p.name || '').trim().toLowerCase()));
                                
                                const providerTypeIndex = {};
                                for (const p of allowedProviders) {
                                    const type = p.providerType || 'Games';
                                    if (!providerTypeIndex[type]) providerTypeIndex[type] = [];
                                    providerTypeIndex[type].push(p);
                                }

                                const normalizedGames = [];
                                const providerIndex = {};
                                const categoryIndex = {};
                                const providerCategoryIndex = {};
                                const providerCategories = {};
                                const providerCategoriesSets = {};
                                const categorySet = new Set([
                                    'popular', 'water', 'chicken', 'crash', 'fishing', 'shooting',
                                    'bingo', 'keno', 'cards', 'tablegames', 'football',
                                    'roulette', 'teenpatti', 'andarbahar', 'blackjack', 'baccarat'
                                ]);

                                const processGame = (g) => {
                                    const provName = (g.provider || '').trim().toLowerCase();
                                    if (!allowedProvidersSet.has(provName)) return null;

                                    const cats = [];
                                    const rawCats = g.category || [];
                                    const rawTags = g.tags || [];
                                    const allTags = [...(Array.isArray(rawCats) ? rawCats : [rawCats]), ...(Array.isArray(rawTags) ? rawTags : [rawTags])];

                                    for (const tag of allTags) {
                                        if (typeof tag === 'string') {
                                            const lowerTag = tag.trim().toLowerCase();
                                            if (categorySet.has(lowerTag)) {
                                                cats.push(lowerTag);
                                            } else if (lowerTag === 'homegames' || lowerTag === 'home_slots') {
                                                cats.push('popular');
                                            }
                                        }
                                    }

                                    const normalizedGame = {
                                        ...g,
                                        provider: provName,
                                        categories: cats,
                                        searchNameLower: (g.gameName || g.name || g.title || '').toLowerCase(),
                                        searchProviderLower: provName
                                    };
                                    return normalizedGame;
                                };

                                const processAllGames = (gamesData) => {
                                    if (Array.isArray(gamesData)) {
                                        for (const g of gamesData) {
                                            const ng = processGame(g);
                                            if (ng) {
                                                normalizedGames.push(ng);
                                                const provName = ng.provider;
                                                if (!providerIndex[provName]) providerIndex[provName] = [];
                                                providerIndex[provName].push(ng);
                                                if (!providerCategoriesSets[provName]) providerCategoriesSets[provName] = new Set();
                                                for (const cat of ng.categories) {
                                                    if (!categoryIndex[cat]) categoryIndex[cat] = [];
                                                    categoryIndex[cat].push(ng);
                                                    providerCategoriesSets[provName].add(cat);
                                                    if (!providerCategoryIndex[provName]) providerCategoryIndex[provName] = {};
                                                    if (!providerCategoryIndex[provName][cat]) providerCategoryIndex[provName][cat] = [];
                                                    providerCategoryIndex[provName][cat].push(ng);
                                                }
                                            }
                                        }
                                    } else if (gamesData && typeof gamesData === 'object') {
                                        for (const provKey in gamesData) {
                                            const gamesList = gamesData[provKey];
                                            if (Array.isArray(gamesList)) {
                                                for (const g of gamesList) {
                                                    const ng = processGame(g);
                                                    if (ng) {
                                                        normalizedGames.push(ng);
                                                        const provName = ng.provider;
                                                        if (!providerIndex[provName]) providerIndex[provName] = [];
                                                        providerIndex[provName].push(ng);
                                                        if (!providerCategoriesSets[provName]) providerCategoriesSets[provName] = new Set();
                                                        for (const cat of ng.categories) {
                                                            if (!categoryIndex[cat]) categoryIndex[cat] = [];
                                                            categoryIndex[cat].push(ng);
                                                            providerCategoriesSets[provName].add(cat);
                                                            if (!providerCategoryIndex[provName]) providerCategoryIndex[provName] = {};
                                                            if (!providerCategoryIndex[provName][cat]) providerCategoryIndex[provName][cat] = [];
                                                            providerCategoryIndex[provName][cat].push(ng);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                };

                                processAllGames(games);

                                for (const provName in providerCategoriesSets) {
                                    providerCategories[provName] = Array.from(providerCategoriesSets[provName]);
                                }

                                 const homePopular = [];
                                 const homeCasino = [];
                                 const homeBallaGames = [];
                                 const homeLiveCasino = [];

                                 const processHomeGameList = (homeGamesData) => {
                                     const rawList = [];
                                     if (Array.isArray(homeGamesData)) {
                                         rawList.push(...homeGamesData);
                                     } else if (homeGamesData && typeof homeGamesData === 'object') {
                                         for (const key in homeGamesData) {
                                             if (Array.isArray(homeGamesData[key])) {
                                                 rawList.push(...homeGamesData[key]);
                                             }
                                         }
                                     }

                                     for (const g of rawList) {
                                         const provName = (g.provider || '').trim().toLowerCase();
                                         if (!allowedProvidersSet.has(provName)) continue;

                                         const cats = [];
                                         const rawCats = g.category || [];
                                         const rawTags = g.tags || [];
                                         const allTags = [...(Array.isArray(rawCats) ? rawCats : [rawCats]), ...(Array.isArray(rawTags) ? rawTags : [rawTags])].map(t => (t || '').toString().toLowerCase());

                                         const normalizedGame = {
                                             ...g,
                                             provider: provName,
                                             searchNameLower: (g.gameName || g.name || g.title || '').toLowerCase(),
                                             searchProviderLower: provName
                                         };

                                         const isPopular = allTags.some(t => t.includes('popular'));
                                         const isCasino = allTags.some(t => t.includes('casino') && !t.includes('live'));
                                         const isBallaGames = allTags.some(t => t.includes('ballagames'));
                                         const isLive = allTags.some(t => t.includes('livecasino') || (t.includes('live') && !t.includes('ballagames')));

                                         if (isPopular) {
                                             homePopular.push(normalizedGame);
                                         }
                                         if (isCasino) {
                                             homeCasino.push(normalizedGame);
                                         }
                                         if (isBallaGames) {
                                             homeBallaGames.push(normalizedGame);
                                         }
                                         if (isLive) {
                                             homeLiveCasino.push(normalizedGame);
                                         }

                                         if (!isPopular && !isCasino && !isBallaGames && !isLive) {
                                             if (g.main_section === 'popular') homePopular.push(normalizedGame);
                                             else if (g.main_section === 'casino') homeCasino.push(normalizedGame);
                                             else if (g.main_section === 'ballagames') homeBallaGames.push(normalizedGame);
                                             else if (g.main_section === 'livecasino') homeLiveCasino.push(normalizedGame);
                                             else homeCasino.push(normalizedGame);
                                         }
                                     }
                                };

                                processHomeGameList(homeGames);

                                 self.postMessage({
                                     success: true,
                                     allowedProviders,
                                     normalizedGames,
                                     providerIndex,
                                     categoryIndex,
                                     providerCategoryIndex,
                                     providerTypeIndex,
                                     providerCategories,
                                     homePopular,
                                     homeCasino,
                                     homeBallaGames,
                                     homeLiveCasino
                                 });
                            } catch (e) {
                                self.postMessage({ success: false, error: e.message });
                            }
                        };
                    `;
                    const blob = new Blob([workerCode], { type: 'application/javascript' });
                    const worker = new Worker(URL.createObjectURL(blob));

                    worker.onmessage = (e) => {
                        if (e.data.success) {
                            this.applyIndexedData(e.data);
                            worker.terminate();
                            resolve();
                        } else {
                            worker.terminate();
                            reject(new Error(e.data.error));
                        }
                    };

                    worker.postMessage({
                        providers: this.rawProviders,
                        agentProviders: agentProviders,
                        games: this.rawGames,
                        homeGames: this.rawHomeGames
                    });
                } catch (e) {
                    this.fallbackIndex(this.rawProviders, agentProviders, this.rawGames, this.rawHomeGames);
                    resolve();
                }
            });
        } else {
            this.fallbackIndex(this.rawProviders, agentProviders, this.rawGames, this.rawHomeGames);
        }

        this.stateStore.set({
            initialized: true,
            loading: false,
            error: null,
            providersCount: this.allowedProviders.length,
            gamesCount: this.normalizedGames.length
        });
    }

    private fallbackIndex(providers: any, agentProviders: any, games: any, homeGames: any) {
        const agentSet = new Set(agentProviders.map((ap: any) => (ap.name || '').trim().toLowerCase()));
        const allowedProviders = providers.filter((p: any) => agentSet.has((p.name || '').trim().toLowerCase()));
        const allowedProvidersSet = new Set(allowedProviders.map((p: any) => (p.name || '').trim().toLowerCase()));

        const providerTypeIndex: any = {};
        for (const p of allowedProviders) {
            const type = p.providerType || 'Games';
            if (!providerTypeIndex[type]) providerTypeIndex[type] = [];
            providerTypeIndex[type].push(p);
        }

        const normalizedGames: any[] = [];
        const providerIndex: any = {};
        const categoryIndex: any = {};
        const providerCategoryIndex: any = {};
        const providerCategories: any = {};
        const providerCategoriesSets: any = {};
        const categorySet = new Set([
            'popular', 'water', 'chicken', 'crash', 'fishing', 'shooting',
            'bingo', 'keno', 'card', 'tablegames', 'football',
            'roulette', 'teenpatti', 'andarbahar', 'blackjack', 'baccarat'
        ]);

        const processGame = (g: any) => {
            const provName = (g.provider || '').trim().toLowerCase();
            if (!allowedProvidersSet.has(provName)) return null;

            const cats: string[] = [];
            const rawCats = g.category || [];
            const rawTags = g.tags || [];
            const allTags = [...(Array.isArray(rawCats) ? rawCats : [rawCats]), ...(Array.isArray(rawTags) ? rawTags : [rawTags])];

            for (const tag of allTags) {
                if (typeof tag === 'string') {
                    const lowerTag = tag.trim().toLowerCase();
                    if (categorySet.has(lowerTag)) {
                        cats.push(lowerTag);
                    } else if (lowerTag === 'homegames' || lowerTag === 'home_slots') {
                        cats.push('popular');
                    }
                }
            }

            return {
                ...g,
                provider: provName,
                categories: Array.from(new Set(cats)),
                searchNameLower: (g.gameName || g.name || g.title || '').toLowerCase(),
                searchProviderLower: provName
            };
        };

        const gamesListRaw = Array.isArray(games) ? games : (games && typeof games === 'object' ? Object.values(games).flat() : []);
        for (const g of gamesListRaw) {
            const ng = processGame(g);
            if (ng) {
                normalizedGames.push(ng);
                const provName = ng.provider;
                if (!providerIndex[provName]) providerIndex[provName] = [];
                providerIndex[provName].push(ng);
                if (!providerCategoriesSets[provName]) providerCategoriesSets[provName] = new Set();
                for (const cat of ng.categories) {
                    if (!categoryIndex[cat]) categoryIndex[cat] = [];
                    categoryIndex[cat].push(ng);
                    providerCategoriesSets[provName].add(cat);
                    if (!providerCategoryIndex[provName]) providerCategoryIndex[provName] = {};
                    if (!providerCategoryIndex[provName][cat]) providerCategoryIndex[provName][cat] = [];
                    providerCategoryIndex[provName][cat].push(ng);
                }
            }
        }

        for (const provName in providerCategoriesSets) {
            providerCategories[provName] = Array.from(providerCategoriesSets[provName]);
        }

        // Segregate Home Games
        const homePopular: any[] = [];
        const homeCasino: any[] = [];
        const homeBallaGames: any[] = [];
        const homeLiveCasino: any[] = [];

        const homeListRaw = Array.isArray(homeGames) ? homeGames : (homeGames && typeof homeGames === 'object' ? Object.values(homeGames).flat() : []);
        for (const g of homeListRaw) {
            const provName = (g.provider || '').trim().toLowerCase();
            if (!allowedProvidersSet.has(provName)) continue;

            const allTags = [...(Array.isArray(g.category) ? g.category : [g.category]), ...(Array.isArray(g.tags) ? g.tags : [g.tags])]
                .map(t => (t || '').toString().toLowerCase());

            const normalizedGame = {
                ...g,
                provider: provName,
                searchNameLower: (g.gameName || g.name || g.title || '').toLowerCase(),
                searchProviderLower: provName
            };

            const isPopular = allTags.some(t => t.includes('popular'));
            const isCasino = allTags.some(t => t.includes('casino') && !t.includes('live'));
            const isBallaGames = allTags.some(t => t.includes('ballagames'));
            const isLive = allTags.some(t => t.includes('livecasino') || (t.includes('live') && !t.includes('ballagames')));

            if (isPopular) homePopular.push(normalizedGame);
            if (isCasino) homeCasino.push(normalizedGame);
            if (isBallaGames) homeBallaGames.push(normalizedGame);
            if (isLive) homeLiveCasino.push(normalizedGame);

            if (!isPopular && !isCasino && !isBallaGames && !isLive) {
                if (g.main_section === 'popular') homePopular.push(normalizedGame);
                else if (g.main_section === 'casino') homeCasino.push(normalizedGame);
                else if (g.main_section === 'ballagames') homeBallaGames.push(normalizedGame);
                else if (g.main_section === 'livecasino') homeLiveCasino.push(normalizedGame);
                else homeCasino.push(normalizedGame);
            }
        }

        this.applyIndexedData({
            allowedProviders,
            normalizedGames,
            providerIndex,
            categoryIndex,
            providerCategoryIndex,
            providerTypeIndex,
            providerCategories,
            homePopular,
            homeCasino,
            homeBallaGames,
            homeLiveCasino
        });
    }

    private applyIndexedData(data: any) {
        this.allowedProviders = data.allowedProviders;
        this.normalizedGames = data.normalizedGames;
        this.providerIndex = data.providerIndex;
        this.categoryIndex = data.categoryIndex;
        this.providerCategoryIndex = data.providerCategoryIndex;
        this.providerTypeIndex = data.providerTypeIndex;
        this.providerCategories = data.providerCategories;
        this.homePopular = data.homePopular || [];
        this.homeCasino = data.homeCasino || [];
        this.homeBallaGames = data.homeBallaGames || [];
        this.homeLiveCasino = data.homeLiveCasino || [];
    }

    getProviders(providerType?: string): Provider[] {
        if (!providerType) return this.allowedProviders;
        return this.providerTypeIndex[providerType] || [];
    }

    getProvider(providerName: string): Provider | undefined {
        const lower = providerName.toLowerCase();
        return this.allowedProviders.find((p) => p.name.toLowerCase() === lower);
    }

    getGames(query: RepositoryQuery): Game[] {
        const { provider, category, providerType } = query;

        const lowerProvider = provider ? provider.trim().toLowerCase() : undefined;
        const lowerCategory = category ? category.trim().toLowerCase() : undefined;

        let targetProviders = this.allowedProviders;
        if (providerType) {
            targetProviders = this.providerTypeIndex[providerType] || [];
        }
        const allowedInType = new Set(targetProviders.map((p) => p.name.toLowerCase()));

        if (lowerProvider && lowerProvider !== 'all' && lowerCategory && lowerCategory !== 'all') {
            const list = this.providerCategoryIndex[lowerProvider]?.[lowerCategory] || [];
            return list.filter((g) => allowedInType.has(g.provider));
        }

        if (lowerProvider && lowerProvider !== 'all') {
            const list = this.providerIndex[lowerProvider] || [];
            return list.filter((g) => allowedInType.has(g.provider));
        }

        if (lowerCategory && lowerCategory !== 'all') {
            const list = this.categoryIndex[lowerCategory] || [];
            return list.filter((g) => allowedInType.has(g.provider));
        }

        return this.normalizedGames.filter((g) => allowedInType.has(g.provider));
    }

    search(query: string, providerType?: string): Game[] {
        if (!query) return [];
        const cleanQuery = query.trim().toLowerCase();

        let allowedInType: Set<string> | null = null;
        if (providerType) {
            const targetProviders = this.providerTypeIndex[providerType] || [];
            allowedInType = new Set(targetProviders.map((p) => p.name.toLowerCase()));
        }

        const results: Game[] = [];
        const limit = 50;

        for (let i = 0; i < this.normalizedGames.length; i++) {
            const g = this.normalizedGames[i];
            if (allowedInType && !allowedInType.has(g.provider)) {
                continue;
            }

            if (
                g.searchNameLower.includes(cleanQuery) ||
                g.searchProviderLower.includes(cleanQuery)
            ) {
                results.push(g);
                if (results.length >= limit) {
                    break;
                }
            }
        }
        return results;
    }

    getCategories(provider?: string): string[] {
        if (provider && provider !== 'all') {
            return this.providerCategories[provider.toLowerCase()] || [];
        }

        return Object.keys(this.categoryIndex);
    }
}

export const gameRepository = new GameRepository();
export default gameRepository;


