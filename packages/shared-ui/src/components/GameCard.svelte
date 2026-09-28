<!-- @common/shared-ui/src/components/GameCard.svelte -->
<script lang="ts">
  interface Props {
    game: any;
    onclick?: (game: any) => void;
    onfavorite?: (game: any) => void;
    isFavorite?: boolean;
    providerIcon?: string;
    showProvider?: boolean;
    showBadge?: boolean;
  }

  let {
    game,
    onclick,
    onfavorite,
    isFavorite = false,
    providerIcon = '',
    showProvider = true,
    showBadge = true
  }: Props = $props();

  let isLoaded = $state(false);

  const gameTitle = $derived(game?.gameName || game?.name || 'Play Game');
  const gameImg = $derived(
    game?.gameImage ||
    game?.tn_230px ||
    game?.tn_149px ||
    game?.media ||
    game?.image ||
    '/assets/game-default.png'
  );
  const providerName = $derived(
    (game?.provider || '').replace(/(gv|hd)$/i, '').trim()
  );
  const isPopular = $derived(game?.isPopular || (gameTitle.length % 4 === 0));
  const isNew = $derived(game?.isNew || (gameTitle.length % 5 === 0));

  function handleClick() {
    onclick?.(game);
  }

  function handleFavoriteClick(e: MouseEvent) {
    e.stopPropagation();
    onfavorite?.(game);
  }
</script>

<div
  class="common-game-card"
  role="button"
  tabindex="0"
  onclick={handleClick}
  onkeydown={(e) => e.key === 'Enter' && handleClick()}
  title={gameTitle}
>
  <div class="card-image-box">
    <img
      src={gameImg}
      alt={gameTitle}
      loading="lazy"
      decoding="async"
      class="game-thumbnail"
      class:loaded={isLoaded}
      onload={() => (isLoaded = true)}
    />

    {#if showBadge}
      {#if isPopular}
        <span class="badge badge-popular">POPULAR</span>
      {:else if isNew}
        <span class="badge badge-new">NEW</span>
      {/if}
    {/if}

    <button
      type="button"
      class="fav-btn"
      class:active={isFavorite}
      aria-label="Toggle Favorite"
      onclick={handleFavoriteClick}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavorite ? "var(--theme-danger, #ef4444)" : "none"} stroke="currentColor" stroke-width="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    </button>

    <div class="hover-overlay">
      <div class="play-icon-circle">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      </div>
      <span class="play-text">PLAY NOW</span>
    </div>
  </div>

  <div class="card-info">
    <span class="game-name">{gameTitle}</span>
    {#if showProvider && providerName}
      <div class="provider-row">
        {#if providerIcon}
          <img src={providerIcon} alt="" class="provider-icon" />
        {/if}
        <span class="provider-name">{providerName}</span>
      </div>
    {/if}
  </div>
</div>

<style>
  .common-game-card {
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: var(--theme-card-bg, #1e293b);
    border: 1px solid var(--theme-card-border, rgba(255, 255, 255, 0.08));
    border-radius: var(--theme-radius-md, 10px);
    overflow: hidden;
    cursor: pointer;
    transition: transform var(--theme-transition, 0.2s), box-shadow var(--theme-transition, 0.2s), border-color var(--theme-transition, 0.2s);
    user-select: none;
    outline: none;
    box-shadow: var(--theme-shadow-sm, 0 1px 2px rgba(0,0,0,0.25));
  }

  .common-game-card:hover, .common-game-card:focus-visible {
    transform: translateY(-4px);
    border-color: var(--theme-primary, #f59e0b);
    box-shadow: var(--theme-shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.5));
  }

  .card-image-box {
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: #0b0f19;
  }

  .game-thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .game-thumbnail.loaded {
    opacity: 1;
  }

  .common-game-card:hover .game-thumbnail {
    transform: scale(1.08);
  }

  .badge {
    position: absolute;
    top: 8px;
    left: 8px;
    padding: 2px 8px;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    border-radius: var(--theme-radius-sm, 4px);
    z-index: 2;
  }

  .badge-popular {
    background: linear-gradient(135deg, #ef4444, #f97316);
    color: #ffffff;
  }

  .badge-new {
    background: linear-gradient(135deg, #10b981, #06b6d4);
    color: #ffffff;
  }

  .fav-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.5);
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    cursor: pointer;
    z-index: 3;
    transition: background 0.2s, transform 0.15s;
  }

  .fav-btn:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: scale(1.1);
  }

  .fav-btn.active {
    color: var(--theme-danger, #ef4444);
  }

  .hover-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    z-index: 2;
  }

  .common-game-card:hover .hover-overlay {
    opacity: 1;
  }

  .play-icon-circle {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--theme-primary, #f59e0b);
    color: var(--theme-primary-text, #000000);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 15px rgba(245, 158, 11, 0.6);
  }

  .play-text {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 1px;
    color: #ffffff;
  }

  .card-info {
    padding: 8px 10px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .game-name {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--theme-text-primary, #f8fafc);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .provider-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .provider-icon {
    width: 14px;
    height: 14px;
    object-fit: contain;
  }

  .provider-name {
    font-size: 0.72rem;
    color: var(--theme-text-secondary, #94a3b8);
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
