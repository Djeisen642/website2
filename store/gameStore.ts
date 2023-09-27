import type { QuerySnapshot } from 'firebase/firestore';
import { deleteDoc, doc, onSnapshot, query, setDoc } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { v5 as uuidV5 } from 'uuid';

import { useNuxtApp } from '#app';

import { UUID_NAMESPACE } from '~/utils/constants';
import type { GameDetails } from '~/utils/types';

const nuxtApp = useNuxtApp();

export type GameStoreState = {
  games: Array<GameDetails>;
  loaded: boolean;
};

export const useGameStore = defineStore('games', {
  state: (): GameStoreState => ({
    games: [],
    loaded: false,
  }),
  actions: {
    _handleSnapshot(querySnapshot: QuerySnapshot<GameDetails>) {
      const games: Array<GameDetails> = [];

      for (const doc of querySnapshot.docs) {
        games.push(doc.data());
      }
      this.games = games.sort((a, b) => a.year - b.year);
      this.loaded = true;
    },

    init() {
      onSnapshot(query(nuxtApp.$collections.games), querySnapshot => {
        this._handleSnapshot(querySnapshot);
      });
    },

    async addGame(newGame: GameDetails) {
      try {
        await setDoc(
          doc(nuxtApp.$collections.games, uuidV5(newGame.name, UUID_NAMESPACE)),
          newGame,
        );
      } catch (error) {
        const handledError = error instanceof Error ? error : new Error('Unexpected error');
        nuxtApp.$logError(handledError);
        throw handledError;
      }
    },

    async deleteGame(game: GameDetails) {
      try {
        await deleteDoc(doc(nuxtApp.$collections.games, uuidV5(game.name, UUID_NAMESPACE)));
      } catch (error) {
        const handledError = error instanceof Error ? error : new Error('Unexpected error');
        nuxtApp.$logError(handledError);
      }
    },
  },
});
