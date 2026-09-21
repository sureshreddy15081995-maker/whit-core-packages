import type { Game } from '../types/game.js';
/**
 * Reusable utility to group games by provider and arrange them alternately.
 */



/**
 * Exact logic translation of the original Angular method.
 * Uses .shift() to dequeue elements iteratively.
 */
export function arrangeGamesByProvider(games: Game[]): Game[] {
    const grouped: { [key: string]: Game[] } = {};

    // Group games by provider
    for (const game of games) {
        const provider = (game.provider || '').toLowerCase();
        if (!grouped[provider]) {
            grouped[provider] = [];
        }
        grouped[provider].push(game);
    }

    const providers = Object.keys(grouped);
    const result: Game[] = [];
    let added = true;

    while (added) {
        added = false;
        for (const provider of providers) {
            if (grouped[provider].length > 0) {
                const shifted = grouped[provider].shift();
                if (shifted) {
                    result.push(shifted);
                    added = true;
                }
            }
        }
    }

    return result;
}

/**
 * Optimized alternative approach.
 * Instead of .shift() which incurs array mutation performance cost, 
 * this approach uses index pointers.
 */
export function arrangeGamesByProviderOptimized(games: Game[]): Game[] {
    if (!games || games.length === 0) return [];

    const grouped: { [key: string]: Game[] } = {};
    for (const game of games) {
        const provider = (game.provider || '').toLowerCase();
        if (!grouped[provider]) {
            grouped[provider] = [];
        }
        grouped[provider].push(game);
    }

    const queues = Object.values(grouped);
    const result: Game[] = [];
    let round = 0;
    let hasMore = true;

    while (hasMore) {
        hasMore = false;
        for (const queue of queues) {
            if (round < queue.length) {
                result.push(queue[round]);
                hasMore = true;
            }
        }
        round++;
    }

    return result;
}

