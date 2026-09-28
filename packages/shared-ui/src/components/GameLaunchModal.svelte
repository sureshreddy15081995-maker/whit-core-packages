<!-- @common/shared-ui/src/components/GameLaunchModal.svelte -->
<script lang="ts">
  interface Props {
    isOpen?: boolean;
    gameTitle?: string;
    gameUrl?: string | null;
    provider?: string;
    isLoading?: boolean;
    errorMessage?: string | null;
    onclose?: () => void;
    onreload?: () => void;
  }

  let {
    isOpen = false,
    gameTitle = 'Game',
    gameUrl = null,
    provider = '',
    isLoading = false,
    errorMessage = null,
    onclose,
    onreload
  }: Props = $props();

  let isFullscreen = $state(false);
  let containerRef = $state<HTMLDivElement | null>(null);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      containerRef?.requestFullscreen?.().catch(() => {});
      isFullscreen = true;
    } else {
      document.exitFullscreen?.().catch(() => {});
      isFullscreen = false;
    }
  }

  function handleClose() {
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
    onclose?.();
  }
</script>

{#if isOpen}
  <div class="game-launch-overlay" bind:this={containerRef}>
    <!-- Top Action Bar -->
    <header class="game-top-bar">
      <div class="game-meta">
        <h2 class="title">{gameTitle}</h2>
        {#if provider}
          <span class="provider-tag">{provider}</span>
        {/if}
      </div>

      <div class="actions">
        {#if onreload}
          <button class="action-btn" onclick={onreload} title="Reload Game" aria-label="Reload Game">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
            </svg>
          </button>
        {/if}

        <button class="action-btn" onclick={toggleFullscreen} title="Toggle Fullscreen" aria-label="Toggle Fullscreen">
          {#if isFullscreen}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
            </svg>
          {:else}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
          {/if}
        </button>

        <button class="action-btn close-btn" onclick={handleClose} title="Close Game" aria-label="Close Game">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </header>

    <!-- Game Content Area -->
    <div class="iframe-container">
      {#if isLoading}
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Launching {gameTitle}...</p>
        </div>
      {:else if errorMessage}
        <div class="error-state">
          <div class="error-icon">!</div>
          <h3>Failed to Launch Game</h3>
          <p>{errorMessage}</p>
          <button class="btn-retry" onclick={onreload}>Retry</button>
        </div>
      {:else if gameUrl}
        <iframe
          src={gameUrl}
          title={gameTitle}
          class="game-iframe"
          allow="autoplay; fullscreen; screen-wake-lock; orientation"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        ></iframe>
      {/if}
    </div>
  </div>
{/if}

<style>
  .game-launch-overlay {
    position: fixed;
    inset: 0;
    z-index: 100000;
    background: #000000;
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
  }

  .game-top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    background: #0f172a;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    height: 52px;
    flex-shrink: 0;
  }

  .game-meta {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .title {
    font-size: 1rem;
    font-weight: 700;
    color: #f8fafc;
    margin: 0;
  }

  .provider-tag {
    font-size: 0.72rem;
    padding: 2px 8px;
    background: rgba(255, 255, 255, 0.1);
    color: #94a3b8;
    border-radius: 4px;
    text-transform: uppercase;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .action-btn {
    background: rgba(255, 255, 255, 0.08);
    border: none;
    color: #f8fafc;
    width: 36px;
    height: 36px;
    border-radius: var(--theme-radius-sm, 6px);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s;
  }

  .action-btn:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .action-btn.close-btn:hover {
    background: var(--theme-danger, #ef4444);
  }

  .iframe-container {
    flex: 1;
    position: relative;
    width: 100%;
    height: calc(100% - 52px);
    overflow: hidden;
  }

  .game-iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }

  .loading-state, .error-state {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    color: #f8fafc;
    background: #020617;
  }

  .spinner {
    width: 44px;
    height: 44px;
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-top-color: var(--theme-primary, #f59e0b);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .error-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--theme-danger, #ef4444);
    color: #ffffff;
    font-size: 1.8rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-retry {
    padding: 8px 24px;
    border-radius: var(--theme-radius-md, 8px);
    background: var(--theme-primary, #f59e0b);
    color: var(--theme-primary-text, #000000);
    border: none;
    font-weight: 700;
    cursor: pointer;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
