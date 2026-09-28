import { environment } from '../environment.js';
// Configurable global siteId (fallback to environment.skinId or 'bet')
let currentSiteId = '';
/**
 * Configure siteId once for the whole website (e.g., in +layout.svelte or client initialization)
 * Examples: 'deshbet', 'rajpoker', 'newsite', 'rummy', 'betakwaaba'
 */
export function setSiteId(siteId) {
    currentSiteId = siteId;
}
/**
 * Resolves siteId dynamically in order of priority:
 * 1. Explicitly passed `siteId`
 * 2. Set via `setSiteId(...)`
 * 3. `environment.skinId` (from existing environment config)
 * 4. Fallback: 'bet'
 */
export function getSiteId(siteId) {
    return siteId || currentSiteId || environment?.skinId || 'bet';
}
/**
 * Returns dynamic key, e.g.:
 * - getSessionKey('deshbet')  => 'deshbet_wsession'
 * - getSessionKey('rajpoker') => 'rajpoker_wsession'
 */
export function getSessionKey(siteId) {
    const id = getSiteId(siteId).toLowerCase();
    return `${id}_wsession`;
}
/**
 * DYNAMIC GETTER
 * Reads session token for the current or specified siteId
 * Includes backwards-compatible fallback to legacy keys (e.g. 'bet_wsession')
 */
export function getWSession(siteId) {
    if (typeof localStorage === 'undefined')
        return '';
    const id = getSiteId(siteId);
    // 1. Try dynamic lowercase key (e.g. 'deshbet_wsession', 'betakwaaba_wsession')
    const keyLower = `${id.toLowerCase()}_wsession`;
    const valLower = localStorage.getItem(keyLower);
    if (valLower)
        return valLower;
    // 2. Try dynamic camelCase key (e.g. 'deshbet_wsession')
    const keyCamel = `${id}_wsession`;
    const valCamel = localStorage.getItem(keyCamel);
    if (valCamel)
        return valCamel;
    // 3. Fallback to legacy default key
    return localStorage.getItem('bet_wsession') || '';
}
/**
 * DYNAMIC SETTER
 * Stores session token for the current or specified siteId
 *
 * Usage:
 *   setWSession(data.sessionId)             // Uses siteId from config / setSiteId
 *   setWSession(data.sessionId, 'deshbet')  // Overrides with 'deshbet'
 */
export function setWSession(sessionId, siteId) {
    if (typeof localStorage === 'undefined' || !sessionId)
        return;
    const key = getSessionKey(siteId);
    localStorage.setItem(key, sessionId);
}
/**
 * DYNAMIC REMOVER (LOGOUT)
 * Clears session and site-specific temporary credentials on logout
 *
 * Usage:
 *   clearWSession()             // Clears current site session
 *   clearWSession('deshbet')    // Clears 'deshbet' session
 */
export function clearWSession(siteId) {
    if (typeof localStorage === 'undefined')
        return;
    const id = getSiteId(siteId).toLowerCase();
    // Clear dynamic session keys
    localStorage.removeItem(`${id}_wsession`);
    localStorage.removeItem(`${id}_wsession`);
    // Also clear site-specific temporary credentials
    localStorage.removeItem(`${id}_oneClickPasswordPending`);
    localStorage.removeItem(`${id}_oneClickLoginName`);
    localStorage.removeItem(`${id}_oneClickOldPassword`);
}
