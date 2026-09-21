// src/lib/gameLauncher/launch.ts

import { environment } from '../environment.js';
import { providers } from './provider.js';
import type { Game } from './types.js';
import { buildGameUrl } from './urlbuilder.js';

export async function launchGame(
	game: Game,
	options?: {
		baseUrl?: string;
		fetcher?: typeof fetch;
	}
): Promise<string> {
	if (!game) {
		throw new Error('Game object is required.');
	}

	const provider = (
		game.aggregator ||
		game.aggrigator || // backward compatibility
		game.provider ||
		''
	).toLowerCase();

	const config = providers[provider];

	if (!config) {
		throw new Error(`Unsupported provider: ${provider}`);
	}

	const fetcher = options?.fetcher ?? fetch;
	const baseUrl = options?.baseUrl ?? '';

	const endpoint = baseUrl + config.endpoint + (config.path ? config.path(game) : '');

	const method = config.method;

	const headers: HeadersInit = {
		'Content-Type': 'application/json',
		siteId: environment.skinId,
		Wsession: localStorage.getItem('bet_wSession') ?? '',
		...(config.headers ? config.headers(game) : {})
	};

	const body = method === 'POST' ? JSON.stringify(config.body ? config.body(game) : {}) : undefined;

	const response = await fetcher(endpoint, {
		method,
		headers,
		body
	});

	if (!response.ok) {
		throw new Error(`Launch request failed (${response.status})`);
	}

	const result = await response.json();

	return buildGameUrl(provider, game, result);
}


