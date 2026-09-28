import type { Game } from '../types/game.js';
/**
 * Reusable utility to group games by provider and arrange them alternately.
 */
/**
 * Exact logic translation of the original Angular method.
 * Uses .shift() to dequeue elements iteratively.
 */
export declare function arrangeGamesByProvider(games: Game[]): Game[];
/**
 * Optimized alternative approach.
 * Instead of .shift() which incurs array mutation performance cost,
 * this approach uses index pointers.
 */
export declare function arrangeGamesByProviderOptimized(games: Game[]): Game[];
//# sourceMappingURL=gameSorter.d.ts.map