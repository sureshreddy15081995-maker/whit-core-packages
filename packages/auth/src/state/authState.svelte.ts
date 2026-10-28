// @common/auth/src/state/authState.svelte.ts
import { getWSession, setWSession, clearWSession, getSiteId } from '../utils/sessionManager.js';
import { environment } from '../environment.js';

export interface PlayerBalance {
  walletName?: string;
  walletSymbol?: string;
  currency?: string;
  currencySymbol?: string;
  usd?: number | string;
  INR?: number | string;
  inr?: number | string;
  cash?: number | string;
  bonus?: number | string;
  lockedBonus?: number | string;
  availableWithdrawalBalance?: number | string;
  vipPoints?: number | string;
  playMoney?: number | string;
  preferredWallet?: any;
  values?: any[];
  [key: string]: any;
}

class AuthState {
  wsession = $state<string | null>(
    typeof window !== 'undefined' ? (getWSession('srmaster') || getWSession() || null) : null
  );
  username = $state<string | null>(
    typeof window !== 'undefined' ? (localStorage.getItem('srmaster_username') || localStorage.getItem('username') || sessionStorage.getItem('username') || null) : null
  );
  playerDetails = $state<any>(null);
  balance = $state<PlayerBalance>(
    typeof window !== 'undefined' && localStorage.getItem('cached_player_balance')
      ? (() => {
          try {
            return {
              walletName: 'INR',
              walletSymbol: '₹',
              usd: 0,
              INR: 0,
              cash: 0,
              bonus: 0,
              lockedBonus: 0,
              availableWithdrawalBalance: 0,
              vipPoints: 0,
              playMoney: 0,
              values: [],
              ...JSON.parse(localStorage.getItem('cached_player_balance') || '{}')
            };
          } catch {
            return { walletName: 'INR', walletSymbol: '₹', usd: 0, INR: 0, cash: 0, bonus: 0, lockedBonus: 0, availableWithdrawalBalance: 0, vipPoints: 0, playMoney: 0, values: [] };
          }
        })()
      : {
          walletName: 'INR',
          walletSymbol: '₹',
          usd: 0,
          INR: 0,
          cash: 0,
          bonus: 0,
          lockedBonus: 0,
          availableWithdrawalBalance: 0,
          vipPoints: 0,
          playMoney: 0,
          values: []
        }
  );

  constructor() {
    if (typeof window !== 'undefined') {
      setTimeout(() => this.init('srmaster'), 0);
    }
  }
  isLoggedIn = $derived(!!this.wsession);

  walletName = $derived.by(() => {
    return (
      this.balance?.walletName ||
      this.balance?.preferredWallet?.wallet?.name ||
      this.balance?.preferredWallet?.wallet?.code ||
      this.balance?.preferredWallet?.name ||
      this.balance?.currency ||
      'INR'
    );
  });

  walletSymbol = $derived.by(() => {
    const sym =
      this.balance?.walletSymbol ||
      this.balance?.preferredWallet?.wallet?.symbol ||
      this.balance?.preferredWallet?.wallet?.currencySymbol ||
      this.balance?.preferredWallet?.symbol ||
      this.balance?.currencySymbol;
    if (sym) return sym;
    const name = String(this.walletName || '').trim().toUpperCase();
    if (name === 'INR' || name === 'RS' || name === 'RUPEE' || name === 'RUPEES') return '₹';
    if (name === 'USD') return '$';
    if (name === 'EUR') return '€';
    if (name === 'GBP') return '£';
    if (name === 'USDT') return '₮';
    if (name === 'BTC') return '₿';
    if (name === 'AED') return 'AED';
    if (name === 'CAD') return 'C$';
    if (name === 'AUD') return 'A$';
    return name || '₹';
  });

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
  private balancePollingTimer: any = null;

  init(siteId?: string) {
    if (typeof window === 'undefined') return;
    this.siteId = siteId || '';
    this.wsession = getWSession(this.siteId);
    this.username =
      localStorage.getItem(`${this.siteId ? this.siteId + '_' : ''}username`) ||
      sessionStorage.getItem('username');

    // Restore cached balance for instant display
    try {
      const cached = localStorage.getItem('cached_player_balance');
      if (cached) {
        const parsed = JSON.parse(cached);
        this.balance = { ...this.balance, ...parsed };
      }
    } catch {}

    this.setupFetchInterceptor();

    if (this.wsession) {
      this.fetchProfile();
      this.fetchBalance();
      // Start polling balance every 10 seconds
      this.startBalancePolling(10000);
    }
  }

  startBalancePolling(intervalMs: number = 10000) {
    if (typeof window === 'undefined') return;
    this.stopBalancePolling();
    this.balancePollingTimer = setInterval(() => {
      if (this.isLoggedIn) {
        this.fetchBalance();
      } else {
        this.stopBalancePolling();
      }
    }, intervalMs);
  }

  stopBalancePolling() {
    if (this.balancePollingTimer) {
      clearInterval(this.balancePollingTimer);
      this.balancePollingTimer = null;
    }
  }

