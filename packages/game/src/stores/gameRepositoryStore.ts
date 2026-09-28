import { gameRepository } from '../repository/gameRepository.js';

export const gameRepositoryState = gameRepository.stateStore;

export function initializeGameRepository() {
    return gameRepository.initialize();
}

