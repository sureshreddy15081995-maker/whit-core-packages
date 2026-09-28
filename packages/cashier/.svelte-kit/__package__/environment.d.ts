export interface EnvironmentConfig {
    production: boolean;
    baseUrl: string;
    skinId: string;
    Domain: string;
    api: {
        player: Record<string, string>;
        cashier: Record<string, string>;
        games: Record<string, string>;
        history: Record<string, string>;
        sports: Record<string, string>;
        [key: string]: any;
    };
    cmsUrl?: string;
    [key: string]: any;
}
export declare const defaultEnvironment: EnvironmentConfig;
export declare const environment: EnvironmentConfig;
export declare function setAppEnvironment(config: Partial<EnvironmentConfig>): void;
export declare function getCmsUrl(): string;
//# sourceMappingURL=environment.d.ts.map