  setSession(sessionId: string, username?: string, siteId?: string) {
    const sId = siteId || this.siteId;
    this.wsession = sessionId;
    setWSession(sessionId, sId);

    if (username) {
      this.username = username;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`${sId ? sId + '_' : ''}username`, username);
      }
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('username', username);
      }
    }

    this.fetchProfile();
    this.fetchBalance();
    this.startBalancePolling(10000);
  }

  logout() {
    this.stopBalancePolling();
    this.wsession = null;
    this.username = null;
    this.playerDetails = null;
    this.balance = {
      walletName: 'INR',
      walletSymbol: '₹',
      usd: 0,
      INR: 0,
      cash: 0,
      bonus: 0,
      lockedBonus: 0,
      availableWithdrawalBalance: 0,
      vipPoints: 0,
      playMoney: 0,
      values: []
    };

    clearWSession(this.siteId);

    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(`${this.siteId ? this.siteId + '_' : ''}username`);
      localStorage.removeItem('cached_player_balance');
      localStorage.removeItem('token');
      localStorage.removeItem('wsession');
    }

    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('wSession');
      sessionStorage.removeItem('wsession');
      sessionStorage.removeItem('token');
    }
  }

  handleSessionExpired(data?: any) {
    this.logout();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('session-expired', {
          detail: data || { description: 'Session expired' }
        })
      );
    }
  }

  async fetchProfile() {
    if (!this.wsession) return null;
    try {
      const res = await fetch(`${environment.baseUrl}${environment.api.player.getProfile}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          siteid: getSiteId(this.siteId),
          wsession: this.wsession
        },
        body: JSON.stringify({})
      });
      const data = await res.json();

      if (
        data &&
        (data.code === 'SESSION_EXPIRED' ||
          data.description === 'Session expired' ||
          data.code === 'INVALID_SESSION_TOKEN')
      ) {
        this.handleSessionExpired(data);
        return null;
      }

      if (data && data.success !== false) {
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
          siteid: getSiteId(this.siteId),
          wsession: this.wsession
        },
        body: JSON.stringify({})
      });
      const data = await res.json();

      if (
        data &&
        (data.code === 'SESSION_EXPIRED' ||
          data.description === 'Session expired' ||
          data.code === 'INVALID_SESSION_TOKEN')
      ) {
        this.handleSessionExpired(data);
        return null;
      }

      if (data && data.success !== false) {
        let preferredWallet: any = null;
        let compWallet: any = null;
        let playMoneyWallet: any = null;

        if (Array.isArray(data.values)) {
          // Look for preferred wallet, fallback to first non-points real money wallet
          preferredWallet =
            data.values.find((v: any) => v.preferred === true) ||
            data.values.find(
              (v: any) =>
                v.wallet?.name &&
                v.wallet.name !== 'COMPPOINTS' &&
                v.wallet.name !== 'PLAYMONEY'
            ) ||
            data.values[0];
          compWallet = data.values.find((v: any) => v.wallet?.name === 'COMPPOINTS');
          playMoneyWallet = data.values.find((v: any) => v.wallet?.name === 'PLAYMONEY');
        }

        const walletName =
          preferredWallet?.wallet?.name ||
          preferredWallet?.wallet?.code ||
          preferredWallet?.name ||
          data.walletName ||
          data.currency ||
          'INR';

        const walletSymbol =
          preferredWallet?.wallet?.symbol ||
          preferredWallet?.wallet?.currencySymbol ||
          preferredWallet?.symbol ||
          data.walletSymbol ||
          (walletName === 'INR' || walletName === 'RS'
            ? '₹'
            : walletName === 'USD'
              ? '$'
              : walletName === 'EUR'
                ? '€'
                : walletName === 'GBP'
                  ? '£'
                  : walletName === 'USDT'
                    ? '₮'
                    : walletName);

        const cash = Number(
          preferredWallet?.cash?.value ??
            (walletName ? data.balance?.[walletName] : undefined) ??
            data.balance?.cash ??
            data.cash ??
            data.balance?.INR ??
            data.INR ??
            0
        );
        const bonus = Number(
          preferredWallet?.bonus?.value ??
            data.balance?.bonus ??
            data.bonus ??
            0
        );
        const totalAmount = cash + bonus;
        const lockedBonus = Number(
          preferredWallet?.lockedBonus?.value ??
            data.balance?.lockedBonus ??
            data.lockedBonus ??
            0
        );
        const availableWithdrawalBalance =
          typeof data.availableWithdrawalBalance === 'number'
            ? Number(data.availableWithdrawalBalance)
            : Math.max(0, cash - bonus);
        const vipPoints = Number(compWallet?.cash?.value ?? data.vipPoints ?? 0);
        const playMoney = Number(playMoneyWallet?.cash?.value ?? data.playMoney ?? 0);

        this.balance = {
          ...data,
          walletName,
          walletSymbol,
          currency: walletName,
          currencySymbol: walletSymbol,
          INR: totalAmount,
          total: totalAmount,
          usd: totalAmount,
          cash: cash,
          bonus: bonus,
          lockedBonus: lockedBonus,
          availableWithdrawalBalance: availableWithdrawalBalance,
          vipPoints: vipPoints,
          playMoney: playMoney,
          preferredWallet: preferredWallet,
          values: data.values || []
        };

        // Cache balance in localStorage for instant rendering on page load
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(
            'cached_player_balance',
            JSON.stringify({
              walletName,
              walletSymbol,
              currency: walletName,
              currencySymbol: walletSymbol,
              INR: cash,
              usd: cash,
              cash: cash,
              bonus: bonus,
              lockedBonus: lockedBonus,
              availableWithdrawalBalance: availableWithdrawalBalance,
              vipPoints: vipPoints,
              playMoney: playMoney
            })
          );
        }

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
        this.handleSessionExpired({ code: 'SESSION_EXPIRED', description: 'Session expired' });
      } else {
        try {
          const clone = response.clone();
          clone
            .json()
            .then((json: any) => {
              if (json && (json.code === 'SESSION_EXPIRED' || json.description === 'Session expired')) {
                this.handleSessionExpired(json);
              }
            })
            .catch(() => {});
        } catch {}
      }
      return response;
    };
  }
}

export const authState = new AuthState();
