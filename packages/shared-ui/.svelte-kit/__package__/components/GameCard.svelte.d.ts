interface Props {
    game: any;
    onclick?: (game: any) => void;
    onfavorite?: (game: any) => void;
    isFavorite?: boolean;
    providerIcon?: string;
    showProvider?: boolean;
    showBadge?: boolean;
}
declare const GameCard: import("svelte").Component<Props, {}, "">;
type GameCard = ReturnType<typeof GameCard>;
export default GameCard;
//# sourceMappingURL=GameCard.svelte.d.ts.map