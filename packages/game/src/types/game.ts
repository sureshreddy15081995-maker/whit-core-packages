export interface Provider {
    id: number;
    name: string;
    documentId?: string;
    icon?: string;
    logo?: string;
    displayName?: string;
    launchType?: string;
    gameId?: string;
    providerType: 'Games' | 'Live Casino' | string;
    status?: boolean;
}

export interface AgentProvider {
    name: string;
}

export interface Game {
    id?: string | number;
    gameId?: string;
    gameName?: string;
    title?: string;
    provider: string;
    category?: string[];
    tags?: string[];
    [key: string]: any;
}

export interface RepositoryQuery {
    provider?: string;
    category?: string;
    providerType?: string;
}

export interface RepositoryState {
    initialized: boolean;
    providers: Provider[];
    gamesCount: number;
}
