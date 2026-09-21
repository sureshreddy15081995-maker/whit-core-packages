// src/lib/gameLauncher/urlBuilder.ts

import { environment } from '../environment.js';

function detectEncodingLevel(str: string): number {
	let level = 0;
	let temp = str;

	while (/%[0-9A-Fa-f]{2}/.test(temp)) {
		temp = decodeURIComponent(temp);
		level++;

		if (level > 5) break;
	}

	return level;
}

export function updateGameUrlLanguage(url: string, language: string = 'EN'): string {
	if (!url) return '';

	const urlObj = new URL(url);

	let key = urlObj.searchParams.get('key');

	if (!key) return url;

	const encodingLevel = detectEncodingLevel(key);

	let decoded = key;

	for (let i = 0; i < encodingLevel; i++) {
		decoded = decodeURIComponent(decoded);
	}

	decoded = decoded.replace(/language=[A-Z]{2}/i, `language=${language}`);

	for (let i = 0; i < encodingLevel; i++) {
		decoded = encodeURIComponent(decoded);
	}

	urlObj.searchParams.set('key', decoded);

	return urlObj.toString();
}

type Builder = (game: any, res: any) => string;

const HOME_URL = 'https://{{currentBrand}}/home';

/**
 * Shared EZUGI URL builder
 */
const ezugiBuilder =
	(
		operatorIdKey:
			'EZUGI_OPERATOR_ID' | 'EVO_STANDARD_OPERATOR_ID' | 'EVO_STANDARD_SLOTS_OPERATOR_ID',
		openTable: (game: any) => string
	): Builder =>
		(game, res) =>
			`${res.EZUGI_GAME_URL}` +
			`token=${res.EZUGI_TOKEN}` +
			`&operatorId=${res[operatorIdKey]}` +
			`&language=en` +
			`&clientType=html5` +
			`&openTable=${openTable(game)}` +
			`&homeUrl=${HOME_URL}`;

const builders: Record<string, Builder> = {
	pragmaticplay: (_, res) =>
		updateGameUrlLanguage(res.gameURL, (localStorage.getItem('language') || 'EN').toUpperCase()),

	redtiger: ezugiBuilder('EVO_STANDARD_SLOTS_OPERATOR_ID', (g) => g.openTable),

	netent: ezugiBuilder('EVO_STANDARD_SLOTS_OPERATOR_ID', (g) => g.openTable),

	ezugistandard: ezugiBuilder('EZUGI_OPERATOR_ID', () => ''),
	ezugi: (_, res) => res.EZUGI_GAME_LAUNCH_URL,
	evolution: ezugiBuilder('EVO_STANDARD_OPERATOR_ID', (g) => g.gameId),

	endorphina: (_, res) =>
		`https://cdn.endorphina.network/api/sessions/seamless/rest/v1` +
		`?exit=${res.exit}` +
		`&nodeId=${res.nodeId}` +
		`&token=${res.token}` +
		`&sign=${res.sign}`,

	ballagames: (game, res) =>
		`${res.url}/${game.gameName}` +
		`?gameId=${game.gameId}` +
		`&playerToken=${res.token}` +
		`&site=${environment.skinId}`,

	// 	sportstoken: (_, res) => `https://prod20278-228598233.freethrow777.com/en/spbk?api=/assets/js/btisports.js?v=2&operatorToken=${res.token}
	// `,
	sportstoken: (_, res) =>
		`https://prod20278-228598233.freethrow777.com` +
		`?api=${window.location.origin}/assets/js/btisports.js?v=2&operatorToken=${res.token}`,
	gameurl: (_, res) => res.CABALLO_LAUNCH_URL,
	luckystreak: (_, res) => res.FRESH_DECK_LAUNCH_URL,
	spribe: (_, res) => res.path,
	vivolivecasino: (game, res) =>
		res.VIVO_GAME_LAUNCH_URL.replace('selectedGame=All', `selectedGame=${game.gameName}`)
};

/**
 * Builds the final redirect URL.
 */
export function buildGameUrl(provider: string, game: any, response: any): string {
	if (!response) return '';

	const finalProvider = (game?.aggregator || game?.aggrigator || provider).toLowerCase();

	if (!response.success && response.message && finalProvider !== 'ballagames') {
		throw new Error(response.message);
	}

	const builder = builders[finalProvider];

	if (builder) {
		return builder(game, response);
	}

	return response.url || response.URL || response.IframeUrl || '';
}

