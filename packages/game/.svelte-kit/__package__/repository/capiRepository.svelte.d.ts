export declare function hasCategory(categoryField: any, target: string): boolean;
export declare function isIndianGame(game: any): boolean;
declare class CapiRepository {
    banners: any[];
    providers: any[];
    games: any[];
    promotionalGames: any[];
    providerIconsMap: Record<string, string>;
    isLoading: boolean;
    fetchHomeBanners(siteId?: string): Promise<any[]>;
    fetchProviders(siteId?: string): Promise<any[]>;
    fetchGamesAll(siteId?: string): Promise<any[]>;
}
export declare const capiRepository: CapiRepository;
export {};
//# sourceMappingURL=capiRepository.svelte.d.ts.map