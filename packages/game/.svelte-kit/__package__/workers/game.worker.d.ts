import type { Provider, AgentProvider, Game } from '../types/game.js';
export declare function buildGameIndexes(providers: Provider[], agentProviders: AgentProvider[], games: Record<string, Game[]> | Game[]): {
    allowedProviders: Provider[];
    normalizedGames: Game[];
    providerIndex: Record<string, Game[]>;
    categoryIndex: Record<string, Game[]>;
    providerCategoryIndex: Record<string, Record<string, Game[]>>;
    providerTypeIndex: Record<string, Provider[]>;
    providerCategories: Record<string, string[]>;
};
//# sourceMappingURL=game.worker.d.ts.map