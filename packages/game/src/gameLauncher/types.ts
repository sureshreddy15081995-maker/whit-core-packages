// src/lib/gameLauncher/types.ts

export type HttpMethod = "GET" | "POST";

export interface Game {
    gameId?: string;
    tableId?: string;
    gameName?: string;
    provider?: string;
    aggregator?: string;
    aggrigator?: string; // backward compatibility
    gameProvider?: string;
    openTable?: string;
    mtype?: string;
    gtype?: string;

    [key: string]: any;
}

export interface LaunchResponse {
    success?: boolean;
    message?: string;

    url?: string;
    URL?: string;
    IframeUrl?: string;
    gameURL?: string;

    token?: string;
    sign?: string;
    nodeId?: string;
    exit?: string;

    EZUGI_GAME_URL?: string;
    EZUGI_TOKEN?: string;

    EVO_STANDARD_OPERATOR_ID?: string;
    EVO_STANDARD_SLOTS_OPERATOR_ID?: string;
    EZUGI_OPERATOR_ID?: string;

    CABALLO_LAUNCH_URL?: string;
    BTI_LAUNCH_URL?: string;

    [key: string]: any;
}

export interface ProviderConfig {
    endpoint: string;

    method: HttpMethod;

    /**
     * Additional path appended to the endpoint.
     * Example: /12345
     */
    path?: (game: Game) => string;

    /**
     * POST body builder.
     */
    body?: (game: Game) => Record<string, any>;

    /**
     * Dynamic request headers.
     */
    headers?: (game: Game) => Record<string, string>;
}

export interface LaunchOptions {
    /**
     * Optional API base URL.
     * Example:
     * https://api.example.com
     */
    baseUrl?: string;

    /**
     * Custom fetch implementation.
     * Useful for SvelteKit server-side rendering or testing.
     */
    fetcher?: typeof fetch;
}

export type UrlBuilder = (
    game: Game,
    response: LaunchResponse
) => string;