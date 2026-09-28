// @common/game/src/state/gameplayState.svelte.ts

class GameplayState {
  gameUrl = $state<string | null>(null);
  game = $state<any | null>(null);
  callbackUrl = $state<string | null>(null);

  // Launching & Error Modal states
  isLaunching = $state(false);
  launchGame = $state<any | null>(null);
  launchError = $state<string | null>(null);
  showErrorModal = $state(false);

  // Scroll retention
  savedScrollPositions = $state<Record<string, number>>({});
  savedLimits = $state<Record<string, number>>({});

  init() {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('saved_scroll_positions');
        if (saved) this.savedScrollPositions = JSON.parse(saved);
      } catch (e) {}
    }
  }

  startLaunch(game: any, currentPath = '', scrollY = 0, displayedLimit?: number) {
    this.isLaunching = true;
    this.launchGame = game;
    this.launchError = null;
    this.showErrorModal = false;
    if (currentPath && typeof window !== 'undefined') {
      this.savedScrollPositions[currentPath] = scrollY;
      if (displayedLimit) this.savedLimits[currentPath] = displayedLimit;
      try {
        sessionStorage.setItem('saved_scroll_positions', JSON.stringify(this.savedScrollPositions));
      } catch (e) {}
    }
  }

  finishLaunch(game: any, gameUrl: string, callbackUrl = '') {
    this.game = game;
    this.gameUrl = gameUrl;
    this.callbackUrl = callbackUrl;
    this.isLaunching = false;
    this.showErrorModal = false;
    this.launchError = null;
  }

  failLaunch(errorMessage?: string) {
    this.isLaunching = false;
    this.launchError = errorMessage || 'Failed to launch the game. Please try again later.';
    this.showErrorModal = true;
  }

  closeLaunchModal() {
    this.isLaunching = false;
    this.showErrorModal = false;
    this.launchError = null;
    this.launchGame = null;
    this.gameUrl = null;
    this.game = null;
  }
}

export const gameplayState = new GameplayState();
