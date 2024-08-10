<template>
  <v-card>
    <v-card-title>Add New Game!</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="newGame.name"
        label="Name"
      />
      <v-text-field
        v-model="newGame.shortDescription"
        label="Short Description"
      />
      <v-textarea
        v-model="newGame.description"
        label="Description"
        auto-grow
        counter
        rows="1"
      />
      <v-text-field
        v-model="newGame.image"
        label="Image"
      />
      <v-text-field
        v-model="newGame.link"
        label="URL"
      />
      <v-text-field
        v-model="newGame.year"
        label="Year"
        type="number"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="primary"
        variant="elevated"
        :disabled="addingGame"
        @click="addGame"
      >
        Add Game!
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script
  setup
  lang="ts"
>
import { useGameStore } from '~/store/gameStore';
import { useStore } from '~/store/mainStore.js';
import type { GameDetails } from '~/utils/types';

const mainStore = useStore();
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

const newGame = ref<GameDetails>(getNewGame());
const addingGame = ref(false);

async function addGame() {
  try {
    addingGame.value = true;
    // TODO add validation
    await gameStore.addGame(newGame.value);
    newGame.value = getNewGame();
    addingGame.value = false;
  } catch (error) {
    const handledError = error instanceof Error ? error : new Error('Unexpected error');
    mainStore.setSnackbar(handledError.message);
  }
}
</script>
