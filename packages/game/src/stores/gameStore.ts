import { writable, derived } from 'svelte/store';
import { gameCmsService } from '../services/gamecmsService.js';
import { gameRepository } from '../repository/gameRepository.js';

export interface Provider {
    objState: number;
    name: string;
    status: boolean;
}

export interface GameState {
    [x: string]: any;
    globalGamesList: any[] | null;
    providersList: Provider[] | null;
    cmsProvidersList: any[] | null;
    homeBanners: any[] | null;
    loading: boolean;
    error: string | null;
}

const initialState: GameState = {
    globalGamesList: null,
    providersList: null,
    cmsProvidersList: null,
    homeBanners: null,
    loading: false,
    error: null
};

import { playerService } from '@common/profile';

function createGameStore() {
    const { subscribe, set, update } = writable<GameState>(initialState);
    let loadPromise: Promise<void> | null = null;

    const checkPermissionDenied = (data: any) => {
        if (!data) return false;
        try {
            const str = JSON.stringify(data);
            return str.includes("Permission Denied for User");
        } catch {
            return false;
        }
    };

    const normalizeProviders = (providers: any[]) => {
        if (!Array.isArray(providers)) return [];
        return providers.map((p: any) => {
            // Default status to true unless explicitly disabled/inactive (false/0)
            const statusVal = p.status !== false && p.status !== 'false' && p.status !== 0 && p.objState !== 0 && p.objState !== '0';
            return {
                name: p.name || p.providerName || p.provider || p.gameProviderName || '',
                status: statusVal,
                objState: p.objState !== undefined ? p.objState : (statusVal ? 1 : 0)
            };
        });
    };

    return {
        subscribe,
        fetchProviders: async (loggedIn: boolean, loginName?: string) => {
            try {
                let providers: any = [];
                let permissionDenied = false;
                if (loggedIn && loginName) {
                    const res = await playerService.getPlayerProviderList({
                        role: 0,
                        loginName: loginName
                    }).catch(() => null);
                    if (checkPermissionDenied(res)) {
                        permissionDenied = true;
                    } else if (res && (res.success || res.status) && Array.isArray(res.values || res.data || res.providers)) {
                        providers = res.values || res.data || res.providers;
                    } else if (Array.isArray(res)) {
                        providers = res;
                    }
                } else {
                    const res = await playerService.getProvidersBeforeLogin().catch(() => null);
                    if (checkPermissionDenied(res)) {
                        permissionDenied = true;
                    } else if (res && (res.success || res.status || res.success === undefined) && Array.isArray(res.values || res.data || res.providers)) {
                        providers = res.values || res.data || res.providers;
                    } else if (Array.isArray(res)) {
                        providers = res;
                    }
                }

                if (permissionDenied) {
                    update(state => ({ ...state, providersList: [], isPermissionDenied: true }));
                    await gameRepository.setAgentProviders([]);
                } else {
                    const formattedProviders = normalizeProviders(providers);
                    update(state => ({ ...state, providersList: formattedProviders, isPermissionDenied: false }));
                    await gameRepository.setAgentProviders(providers);
                }
            } catch (e) {
                console.error("Error fetching providers", e);
            }
        },
        loadData: () => {
            if (loadPromise) return loadPromise;

            update(state => ({ ...state, loading: true }));

            const sequentialLoad = async () => {
                try {
                    // 1. Fetch home-banners first
                    const bannersRes = await gameCmsService.BannersHome().catch(() => null);
                    let banners = [];
                    if (Array.isArray(bannersRes)) {
                        banners = bannersRes.filter((data: any) => {
                            return data.ImageStatus === "active";
                        });

                    } else if (Array.isArray(bannersRes?.data)) {
                        banners = bannersRes.data.filter((data: any) => {
                            return data.ImageStatus === "active";
                        });
                    }
                    update(state => ({ ...state, homeBanners: banners }));

                    // 2. Fetch dynamic providers
                    let providers: any = [];
                    let permissionDenied = false;
                    try {
                        const res = await playerService.getProvidersBeforeLogin().catch(() => null);
                        if (checkPermissionDenied(res)) {
                            permissionDenied = true;
                        } else if (res && (res.success || res.status || res.success === undefined) && Array.isArray(res.values || res.data || res.providers)) {
                            providers = res.values || res.data || res.providers;
                        } else if (Array.isArray(res)) {
                            providers = res;
                        }
                    } catch (e) {
                        console.error("Failed to load providers from API", e);
                    }

                    if (permissionDenied) {
                        update(state => ({ ...state, providersList: [], isPermissionDenied: true }));
                        await gameRepository.setAgentProviders([]);
                    } else {
                        const normalized = normalizeProviders(providers);
                        update(state => ({ ...state, providersList: normalized, isPermissionDenied: false }));
                        await gameRepository.setAgentProviders(providers);

                        // Fetch CMS providers
                        let cmsProviders: any[] = [];
                        try {
                            const cmsRes = await gameCmsService.getProviders().catch(() => null);
                            if (Array.isArray(cmsRes)) {
                                cmsProviders = cmsRes;
                            }
                        } catch (e) {
                            console.error("Failed to load CMS providers", e);
                        }

                        // Filter CMS providers against allowed agent providers
                        const allowedSet = new Set(normalized.filter(p => p.status).map(p => p.name.toLowerCase()));
                        const filteredCmsProviders = cmsProviders.filter(p => p && p.name && allowedSet.has(p.name.toLowerCase()));
                        console.log(filteredCmsProviders, "filteredCmsProvidersa")
                        update(state => ({ ...state, cmsProvidersList: filteredCmsProviders }));
                    }

                    // 3. Fetch global gamesList from Strapi CMS and flatten it
                    let flatGames: any[] = [];
                    try {
                        const globalRes = await gameCmsService.getGlobalGamesList().catch(() => null);
                        if (globalRes) {
                            const listObj = globalRes;
                            if (listObj && typeof listObj === "object") {
                                flatGames = Object.values(listObj).flat();
                            }
                        }
                    } catch (e) {
                        console.error("Failed to fetch global CMS gamesList", e);
                    }

                    // Initialize repository which fetches global games, agent providers, and home games
                    await gameRepository.initialize().catch(() => null);

                    update(state => ({ ...state, globalGamesList: flatGames, loading: false }));

                } catch (err: any) {
                    console.error("Failed to load global game configs sequentially", err);
                    update(state => ({
                        ...state,
                        loading: false,
                        error: err?.message || 'Failed to load game config data'
                    }));
                    loadPromise = null;
                }
            };

            loadPromise = sequentialLoad();
            return loadPromise;
        },
        update
    };
}

