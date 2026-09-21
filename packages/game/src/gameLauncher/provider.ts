import type { Game, ProviderConfig } from './types.js';
// src/lib/gameLauncher/providers.ts





const SESSION = () => localStorage.getItem("bet_wSession") || "";

const DEFAULT_GAME_BODY = (game: Game) => ({
  gameId: game.gameId,
  provider: game.provider || game.aggregator || game.gameProvider,
});

const SIMPLE_GAME_BODY = (game: Game) => ({
  gameId: game.gameId,
});
const SBO_SPORTSBOOK_GAME_HUIDU = (game: Game) => ({
  gameId: game.gameId,
  provider: game.provider
});


const GV_BODY = (game: Game) => ({
  gameId: game.gameId,
  provider: game.provider,
  language: "en",
});

const EZUGI_SESSION_PROVIDER: ProviderConfig = {
  endpoint: "/rest/ezugi/session",
  method: "GET",
  path: () => `/${SESSION()}`,
};

const DEFAULT_POST = (endpoint: string): ProviderConfig => ({
  endpoint,
  method: "POST",
  body: DEFAULT_GAME_BODY,
});

const GV_PROVIDER = (): ProviderConfig => ({
  endpoint: "/rest/gv/request/launchGame",
  method: "POST",
  body: GV_BODY,
});

const HD_PROVIDER = (endpoint = ""): ProviderConfig => ({
  endpoint,
  method: "POST",
  body: DEFAULT_GAME_BODY,
});

