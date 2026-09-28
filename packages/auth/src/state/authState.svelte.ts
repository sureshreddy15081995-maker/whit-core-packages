// @common/auth/src/state/authState.svelte.ts
import { getWSession, setWSession, clearWSession, getSiteId } from '../utils/sessionManager.js';
import { environment } from '../environment.js';

export interface PlayerBalance {
  usd?: number | string;
  INR?: number | string;
  inr?: number | string;
  bonus?: number | string;
  vipPoints?: number | string;
  [key: string]: any;
}

class AuthState {
  wsession = $state<string | null>(null);
  username = $state<string | null>(null);
  playerDetails = $state<any>(null);
  balance = $state<PlayerBalance>({ usd: 0, INR: 0, bonus: 0, vipPoints: 0 });
  isLoggedIn = $derived(!!this.wsession);

  isDepositAllowed = $derived.by(() => {
    if (!this.playerDetails) return true;
    const val = this.playerDetails.deposits !== undefined ? this.playerDetails.deposits : this.playerDetails.deposit;
    if (val === undefined || val === null) return true;
    return val !== false && val !== 'false' && val !== 0;
  });

  isWithdrawalAllowed = $derived.by(() => {
    if (!this.playerDetails) return true;
    const val = this.playerDetails.withdrawal !== undefined ? this.playerDetails.withdrawal : this.playerDetails.withdrawals;
    if (val === undefined || val === null) return true;
    return val !== false && val !== 'false' && val !== 0;
  });

  private siteId: string = '';
  private interceptorSetup = false;

  init(siteId?: string) {
    if (typeof window === 'undefined') return;
    this.siteId = siteId || '';
    this.wsession = getWSession(this.siteId);
    this.username = localStorage.getItem(`${this.siteId ? this.siteId + '_' : ''}username`);

    this.setupFetchInterceptor();

    if (this.wsession) {
      this.fetchProfile();
      this.fetchBalance();
    }
  }

  setSession(sessionId: string, username?: string, siteId?: string) {
    const sId = siteId || this.siteId;
    this.wsession = sessionId;
    setWSession(sessionId, sId);
    if (username) {
      this.username = username;
      if (typeof window !== 'undefined') {
        localStorage.setItem(`${sId ? sId + '_' : ''}username`, username);
      }
    }
    this.fetchProfile();
    this.fetchBalance();
  }

  logout() {
    this.wsession = null;
    this.username = null;
    this.playerDetails = null;
    this.balance = { usd: 0, INR: 0, bonus: 0, vipPoints: 0 };
    clearWSession(this.siteId);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`${this.siteId ? this.siteId + '_' : ''}username`);
    }
  }

  async fetchProfile() {
    if (!this.wsession) return null;
    try {
      const res = await fetch(`${environment.baseUrl}${environment.api.player.getProfile}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'siteid': getSiteId(this.siteId),
          'Wsession': this.wsession
        },
        body: JSON.stringify({})
      });
      const data = await res.json();
      if (data && (data.success !== false)) {
        this.playerDetails = data.player || data;
        return this.playerDetails;
      }
    } catch (e) {}
    return null;
  }

  async fetchBalance() {
    if (!this.wsession) return null;
    try {
      const res = await fetch(`${environment.baseUrl}${environment.api.cashier.balance}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'siteid': getSiteId(this.siteId),
          'Wsession': this.wsession
        },
        body: JSON.stringify({})
      });
      const data = await res.json();
      if (data && (data.success !== false)) {
        this.balance = data.balance || data;
        return this.balance;
      }
    } catch (e) {}
    return null;
  }

  private setupFetchInterceptor() {
    if (this.interceptorSetup || typeof window === 'undefined') return;
    this.interceptorSetup = true;

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (response.status === 401 && this.isLoggedIn) {
        this.logout();
      }
      return response;
    };
  }
}

export const authState = new AuthState();
