// @common/game/src/repository/capiRepository.svelte.ts
import { environment } from '../environment.js';

export function hasCategory(categoryField: any, target: string): boolean {
  if (!categoryField) return false;
  const match = target.toLowerCase().trim();
  if (Array.isArray(categoryField)) {
    return categoryField.some((c) => {
      if (typeof c === 'string') {
        const str = c.toLowerCase().trim();
        return str === match || str.startsWith(`${match}_`);
      }
      return false;
    });
  }
  if (typeof categoryField === 'string') {
    const str = categoryField.toLowerCase().trim();
    return str === match || str.startsWith(`${match}_`);
  }
  return false;
}

export function isIndianGame(game: any): boolean {
  if (!game) return false;
  if (
    hasCategory(game.category, 'indian-games') ||
    hasCategory(game.category, 'indian_games') ||
    hasCategory(game.category, 'indiangames') ||
    hasCategory(game.category, 'indian') ||
    hasCategory(game.tags, 'indian-games') ||
    hasCategory(game.tags, 'indian_games') ||
    hasCategory(game.tags, 'indiangames') ||
    hasCategory(game.tags, 'indian')
  ) {
    return true;
  }
  const name = (game.gameName || game.name || '').toLowerCase();
  return (
    name.includes('teen patti') ||
    name.includes('teenpatti') ||
    name.includes('andar bahar') ||
    name.includes('andarbahar') ||
    name.includes('jhandi munda') ||
    name.includes('rummy')
  );
}

class CapiRepository {
  banners = $state<any[]>([]);
  providers = $state<any[]>([]);
  games = $state<any[]>([]);
  promotionalGames = $state<any[]>([]);
  providerIconsMap = $state<Record<string, string>>({});
  isLoading = $state(false);

  async fetchHomeBanners(siteId?: string) {
    try {
      const res = await fetch(`${environment.baseUrl}/capi/home-banners`, {
        headers: { 'Content-Type': 'application/json', 'siteId': siteId || '' }
      });
      if (res.ok) {
        this.banners = await res.json();
      }
    } catch (e) {}
    return this.banners;
  }

  async fetchProviders(siteId?: string) {
    try {
      const res = await fetch(`${environment.baseUrl}/capi/providers`, {
        headers: { 'Content-Type': 'application/json', 'siteId': siteId || '' }
      });
      if (res.ok) {
        this.providers = await res.json();
        const map: Record<string, string> = {};
        for (const p of this.providers) {
          if (p.providerKey && p.icon) {
            map[p.providerKey.toLowerCase().trim()] = p.icon;
          }
        }
        this.providerIconsMap = map;
      }
    } catch (e) {}
    return this.providers;
  }

  async fetchGamesAll(siteId?: string) {
    this.isLoading = true;
    try {
      const res = await fetch(`${environment.baseUrl}/capi/games/all`, {
        headers: { 'Content-Type': 'application/json', 'siteId': siteId || '' }
      });
      if (res.ok) {
        this.games = await res.json();
      }
    } catch (e) {
    } finally {
      this.isLoading = false;
    }
    return this.games;
  }
}

export const capiRepository = new CapiRepository();
