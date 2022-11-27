<!-- eslint-disable vue/no-v-html -->
<!-- using v-html for links within descriptions -->
<template>
  <v-container fluid>
    <h2>These games were built for various game jams over the years.</h2>
    <p class="d-md-none font-italic">Click on row for more details.</p>
    <v-list lines="three">
      <div v-for="game in games" :key="game.title">
        <v-list-item class="display-large-game-list-item">
          <template #prepend>
            <v-avatar>
              <v-img cover :src="game.image" :srcset="game.imageSrcSet" />
            </v-avatar>
          </template>
          <v-list-item-title>{{ game.title }}</v-list-item-title>
          <v-list-item-subtitle>
            <span v-html="game.description"></span>
          </v-list-item-subtitle>

          <template #append>
            <v-list-item-action>
              <v-btn :href="game.link" target="_blank">Go to Game!</v-btn>
            </v-list-item-action>
          </template>
        </v-list-item>
        <v-list-item class="d-md-none" @click="onGameClick(game)">
          <template #prepend>
            <v-avatar>
              <v-img cover :src="game.image" :srcset="game.imageSrcSet" />
            </v-avatar>
          </template>
          <v-list-item-title>{{ game.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ game.shortDescription }}</v-list-item-subtitle>
        </v-list-item>
        <v-divider inset />
      </div>
    </v-list>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title>
          {{ selectedGame.title }}
        </v-card-title>
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
import { ref, useHead } from '#imports';

type GameDetails = {
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  imageSrcSet?: string;
  link: string;
};

const dialog = ref(false);
const selectedGame = ref<GameDetails>(null);

const onGameClick = (game: GameDetails) => {
  selectedGame.value = game;
  dialog.value = true;
};

const games = ref<GameDetails[]>([
  {
    title: 'Plonk - 2019',
    shortDescription: 'A game of spinning wheels and death!!! No two games are the same.',
    description:
      'A game of spinning wheels and death!!! No two games are the same. It gets more difficult as you play. <br/>Made in collaboration with <a href="https://www.linkedin.com/in/thomas-huneycutt-164842133/">Thomas Huneycutt</a> and <a href="https://www.linkedin.com/in/jason-punch-07317aab/">Jason Punch</a>',
    image: '/images/plonk.webp',
    imageSrcSet: '/images/plonk.webp 1x, /images/plonk2x.webp 2x',
    link: 'https://djeisen642.itch.io/plonk',
  },
  {
    title: 'SpaceBattlez - 2020',
    shortDescription: 'A competitive space battle!',
    description:
      'A competitive space battle! Game is based on Asteroids game play. <br/>Made in collaboration with  <a href="https://www.linkedin.com/in/thomas-huneycutt-164842133/">Thomas Huneycutt</a> and <a href="https://www.linkedin.com/in/jason-punch-07317aab/">Jason Punch</a>',
    image: '/images/spacebattlez.webp',
    imageSrcSet: '/images/spacebattlez.webp 1x, /images/spacebattlez2x.webp 2x',
    link: 'https://djeisen642.itch.io/spacebattlez',
  },
  {
    title: 'The Passing - 2019',
    shortDescription: 'A horror mystery thriller on a train about a cat.',
    description:
      'A tale unlike any you\'ve seen before. Travel with Zoey the Cat through this mystery thriller. <br/>Made in collaboration with  <a href="https://www.linkedin.com/in/thomas-huneycutt-164842133/">Thomas Huneycutt</a>',
    image: '/images/thepassing.webp',
    imageSrcSet: '/images/thepassing.webp 1x, /images/thepassing2x.webp 2x',
    link: 'https://djeisen642.itch.io/the-passing',
  },
  {
    title: 'Network Nightmares - 2017',
    shortDescription: 'A VR game to find a virus in a network.',
    description:
      'A Google Cardbard VR game made in Unity in which the player attempts to find a virus in an interconnected network. Won an award in a game jam. <br/>Made in collaboration with  <a href="https://www.linkedin.com/in/thomas-huneycutt-164842133/">Thomas Huneycutt</a>, John Hutcherson and Zoe Liu',
    image: '/images/networknightmares.webp',
    link: 'https://github.com/Djeisen642/vrcruizers',
  },
]);

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
