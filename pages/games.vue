<!-- eslint-disable vue/no-v-html -->
<!-- using v-html for links within descriptions -->
<template>
  <v-container fluid>
    <h2>These games were built for various game jams over the years.</h2>
    <p class="d-md-none font-italic">Click on row for more details.</p>
    <v-sheet v-if="!gameStore.loaded" class="d-flex justify-center align-center" height="300">
      <v-progress-circular
        indeterminate
        size="100"
        width="10"
        color="primary"
        bg-color="secondary"
        aria-label="Loading games..."
      />
    </v-sheet>

    <v-list lines="three" role="list">
      <div v-for="(game, index) in gameStore.games" :key="game.name" role="listitem">
        <v-list-item class="display-large-game-list-item">
          <template #prepend>
            <v-avatar>
              <v-img cover :src="game.image" :srcset="game.imageSrcSet" aria-hidden="true" />
            </v-avatar>
          </template>
          <v-list-item-title>
            {{ game.name }} - {{ game.year }}
            <a v-if="authStore.user" href="#" @click="deleteGame(game)"> Delete me </a>
          </v-list-item-title>
          <v-list-item-subtitle>
            <span v-html="game.description"></span>
          </v-list-item-subtitle>

          <template #append>
            <v-list-item-action>
              <v-btn :href="game.link" target="_blank" :aria-label="`Go to ${game.name}`">
                Go to Game!
              </v-btn>
            </v-list-item-action>
          </template>
        </v-list-item>
        <v-list-item class="d-md-none" @click="onGameClick(game)">
          <template #prepend>
            <v-avatar>
              <v-img cover :src="game.image" :srcset="game.imageSrcSet" />
            </v-avatar>
          </template>
          <v-list-item-title>{{ game.name }} - {{ game.year }}</v-list-item-title>
          <v-list-item-subtitle>{{ game.shortDescription }}</v-list-item-subtitle>
        </v-list-item>
        <v-divider
          v-if="index !== gameStore.games.length - 1"
          inset
          class="display-large-link-list-item"
        />
        <v-divider v-if="index !== gameStore.games.length - 1" class="d-md-none" />
      </div>
    </v-list>
    <add-game-section v-if="authStore.user" />
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title> {{ selectedGame.name }} - {{ selectedGame.year }}</v-card-title>
        <v-card-text>
          <span v-html="selectedGame.description"></span>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="secondary" variant="elevated" @click="dialog = false">Close Dialog</v-btn>
          <v-btn color="primary" :href="selectedGame.link" target="_blank" variant="elevated">
            Go to Game!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script setup lang="ts">
import { useAuthStore } from '~/store/authStore';
import { useGameStore } from '~/store/gameStore';
import { useStore } from '~/store/mainStore.js';
import type { GameDetails } from '~/utils/types';

const mainStore = useStore();
const authStore = useAuthStore();
const gameStore = useGameStore();

function getNewGame(): GameDetails {
  return {
    name: '',
    shortDescription: '',
    description: '',
    image: '',
    link: '',
    year: new Date().getFullYear(),
  };
}

const dialog = ref(false);
const selectedGame = ref<GameDetails>(getNewGame());

function onGameClick(game: GameDetails) {
  selectedGame.value = game;
  dialog.value = true;
}

async function deleteGame(game: GameDetails) {
  try {
    await gameStore.deleteGame(game);
  } catch (error) {
    const handledError = error instanceof Error ? error : new Error('Unexpected error');
    mainStore.setSnackbar(handledError.message);
  }
}

gameStore.init();

useHead({
  title: 'Games!',
});
</script>
<style scoped lang="scss">
// wanted to use grid breakpoints... but it isn't easy
$md-max-width: 960px;

@media screen and (max-width: $md-max-width) {
  .display-large-game-list-item {
    display: none;
  }
}
</style>
