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
export declare const gameStore: {
    subscribe: (this: void, run: import("svelte/store").Subscriber<GameState>, invalidate?: () => void) => import("svelte/store").Unsubscriber;
    fetchProviders: (loggedIn: boolean, loginName?: string) => Promise<void>;
    loadData: () => Promise<void>;
    update: (this: void, updater: import("svelte/store").Updater<GameState>) => void;
};
export declare const activeProviders: import("svelte/store").Readable<Provider[]>;
export declare const allowedSlotGames: import("svelte/store").Readable<any>;
export declare const allowedHomeBanners: import("svelte/store").Readable<any[]>;
export declare const selectedProviderStore: import("svelte/store").Writable<string>;
//# sourceMappingURL=gameStore.d.ts.map