export const gameStore = createGameStore();

// Derived store to get active providers
export const activeProviders = derived(gameStore, $store => {
    if (!Array.isArray($store.providersList) || $store.providersList.length === 0) return [];
    return $store.providersList.filter((p: any) => p.status === true || p.status === 'true' || p.status === 1);
});

// Derived store to get allowed slot games dynamically from globalGamesList
export const allowedSlotGames = derived([gameStore, activeProviders], ([$store, $active]) => {
    const grouped: any = {};
    const games = $store.globalGamesList || [];
    if (games.length === 0) return {};

    const activeNamesLower = $active.map((p: any) => (p.name || '').toLowerCase());
    // const liveProviders = ["evolution", "ezugi", "sexy", "vivogaming", "pragmaticplaylivecasinohd"];

    for (const g of games) {
        const prov = (g.provider || '').toLowerCase();

        // Filter out if provider is inactive
        if (activeNamesLower.length > 0 && !activeNamesLower.includes(prov)) {
            continue;
        }

        // Exclude special categories (fishing, crash, live casino) from slots page
        const tags = g.tags || [];
        const isSpecial = tags.includes("fishing") ||
            tags.includes("crash") ||
            tags.includes("shooting") ||
            tags.includes("shoot") ||
            g.main_section === "livecasino";

        if (isSpecial) {
            continue;
        }

        if (!grouped[prov]) {
            grouped[prov] = [];
        }
        grouped[prov].push(g);
    }
    return grouped;
});

// Derived store to get allowed home banners
export const allowedHomeBanners = derived([gameStore, activeProviders], ([$store, $active]) => {





    return $store.homeBanners;
});

export const selectedProviderStore = writable<string>("");


