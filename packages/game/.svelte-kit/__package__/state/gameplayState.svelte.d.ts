declare class GameplayState {
    gameUrl: string;
    game: any;
    callbackUrl: string;
    isLaunching: boolean;
    launchGame: any;
    launchError: string;
    showErrorModal: boolean;
    savedScrollPositions: Record<string, number>;
    savedLimits: Record<string, number>;
    init(): void;
    startLaunch(game: any, currentPath?: string, scrollY?: number, displayedLimit?: number): void;
    finishLaunch(game: any, gameUrl: string, callbackUrl?: string): void;
    failLaunch(errorMessage?: string): void;
    closeLaunchModal(): void;
}
export declare const gameplayState: GameplayState;
export {};
//# sourceMappingURL=gameplayState.svelte.d.ts.map