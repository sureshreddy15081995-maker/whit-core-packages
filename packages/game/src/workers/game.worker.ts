import type { Provider, AgentProvider, Game } from '../types/game.js';

// Since we may run in a worker, let's listen to messages
if (typeof self !== 'undefined') {
    self.onmessage = (event: MessageEvent) => {
    const { providers, agentProviders, games } = event.data;

    try {
        const result = buildGameIndexes(providers, agentProviders, games);
        self.postMessage({ success: true, ...result });
    } catch (error: any) {
        self.postMessage({ success: false, error: error.message });
    }
};
}

export function buildGameIndexes(
    providers: Provider[],
    agentProviders: AgentProvider[],
    games: Record<string, Game[]> | Game[]
) {
    // 1. Match names case-insensitively
    const agentSet = new Set(
        agentProviders.map((ap) => (ap.name || '').trim().toLowerCase())
    );

    // Keep allowed providers
    const allowedProviders = providers.filter((p) => {
        const lowerName = (p.name || '').trim().toLowerCase();
        return agentSet.has(lowerName);
    });

    const allowedProvidersSet = new Set(
        allowedProviders.map((p) => (p.name || '').trim().toLowerCase())
    );

    // Group providers by providerType
    const providerTypeIndex: Record<string, Provider[]> = {};
    for (const p of allowedProviders) {
        const type = p.providerType || 'Games';
        if (!providerTypeIndex[type]) {
            providerTypeIndex[type] = [];
        }
        providerTypeIndex[type].push(p);
    }

    // 2. Normalize and flatten games for allowed providers only
    const normalizedGames: Game[] = [];
    const providerIndex: Record<string, Game[]> = {};
    const categoryIndex: Record<string, Game[]> = {};
    const providerCategoryIndex: Record<string, Record<string, Game[]>> = {};
    const providerCategories: Record<string, string[]> = {};
    const providerCategoriesSets: Record<string, Set<string>> = {};

    // Standard category tags we want to index
    const categorySet = new Set([
        'popular', 'water', 'chicken', 'crash', 'fishing', 'shooting',
        'bingo', 'keno', 'cards', 'tablegames', 'football',
        'roulette', 'teenpatti', 'andarbahar', 'blackjack', 'baccarat'
    ]);

    // Handle games from games response (could be object/dictionary or array)
    const processGame = (g: Game) => {
        const provName = (g.provider || '').trim().toLowerCase();
        if (!allowedProvidersSet.has(provName)) {
            return;
        }

        // Standardize categories and tags
        const cats: string[] = [];
        const rawCats = g.category || [];
        const rawTags = g.tags || [];

        // Combine categories & tags
        const allTags = [...(Array.isArray(rawCats) ? rawCats : [rawCats]), ...(Array.isArray(rawTags) ? rawTags : [rawTags])];

        for (const tag of allTags) {
            if (typeof tag === 'string') {
                const lowerTag = tag.trim().toLowerCase();
                // Map homeSlots or homeGames etc. to popular if needed, or index whatever matches
                if (categorySet.has(lowerTag)) {
                    cats.push(lowerTag);
                } else if (lowerTag === 'homegames' || lowerTag === 'home_slots') {
                    cats.push('popular');
                }
            }
        }

        const normalizedGame: Game = {
            ...g,
            provider: provName,
            categories: cats,
            searchNameLower: (g.gameName || g.title || '').toLowerCase(),
            searchProviderLower: provName
        };

        normalizedGames.push(normalizedGame);

        // Populate providerIndex
        if (!providerIndex[provName]) {
            providerIndex[provName] = [];
        }
        providerIndex[provName].push(normalizedGame);

        // Populate providerCategories
        if (!providerCategoriesSets[provName]) {
            providerCategoriesSets[provName] = new Set<string>();
        }

        // Populate categoryIndex and providerCategoryIndex
        for (const cat of cats) {
            // Category index
            if (!categoryIndex[cat]) {
                categoryIndex[cat] = [];
            }
            categoryIndex[cat].push(normalizedGame);

            // Provider Categories set
            providerCategoriesSets[provName].add(cat);

            // Provider + Category index
            if (!providerCategoryIndex[provName]) {
                providerCategoryIndex[provName] = {};
            }
            if (!providerCategoryIndex[provName][cat]) {
                providerCategoryIndex[provName][cat] = [];
            }
            providerCategoryIndex[provName][cat].push(normalizedGame);
        }
    };

    if (Array.isArray(games)) {
        for (const g of games) {
            processGame(g);
        }
    } else if (games && typeof games === 'object') {
        for (const provKey in games) {
            const gamesList = games[provKey];
            if (Array.isArray(gamesList)) {
                for (const g of gamesList) {
                    processGame(g);
                }
            }
        }
    }

    // Convert sets to arrays for postMessage serialization
    for (const provName in providerCategoriesSets) {
        providerCategories[provName] = Array.from(providerCategoriesSets[provName]);
    }

    return {
        allowedProviders,
        normalizedGames,
        providerIndex,
        categoryIndex,
        providerCategoryIndex,
        providerTypeIndex,
        providerCategories
    };
}
