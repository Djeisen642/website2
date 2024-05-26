<template>
  <v-dialog v-model="show">
    <v-card>
      <v-card-title>Instructions</v-card-title>
      <v-card-text>
        <p>
          This is a two-player game of Pong. The goal is to score against your opponent.
        </p>
        <p>
          Controls:
        </p>
        <ul>
          <li>Player 1: Up: W, Down: S</li>
          <li>Player 2: Up: Arrow Up, Down: Arrow Down</li>
        </ul>
        <p>
          Gameplay:
        </p>
        <ul>
          <li>The ball starts in the center of the screen and moves randomly.</li>
          <li>Players control their paddles by moving them up and down.</li>
          <li>The ball bounces off the walls and paddles.</li>
          <li>If the ball hits the side of the screen, the other player scores a point.
          </li>
        </ul>
        <p>
          Additional Features:
        </p>
        <ul>
          <li>Pause: Press the P key to pause the game.</li>
        </ul>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="show = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script
  setup
  lang="ts"
>
const show = defineModel<boolean>();
</script>