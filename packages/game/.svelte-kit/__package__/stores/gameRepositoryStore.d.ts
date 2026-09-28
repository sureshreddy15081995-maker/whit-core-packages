export declare const gameRepositoryState: import("svelte/store").Writable<{
    initialized: boolean;
    loading: boolean;
    error: string | null;
    providersCount: number;
    gamesCount: number;
}>;
export declare function initializeGameRepository(): Promise<void>;
//# sourceMappingURL=gameRepositoryStore.d.ts.map