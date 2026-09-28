import type { Provider, Game, RepositoryQuery } from '../types/game.js';
export declare class GameRepository {
    private allowedProviders;
    private normalizedGames;
    private providerIndex;
    private categoryIndex;
    private providerCategoryIndex;
    private providerTypeIndex;
    private providerCategories;
    homePopular: Game[];
    homeCasino: Game[];
    homeBallaGames: Game[];
    homeLiveCasino: Game[];
    stateStore: import("svelte/store").Writable<{
        initialized: boolean;
        loading: boolean;
        error: string | null;
        providersCount: number;
        gamesCount: number;
    }>;
    private initPromise;
    private rawProviders;
    private rawGames;
    private rawHomeGames;
    initialize(): Promise<void>;
    reset(): void;
    setAgentProviders(agentProviders: any[]): Promise<void>;
    private fallbackIndex;
    private applyIndexedData;
    getProviders(providerType?: string): Provider[];
    getProvider(providerName: string): Provider | undefined;
    getGames(query: RepositoryQuery): Game[];
    search(query: string, providerType?: string): Game[];
    getCategories(provider?: string): string[];
}
export declare const gameRepository: GameRepository;
export default gameRepository;
//# sourceMappingURL=gameRepository.d.ts.map