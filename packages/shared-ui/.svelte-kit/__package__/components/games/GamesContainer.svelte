<!-- @common/shared-ui/src/components/games/GamesContainer.svelte -->
<script lang="ts">
  import GameCard from '../GameCard.svelte';
  import GameCardSkeleton from '../GameCardSkeleton.svelte';

  interface Category {
    id: string;
    name: string;
    icon?: string;
  }

  interface Props {
    games?: any[];
    categories?: Category[];
    selectedCategory?: string;
    selectedProvider?: string;
    providers?: string[];
    isLoading?: boolean;
    favorites?: Set<string>;
    ongameclick?: (game: any) => void;
    onfavoriteclick?: (game: any) => void;
    oncategorychange?: (category: string) => void;
    onproviderchange?: (provider: string) => void;
  }

  let {
    games = [],
    categories = [
      { id: 'all', name: 'All Games' },
      { id: 'slots', name: 'Slots' },
      { id: 'live-casino', name: 'Live Casino' },
      { id: 'crash', name: 'Crash & Aviator' },
      { id: 'table', name: 'Table Games' },
      { id: 'indian', name: 'Indian Games' }
    ],
    selectedCategory = 'all',
    selectedProvider = 'all',
    providers = [],
    isLoading = false,
    favorites = new Set(),
    ongameclick,
    onfavoriteclick,
    oncategorychange,
    onproviderchange
  }: Props = $props();

  let searchQuery = $state('');

  const filteredGames = $derived.by(() => {
    let list = games;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((g) => {
        const name = (g.gameName || g.name || '').toLowerCase();
        const prov = (g.provider || '').toLowerCase();
        return name.includes(q) || prov.includes(q);
      });
    }

    if (selectedProvider && selectedProvider !== 'all') {
      const p = selectedProvider.toLowerCase();
      list = list.filter((g) => (g.provider || '').toLowerCase().includes(p));
    }

    return list;
  });
</script>

<div class="games-container-wrapper">
  <!-- Controls Bar: Category tabs + Search + Provider Filter -->
  <div class="controls-bar">
    <div class="categories-scroll">
      {#each categories as cat}
        <button
          type="button"
          class="category-chip"
          class:active={selectedCategory === cat.id}
          onclick={() => oncategorychange?.(cat.id)}
        >
          {#if cat.icon}
            <span class="cat-icon">{cat.icon}</span>
          {/if}
          <span>{cat.name}</span>
        </button>
      {/each}
    </div>

    <div class="filter-actions">
      <!-- Search Input -->
      <div class="search-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search games..."
        />
        {#if searchQuery}
          <button type="button" class="clear-search" onclick={() => (searchQuery = '')}>&times;</button>
        {/if}
      </div>

      <!-- Provider Selector -->
      {#if providers && providers.length > 0}
        <select
          class="provider-dropdown"
          value={selectedProvider}
          onchange={(e) => onproviderchange?.((e.target as HTMLSelectElement).value)}
        >
          <option value="all">All Providers</option>
          {#each providers as prov}
            <option value={prov}>{prov}</option>
          {/each}
        </select>
      {/if}
    </div>
  </div>

  <!-- Games Grid -->
  {#if isLoading}
    <div class="games-grid">
      <GameCardSkeleton count={12} />
    </div>
  {:else if filteredGames.length > 0}
    <div class="games-grid">
      {#each filteredGames as game (game.gameId || game.entryId || game.id || game.gameName)}
        <GameCard
          {game}
          isFavorite={favorites.has(game.gameId || game.id)}
          onclick={ongameclick}
          onfavorite={onfavoriteclick}
        />
      {/each}
    </div>
  {:else}
    <div class="empty-state">
      <div class="empty-icon">🎮</div>
      <h3>No Games Found</h3>
      <p>Try searching for a different keyword or choosing another category.</p>
      {#if searchQuery}
        <button class="btn-clear" onclick={() => (searchQuery = '')}>Clear Search</button>
      {/if}
    </div>
  {/if}
</div>

<style>
  .games-container-wrapper {
    display: flex;
    flex-direction: column;
    gap: 18px;
    width: 100%;
  }

  .controls-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .categories-scroll {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 4px;
    scrollbar-width: none;
  }

  .categories-scroll::-webkit-scrollbar {
    display: none;
  }

  .category-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: var(--theme-radius-full, 9999px);
    color: #cbd5e1;
    font-size: 0.84rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;
  }

  .category-chip:hover {
    background: #273549;
    color: #ffffff;
  }

  .category-chip.active {
    background: var(--theme-primary, #f59e0b);
    color: var(--theme-primary-text, #000000);
    border-color: var(--theme-primary, #f59e0b);
  }

  .filter-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .search-box {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-icon {
    position: absolute;
    left: 12px;
    color: var(--theme-text-muted, #64748b);
  }

  .search-box input {
    padding: 8px 30px 8px 34px;
    background: #0f172a;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: var(--theme-radius-full, 9999px);
    color: #f8fafc;
    font-size: 0.85rem;
    width: 180px;
    transition: width 0.2s;
  }

  .search-box input:focus {
    outline: none;
    border-color: var(--theme-primary, #f59e0b);
    width: 220px;
  }

  .clear-search {
    position: absolute;
    right: 10px;
    background: none;
    border: none;
    color: #94a3b8;
    font-size: 1.1rem;
    cursor: pointer;
  }

  .provider-dropdown {
    padding: 8px 12px;
    background: #0f172a;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: var(--theme-radius-full, 9999px);
    color: #f8fafc;
    font-size: 0.85rem;
  }

  .games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }

  @media (min-width: 768px) {
    .games-grid {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 18px;
    }
  }

  .empty-state {
    padding: 60px 20px;
    text-align: center;
    background: #1e293b;
    border-radius: var(--theme-radius-lg, 16px);
    color: var(--theme-text-secondary, #94a3b8);
  }

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 12px;
  }

  .empty-state h3 {
    color: #f8fafc;
    margin: 0 0 6px 0;
  }

  .btn-clear {
    margin-top: 14px;
    padding: 8px 20px;
    background: var(--theme-primary, #f59e0b);
    color: var(--theme-primary-text, #000000);
    border: none;
    border-radius: var(--theme-radius-md, 8px);
    font-weight: 700;
    cursor: pointer;
  }
</style>
