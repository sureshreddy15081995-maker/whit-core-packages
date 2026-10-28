import { environment } from '../environment.js';
// Configurable global siteId (fallback to environment.skinId or 'srmaster')
let currentSiteId = '';
export function setSiteId(siteId) {
    currentSiteId = siteId;
}
export function getSiteId(siteId) {
    return siteId || currentSiteId || environment?.skinId || 'srmaster';
}
export function getSessionKey(siteId) {
    const id = getSiteId(siteId).toLowerCase();
    return `${id}_wsession`;
}
/**
 * Robust cross-storage session token getter
 * Reads from sessionStorage (Angular standard) and localStorage (SvelteKit standard)
 */
export function getWSession(siteId) {
    const id = getSiteId(siteId);
    // 1. Check sessionStorage first (matching Angular wSession)
    if (typeof sessionStorage !== 'undefined') {
        const sWs = sessionStorage.getItem('wSession') || sessionStorage.getItem('wsession') || sessionStorage.getItem('token');
        if (sWs)
            return sWs;
    }
    if (typeof localStorage === 'undefined')
        return '';
    // 2. Try dynamic site-specific key (e.g. 'srmaster_wsession')
    const keyLower = `${id.toLowerCase()}_wsession`;
    const valLower = localStorage.getItem(keyLower);
    if (valLower)
        return valLower;
    const keyCamel = `${id}_wsession`;
    const valCamel = localStorage.getItem(keyCamel);
    if (valCamel)
        return valCamel;
    // 3. Try standard generic keys
    const genericWs = localStorage.getItem('wsession') || localStorage.getItem('wSession') || localStorage.getItem('token');
    if (genericWs)
        return genericWs;
    // 4. Fallback to legacy default key
    return localStorage.getItem('bet_wsession') || '';
}
/**
 * Stores session token into both localStorage and sessionStorage
 */
export function setWSession(sessionId, siteId) {
    if (!sessionId)
        return;
    const id = getSiteId(siteId);
    const key = getSessionKey(siteId);
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, sessionId);
        localStorage.setItem('wsession', sessionId);
        localStorage.setItem('token', sessionId);
        localStorage.setItem('srmaster_wsession', sessionId);
    }
    if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('wSession', sessionId);
        sessionStorage.setItem('wsession', sessionId);
        sessionStorage.setItem('token', sessionId);
    }
}
/**
 * Clears session from both localStorage and sessionStorage
 */
export function clearWSession(siteId) {
    const id = getSiteId(siteId).toLowerCase();
    if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(`${id}_wsession`);
        localStorage.removeItem('srmaster_wsession');
        localStorage.removeItem('wsession');
        localStorage.removeItem('wSession');
        localStorage.removeItem('token');
        localStorage.removeItem('cached_player_balance');
        localStorage.removeItem(`${id}_oneClickPasswordPending`);
        localStorage.removeItem(`${id}_oneClickLoginName`);
        localStorage.removeItem(`${id}_oneClickOldPassword`);
    }
    if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem('wSession');
        sessionStorage.removeItem('wsession');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('access_token');
    }
}