export const providers: Record<string, ProviderConfig> = {

  pragmaticplay: {
    endpoint: "/rest/pp/ppToken1",
    method: "POST",
    path: (game) => `/${game.gameId || game.tableId}`,
  },

  rubyplay: { endpoint: "/rest/ruby_play/launch", method: "POST", headers: (game: Game) => ({ gameId: game.gameId || '' }), },
  aviatrix: DEFAULT_POST("/rest/aviatrix/launchGame"),
  cpgames: DEFAULT_POST("/rest/cpg/balance/launchGame"),
  barbarabanga: DEFAULT_POST("/rest/barbara/launchGame"),

  mancala: {
    endpoint: "/rest/mancala/getToken",
    method: "POST",
    path: (game) => `/${game.gameId}`,
  },

  ezugi: EZUGI_SESSION_PROVIDER,
  ezugistandard: EZUGI_SESSION_PROVIDER,
  evolution: EZUGI_SESSION_PROVIDER,
  redtiger: EZUGI_SESSION_PROVIDER,
  netent: EZUGI_SESSION_PROVIDER,

  habanero: {
    endpoint: "/rest/habanero/session",
    method: "GET",
    path: (game) => `/${SESSION()}/${game.gameId}`,
  },

  vibra: { endpoint: "/rest/vibra/launch", method: "POST" },

  endorphina: {
    endpoint: "/rest/endorphina/endorphinaUrl",
    method: "GET",
    path: (game) => `/${SESSION()}/${game.gameId}`,
  },

  vivo: {
    endpoint: "/api/playVivo/handler/vivo",
    method: "GET",
    path: (game) => `/${game.provider}/${game.gameId}/en`,
  },

  vivogaming: {
    endpoint: "/api/playVivo/handler/vivo",
    method: "GET",
    path: (game) => `/${game.provider}/${game.gameId}/en`,
  },

  vivogamelaunch: {
    endpoint: "/api/Vivo/handler",
    method: "GET",
    path: (game) => `/${game.provider}/${game.gameId}/en`,
  },

  vivolivecasino: {
    endpoint: "/rest/vivo/balance_integration/vivoGaming",
    method: "GET",
  },

  sportstoken: {
    endpoint: "/rest/bti/btiToken",
    method: "GET",
    path: () => `/${SESSION()}`,
  },

  gameurl: {
    endpoint: "/rest/caballonegro",
    method: "GET",
    path: () => {
      const s = SESSION();
      return `/${s}/${s ? false : true}`;
    },
  },

  popokgaming: DEFAULT_POST("/rest/popokgaming/launchGame"),

  popokgaminglivecasino: {
    endpoint: "/rest/popokgaming/launchGame",
    method: "POST",
    body: (game) => ({
      gameId: game.gameId,
      provider: game.aggregator,
    }),
  },

  spincraft: DEFAULT_POST("/rest/spincraft/launchGame"),
  kagaming: DEFAULT_POST("/rest/kagaming/launchGame"),

  instantplay: {
    endpoint: "/rest/api/gad/gameLaunchUrl/XYZ",
    method: "POST",
  },

  playnetic: DEFAULT_POST("/rest/playnetic/request/launchGame"),
  playson: DEFAULT_POST("/rest/infingame/launchGame"),
  redrake: DEFAULT_POST("/rest/redrake/launchGame"),
  zenith: DEFAULT_POST("/rest/zenith/launchGame"),
  flexplay: DEFAULT_POST("/rest/flexplay/launchGame"),
  aviator: DEFAULT_POST("/rest/aviator/launchGame"),

  ballagames: {
    endpoint: "/rest/indiCasino/api/handler",
    method: "GET",
    path: () => `/${SESSION()}`,
  },

  kingmidas: {
    endpoint: "/rest/kingmidas/launchGame",
    method: "POST",
    body: DEFAULT_GAME_BODY,
    headers: () => ({ lang: "en-US" }),
  },

  sagaming: { endpoint: "/rest/sagaming/launchGame", method: "POST" },
  simpleplay: DEFAULT_POST("/rest/simpleplay/launchGame"),
  ayuniqa: DEFAULT_POST("/rest/ayuniqa/launchGame"),
  rtg: DEFAULT_POST("/rest/rtg/launchGame"),

  gv: GV_PROVIDER(),
  netentgv: GV_PROVIDER(),
  evolutiongv: GV_PROVIDER(),
  ezugigv: GV_PROVIDER(),
  nolimitcitygv: GV_PROVIDER(),
  playtechgv: GV_PROVIDER(),
  redtigergv: GV_PROVIDER(),

  jilli: {
    endpoint: "/rest/jilli/launchGame",
    method: "POST",
    body: SIMPLE_GAME_BODY,
  },

  jilliprovider: {
    endpoint: "/rest/jilli/launchGame",
    method: "POST",
    body: SIMPLE_GAME_BODY,
  },

  wearelotto: {
    endpoint: "/rest/wearelotto/launchGame",
    method: "POST",
    body: SIMPLE_GAME_BODY,
  },

  "18peaches": {
    endpoint: "/rest/onegamehub/launchGame",
    method: "POST",
    body: SIMPLE_GAME_BODY,
  },

  huidu: DEFAULT_POST("/rest/huidu/launchGame"),

  "9wicket": {
    endpoint: "/rest/huidu/9wkt/launchGame",
    method: "POST",
    body: SBO_SPORTSBOOK_GAME_HUIDU,
  },

  closegamesession: {
    endpoint: "/api/player/closeSession",
    method: "POST",
  },

  gtf: {
    endpoint: "",
    method: "POST",
    headers: (game) => ({
      MType: String(game.openTable ?? ""),
      GType: String(game.gameId ?? ""),
    }),
  },

  spribe: {
    endpoint: "/rest/jdb/gameLaunch",
    method: "POST",
    headers: (game) => ({
      MType: String(game.openTable ?? ""),
      GType: String(game.gameId ?? ""),
    }),
  },

  jdb: {
    endpoint: "",
    method: "POST",
    headers: (game) => ({
      MType: String(game.openTable ?? ""),
      GType: String(game.gameId ?? ""),
    }),
  },

  btihd: HD_PROVIDER(),
  sexy: HD_PROVIDER(),
  smartsofthd: HD_PROVIDER(),
  pragmaticplayhd: HD_PROVIDER(),
  pragmaticplaylivecasinohd: HD_PROVIDER(),
  mac88: HD_PROVIDER(),
  pgsofthd: HD_PROVIDER(),
  rubyplayhd: HD_PROVIDER(),
  redtigerhd: HD_PROVIDER(),
  evoplayhd: HD_PROVIDER(),
  sportsplatform: {
    endpoint: "/rest/sportsBet/launchGame",
    method: "POST",
    body: () => ({
      gameId: "96",
      provider: "Sportsplatform",
    }),
  },
  luckystreak: {
    endpoint: "/api/Vivo/freshDeck/handler",
    method: "GET",
  },
};


