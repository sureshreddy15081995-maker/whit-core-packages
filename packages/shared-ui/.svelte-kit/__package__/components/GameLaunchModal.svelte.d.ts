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
declare const GameLaunchModal: import("svelte").Component<Props, {}, "">;
type GameLaunchModal = ReturnType<typeof GameLaunchModal>;
export default GameLaunchModal;
//# sourceMappingURL=GameLaunchModal.svelte.d.ts.map