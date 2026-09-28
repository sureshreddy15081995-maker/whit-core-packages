/**
 * Configure siteId once for the whole website (e.g., in +layout.svelte or client initialization)
 * Examples: 'deshbet', 'rajpoker', 'newsite', 'rummy', 'betakwaaba'
 */
export declare function setSiteId(siteId: string): void;
/**
 * Resolves siteId dynamically in order of priority:
 * 1. Explicitly passed `siteId`
 * 2. Set via `setSiteId(...)`
 * 3. `environment.skinId` (from existing environment config)
 * 4. Fallback: 'bet'
 */
export declare function getSiteId(siteId?: string): string;
/**
 * Returns dynamic key, e.g.:
 * - getSessionKey('deshbet')  => 'deshbet_wsession'
 * - getSessionKey('rajpoker') => 'rajpoker_wsession'
 */
export declare function getSessionKey(siteId?: string): string;
/**
 * DYNAMIC GETTER
 * Reads session token for the current or specified siteId
 * Includes backwards-compatible fallback to legacy keys (e.g. 'bet_wsession')
 */
export declare function getWSession(siteId?: string): string;
/**
 * DYNAMIC SETTER
 * Stores session token for the current or specified siteId
 *
 * Usage:
 *   setWSession(data.sessionId)             // Uses siteId from config / setSiteId
 *   setWSession(data.sessionId, 'deshbet')  // Overrides with 'deshbet'
 */
export declare function setWSession(sessionId: string, siteId?: string): void;
/**
 * DYNAMIC REMOVER (LOGOUT)
 * Clears session and site-specific temporary credentials on logout
 *
 * Usage:
 *   clearWSession()             // Clears current site session
 *   clearWSession('deshbet')    // Clears 'deshbet' session
 */
export declare function clearWSession(siteId?: string): void;
//# sourceMappingURL=sessionManager.d.ts.map