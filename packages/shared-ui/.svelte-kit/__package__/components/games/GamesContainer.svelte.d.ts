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
declare const GamesContainer: import("svelte").Component<Props, {}, "">;
type GamesContainer = ReturnType<typeof GamesContainer>;
export default GamesContainer;
//# sourceMappingURL=GamesContainer.svelte.d.ts.map