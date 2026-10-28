export declare function setSiteId(siteId: string): void;
export declare function getSiteId(siteId?: string): string;
export declare function getSessionKey(siteId?: string): string;
/**
 * Robust cross-storage session token getter
 * Reads from sessionStorage (Angular standard) and localStorage (SvelteKit standard)
 */
export declare function getWSession(siteId?: string): string;
/**
 * Stores session token into both localStorage and sessionStorage
 */
export declare function setWSession(sessionId: string, siteId?: string): void;
/**
 * Clears session from both localStorage and sessionStorage
 */
export declare function clearWSession(siteId?: string): void;
//# sourceMappingURL=sessionManager.d.ts.map